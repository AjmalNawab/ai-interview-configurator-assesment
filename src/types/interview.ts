export type InterviewType =
  | "Technical"
  | "Behavioral"
  | "System Design"
  | "Mixed";
export type Difficulty = "Junior" | "Mid" | "Senior" | "Lead";
export type Duration = 15 | 30 | 45 | 60;

export interface AddOns {
  aiFollowUp: boolean;
  performanceReport: boolean;
  videoRecording: boolean;
  expertReview: boolean;
}

export interface InterviewConfig {
  interviewType?: InterviewType;
  difficulty?: Difficulty;
  topics: string[];
  duration?: Duration;
  addOns: AddOns;
}
