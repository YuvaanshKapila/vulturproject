import type { Contact, Role } from "./types";

function joinParts(parts: (string | undefined)[]): string {
  return parts.map((p) => (p ?? "").trim()).filter(Boolean).join("\n");
}

export function contactProfileText(contact: Contact): string {
  const experience = contact.experience
    .map((e) => [e.title, e.company].filter(Boolean).join(" at "))
    .filter(Boolean)
    .join("; ");

  const education = contact.education
    .map((e) => [e.degree, e.field, e.school].filter(Boolean).join(", "))
    .filter(Boolean)
    .join("; ");

  return joinParts([
    contact.currentTitle,
    contact.headline,
    contact.topSkills.length ? `Skills: ${contact.topSkills.join(", ")}` : "",
    experience ? `Experience: ${experience}` : "",
    education ? `Education: ${education}` : "",
    contact.certifications.length ? `Certifications: ${contact.certifications.join(", ")}` : "",
    contact.about,
  ]);
}

export function roleProfileText(role: Role): string {
  const workplace = [role.location, role.workplaceType].filter(Boolean).join(", ");

  return joinParts([
    role.title,
    role.department ? `Department: ${role.department}` : "",
    workplace ? `Location: ${workplace}` : "",
    role.description,
  ]);
}
