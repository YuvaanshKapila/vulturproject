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
