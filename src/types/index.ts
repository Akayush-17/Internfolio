export interface BasicInfo {
  fullName: string;
  email: string;
  internshipRole: string;
  teamDepartment: string;
  managerName: string;
  startDate: string;
  endDate: string;
  summary: string;
  teammates?: { name: string }[];
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  tools: string[];
  other?: string;
  commits?: string;
  features?: string;
  linesOfCode?: number;
  contributions?: string;
}

export interface TechnicalLearningEntry {
  title: string;
  context: string;
  learning: string;
}

export interface SoftSkillEntry {
  title: string;
  context: string;
  learning: string;
}

export interface CollaborationEntry {
  title: string;
  context: string;
  learning: string;
  teams?: string[];
}

export interface Learning {
  currentlyLearning: string[];
  interestedIn: string[];
  technicalLearnings?: string;
  softSkills?: SoftSkillEntry[];
  crossTeamCollaboration?: CollaborationEntry[];
  technicalLearningEntries?: TechnicalLearningEntry[]; 
}

export interface PullRequest {
  title: string;
  description: string;
  link?: string;
  status: "Draft" | "Open" | "Merged" | "Closed";
  date?: string;
}

export interface Tickets {
  title: string;
  type: string;
  status: string;
  contribution: string;
  link: string;
}

export interface Docs {
  documentTitle: string;
  purpose: string;
  contribution: string;
  tags?: string;
  link?: string;
}

export interface Project {
  title: string;
  description: string;
  role: string;
  technologies: string[];
  outcome?: string;
  timelineStart?: string;
  timelineEnd?: string;
  link?: string;
  pullRequests: PullRequest[];
  media?: {
    type: "image" | "diagram" | "workflow" | "video";
    url: string;
    file?: File;
    caption?: string;
    isUpload?: boolean;
  }[];
  challenges?: {
    obstacle: string;
    approach: string;
    resolution: string;
    lessonsLearned: string;
    tags: string[];
  }[];
  tickets?: Tickets[];
  docs?: Docs[];
}

export interface FormData {
  basicInfo: BasicInfo;
  techStack: TechStack;
  learning: Learning;
  projects: Project[];
}
