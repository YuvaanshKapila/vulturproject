export interface Experience {
  title: string;
  company: string;
  duration: string;
  isCurrent: boolean;
}

export interface Education {
  degree: string;
  field: string;
  school: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  currentCompany: string;
  currentTitle: string;
  headline: string;
  location: string;
  about: string;
  topSkills: string[];
  experience: Experience[];
  education: Education[];
  connectionsCount: number;
  openToWork: boolean;
  certifications: string[];
}

export interface Role {
  id: string;
  title: string;
  department: string;
  team: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  isRemote: boolean;
  description: string;
  jobUrl: string;
}

export interface ScoreSignals {
  semantic: number;
  experience: number;
  seniority: number;
  location: number;
  availability: number;
}

export interface ScoreBreakdown {
  total: number;
  signals: ScoreSignals;
}

export interface RankedCandidate {
  contact: Contact;
  score: ScoreBreakdown;
}
