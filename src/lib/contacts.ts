import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import type { Contact, Experience, Education } from "./types";

interface RawRow {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  currentCompany: string;
  currentTitle: string;
  headline: string;
  location: string;
  about: string;
  topSkills: string;
  experienceSummary: string;
  educationSummary: string;
  connectionsCount: string;
  openToWork: string;
  certifications: string;
}

const CSV_PATH = path.join(process.cwd(), "data", "contacts.csv");

function splitPipes(value: string): string[] {
  return (value ?? "").split("|").map((s) => s.trim()).filter(Boolean);
}

function splitCommas(value: string): string[] {
  return (value ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

function parseExperience(entry: string): Experience {
  const isCurrent = /\[Current\]/i.test(entry);
  let text = entry.replace(/\[Current\]/i, "").trim();

  let duration = "";
  const durationMatch = text.match(/\(([^)]*)\)\s*$/);
  if (durationMatch) {
    duration = durationMatch[1].trim();
    text = text.slice(0, durationMatch.index).trim();
  }

  const [titlePart, ...companyParts] = text.split("@");
  return {
    title: titlePart.trim(),
    company: companyParts.join("@").trim(),
    duration,
    isCurrent,
  };
}

function parseEducation(entry: string): Education {
  const [degree = "", field = "", ...schoolParts] = entry.split(",").map((s) => s.trim());
  return { degree, field, school: schoolParts.join(", ") };
}

function toContact(row: RawRow): Contact {
  return {
    id: row.id,
    firstName: row.firstName ?? "",
    lastName: row.lastName ?? "",
    linkedinUrl: row.linkedinUrl ?? "",
    currentCompany: row.currentCompany ?? "",
    currentTitle: row.currentTitle ?? "",
    headline: row.headline ?? "",
    location: row.location ?? "",
    about: row.about ?? "",
    topSkills: splitCommas(row.topSkills),
    experience: splitPipes(row.experienceSummary).map(parseExperience),
    education: splitPipes(row.educationSummary).map(parseEducation),
    connectionsCount: Number.parseInt(row.connectionsCount, 10) || 0,
    openToWork: /^true$/i.test((row.openToWork ?? "").trim()),
    certifications: splitPipes(row.certifications),
  };
}

export function loadContacts(): Contact[] {
  const csv = fs.readFileSync(CSV_PATH, "utf8");
  const { data } = Papa.parse<RawRow>(csv, { header: true, skipEmptyLines: true });
  return data.filter((row) => row.id).map(toContact);
}
