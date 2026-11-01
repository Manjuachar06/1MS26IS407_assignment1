export interface CoreConcepts {
  problemStatement: string;
  primaryMethodology: string;
  breakthroughs: string;
  totalWordCount?: number;
}

export interface StudentProject {
  title: string;
  exactExtension: string;
  targetedMetric: string;
  techStack: string;
  difficulty: 'Beginner-Friendly' | 'Intermediate 3rd Year' | 'Advanced Capstone';
  timeline: string;
  resumeBullet: string;
  steps: string[];
}

export interface TokenStats {
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  budgetCap: number;
  efficiencyScore: string;
}

export interface PaperAnalysis {
  title: string;
  authors: string[];
  published?: string;
  category?: string;
  url?: string;
  pdfUrl?: string;
  arxivId?: string | null;
  coreConcepts: CoreConcepts;
  flowchart: string;
  studentProjects: StudentProject[];
  tokenStats: TokenStats;
  source?: string;
}
