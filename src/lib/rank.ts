import fs from "node:fs";
import path from "node:path";
import type { Role, RankedCandidate } from "./types";
import { loadContacts } from "./contacts";
import { embedRole, loadRoleVectorCache, type EmbeddedContact } from "./embeddings";
import { scoreContact } from "./scoring";

const CONTACT_EMBEDDINGS_PATH = path.join(process.cwd(), "data", "contact-embeddings.json");

function loadContactVectors(): Map<string, number[]> {
  const raw: EmbeddedContact[] = JSON.parse(fs.readFileSync(CONTACT_EMBEDDINGS_PATH, "utf8"));
  return new Map(raw.map((e) => [e.id, e.vector]));
}

async function getRoleVector(role: Role): Promise<number[] | null> {
  const cache = loadRoleVectorCache();
  if (cache[role.id]) return cache[role.id];
  try {
    return await embedRole(role);
  } catch {
    return null;
  }
}

export async function rankContacts(role: Role, topN?: number): Promise<RankedCandidate[]> {
  const contacts = loadContacts();
  const vectors = loadContactVectors();
  const roleVector = await getRoleVector(role);

  const ranked: RankedCandidate[] = contacts
    .filter((c) => vectors.has(c.id))
    .map((contact) => ({
      contact,
      score: scoreContact(contact, vectors.get(contact.id)!, role, roleVector),
    }))
    .sort((a, b) => b.score.total - a.score.total);

  return topN ? ranked.slice(0, topN) : ranked;
}
