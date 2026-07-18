import fs from "node:fs";
import path from "node:path";
import type { Role } from "./types";

const BOARD_URL = "https://jobs.ashbyhq.com/stackone";
const ROLES_PATH = path.join(process.cwd(), "data", "roles.json");

interface JobPosting {
  id: string;
  title: string;
  departmentName: string;
  teamName: string;
  locationName: string;
  workplaceType: string;
  employmentType: string;
}

function extractAppData<T>(html: string): T {
  const marker = "window.__appData = ";
  const start = html.indexOf(marker);
  if (start === -1) throw new Error("window.__appData not found in page source");
  const objStart = html.indexOf("{", start);
  let i = objStart;
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === "\\") esc = true;
      else if (ch === '"') inStr = false;
    } else if (ch === '"') {
      inStr = true;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return JSON.parse(html.slice(objStart, i)) as T;
}

function stripHtml(html: string): string {
  return (html ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

export async function fetchRoles(): Promise<Role[]> {
  const boardHtml = await fetchPage(BOARD_URL);
  const boardData = extractAppData<{ jobBoard: { jobPostings: JobPosting[] } }>(boardHtml);
  const postings: JobPosting[] = boardData.jobBoard.jobPostings;

  const roles: Role[] = [];
  for (const p of postings) {
    const jobUrl = `${BOARD_URL}/${p.id}`;
    const jobHtml = await fetchPage(jobUrl);
    const jobData = extractAppData<{ posting?: { descriptionHtml?: string } }>(jobHtml);
    const description = stripHtml(jobData.posting?.descriptionHtml ?? "");

    roles.push({
      id: p.id,
      title: p.title,
      department: p.departmentName ?? "",
      team: p.teamName ?? "",
      location: p.locationName ?? "",
      workplaceType: p.workplaceType ?? "",
      employmentType: p.employmentType ?? "",
      isRemote: /remote/i.test(p.workplaceType ?? ""),
      description,
      jobUrl,
    });
  }

  return roles;
}

export async function saveRoles(): Promise<Role[]> {
  const roles = await fetchRoles();
  fs.writeFileSync(ROLES_PATH, JSON.stringify(roles, null, 2), "utf8");
  return roles;
}
