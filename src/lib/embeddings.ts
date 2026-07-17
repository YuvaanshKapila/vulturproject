import fs from "node:fs";
import path from "node:path";
import { loadContacts } from "./contacts";
import { contactProfileText, roleProfileText } from "./profileText";
import type { Role } from "./types";

const OLLAMA_URL = "http://localhost:11434/api/embed";
const MODEL = "qwen3-embedding:4b";
const BATCH_SIZE = 32;
const CONTACT_EMBEDDINGS_PATH = path.join(process.cwd(), "data", "contact-embeddings.json");
const ROLE_EMBEDDINGS_PATH = path.join(process.cwd(), "data", "role-embeddings.json");

export const ROLE_INSTRUCTION =
  "Given a job posting, retrieve the profiles of professionals whose skills, experience, and background make them a strong match for the role.";

export interface EmbeddedContact {
  id: string;
  vector: number[];
}

function withInstruction(text: string, instruction?: string): string {
  return instruction ? `Instruct: ${instruction}\nQuery: ${text}` : text;
}

function round(vector: number[]): number[] {
  return vector.map((v) => Number(v.toFixed(6)));
}

export async function embedTexts(texts: string[], instruction?: string): Promise<number[][]> {
  const input = texts.map((t) => withInstruction(t, instruction));
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, input }),
  });
  if (!res.ok) throw new Error(`Ollama embed failed: ${res.status}`);
  const data: { embeddings: number[][] } = await res.json();
  return data.embeddings;
}

export async function embedRole(role: Role): Promise<number[]> {
  const [vector] = await embedTexts([roleProfileText(role)], ROLE_INSTRUCTION);
  return round(vector);
}

export function loadRoleVectorCache(): Record<string, number[]> {
  try {
    return JSON.parse(fs.readFileSync(ROLE_EMBEDDINGS_PATH, "utf8"));
  } catch {
    return {};
  }
}

export async function saveRoleEmbeddings(roles: Role[]): Promise<Record<string, number[]>> {
  const cache: Record<string, number[]> = {};
  for (const role of roles) {
    cache[role.id] = await embedRole(role);
  }
  fs.writeFileSync(ROLE_EMBEDDINGS_PATH, JSON.stringify(cache), "utf8");
  return cache;
}

export async function embedContacts(): Promise<EmbeddedContact[]> {
  const contacts = loadContacts();
  const results: EmbeddedContact[] = [];

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    const batch = contacts.slice(i, i + BATCH_SIZE);
    const texts = batch.map(contactProfileText);
    const vectors = await embedTexts(texts);
    batch.forEach((contact, j) => {
      results.push({ id: contact.id, vector: round(vectors[j]) });
    });
    console.log(`embedded ${Math.min(i + BATCH_SIZE, contacts.length)}/${contacts.length}`);
  }

  fs.writeFileSync(CONTACT_EMBEDDINGS_PATH, JSON.stringify(results), "utf8");
  return results;
}
