import fs from "node:fs";
import path from "node:path";
import type { Role, RankedCandidate } from "./types";
import { rankContacts } from "./rank";

const ROLES_PATH = path.join(process.cwd(), "data", "roles.json");

export function getRoles(): Role[] {
  return JSON.parse(fs.readFileSync(ROLES_PATH, "utf8"));
}

export function getRoleById(id: string): Role | undefined {
  return getRoles().find((r) => r.id === id);
}

export async function getRankedForRole(id: string, topN = 20): Promise<RankedCandidate[]> {
  const role = getRoleById(id);
  if (!role) return [];
  return rankContacts(role, topN);
}
