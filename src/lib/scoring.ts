import type { Contact, Role, ScoreBreakdown, ScoreSignals } from "./types";
import { cosineSimilarity } from "./similarity";

export const WEIGHTS: ScoreSignals = {
  semantic: 0.5,
  experience: 0.25,
  seniority: 0.1,
  location: 0.05,
  availability: 0.1,
};

const STOPWORDS = new Set([
  "the", "and", "for", "with", "of", "to", "in", "a", "an", "senior", "junior",
  "lead", "staff", "principal", "head", "chief", "engineer", "manager",
]);

function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n));
}

function words(text: string): string[] {
  return text.toLowerCase().match(/[a-z0-9+#]+/g) ?? [];
}

function semanticSignal(contactVector: number[], roleVector: number[] | null): number {
  if (!roleVector) return 0;
  const cos = cosineSimilarity(contactVector, roleVector);
  return clamp((cos - 0.45) / 0.22);
}

function meaningfulWords(text: string): string[] {
  return Array.from(new Set(words(text).filter((w) => w.length > 2 && !STOPWORDS.has(w))));
}

function experienceSignal(contact: Contact, role: Role): number {
  const roleWords = new Set(meaningfulWords(`${role.title} ${role.description}`));
  let contactTerms = meaningfulWords(contact.topSkills.join(" "));
  if (contactTerms.length === 0) {
    contactTerms = meaningfulWords(
      `${contact.currentTitle} ${contact.experience.map((e) => e.title).join(" ")}`,
    );
  }
  if (contactTerms.length === 0) return 0.4;

  let hits = 0;
  for (const w of contactTerms) if (roleWords.has(w)) hits++;
  return clamp(hits / contactTerms.length);
}

function seniorityLevel(text: string): number {
  if (/\b(chief|cto|ceo|vp|head|director|principal|staff|lead|founder)\b/i.test(text)) return 3;
  if (/\b(senior|sr\.?|manager)\b/i.test(text)) return 2;
  if (/\b(junior|jr\.?|associate|intern|graduate|entry)\b/i.test(text)) return 1;
  return 2;
}

function totalYears(contact: Contact): number {
  let years = 0;
  for (const e of contact.experience) {
    const y = e.duration.match(/(\d+)\s*yr/);
    const m = e.duration.match(/(\d+)\s*mo/);
    years += (y ? Number(y[1]) : 0) + (m ? Number(m[1]) / 12 : 0);
  }
  return years;
}

function senioritySignal(contact: Contact, role: Role): number {
  const roleLevel = seniorityLevel(role.title);
  let contactLevel = seniorityLevel(contact.currentTitle);
  if (totalYears(contact) >= 8) contactLevel = Math.max(contactLevel, 3);
  return clamp(1 - Math.abs(roleLevel - contactLevel) / 2);
}

function locationSignal(contact: Contact, role: Role): number {
  const roleCity = (role.location || "").split(",")[0].trim().toLowerCase();
  const contactLoc = (contact.location || "").toLowerCase();
  if (roleCity && contactLoc.includes(roleCity)) return 1;
  if (role.isRemote || /hybrid|remote/i.test(role.workplaceType)) return 0.6;
  return 0.2;
}

function availabilitySignal(contact: Contact): number {
  return contact.openToWork ? 1 : 0.4;
}

export function scoreContact(
  contact: Contact,
  contactVector: number[],
  role: Role,
  roleVector: number[] | null,
): ScoreBreakdown {
  const signals: ScoreSignals = {
    semantic: semanticSignal(contactVector, roleVector),
    experience: experienceSignal(contact, role),
    seniority: senioritySignal(contact, role),
    location: locationSignal(contact, role),
    availability: availabilitySignal(contact),
  };

  const total =
    100 *
    (signals.semantic * WEIGHTS.semantic +
      signals.experience * WEIGHTS.experience +
      signals.seniority * WEIGHTS.seniority +
      signals.location * WEIGHTS.location +
      signals.availability * WEIGHTS.availability);

  return { total: Math.round(total), signals };
}
