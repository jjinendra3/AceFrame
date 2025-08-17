interface ChatHistoryPart {
  text: string;
}
export interface ChatHistory {
  role: string;
  parts: ChatHistoryPart[];
}
export interface AI {
  speechToText?: string;
  reply?: string;
  dsaQuestion?: string | null;
  codeHelp?: string | null;
}

export interface InterviewEvaluation {
  scores: {
    communicationSkills: number;
    technicalKnowledge: number;
    problemSolvingAbility: number;
    behavioralCompetence: number;
    overallImpression: number;
  };

  feedback: {
    communicationFeedback: string;
    technicalFeedback: string;
    problemSolvingFeedback: string;
    behavioralFeedback: string;
    overallFeedback: string;
  };

  highlights: {
    topStrengths: string[];
    improvementAreas: string[];
  };

  recommendations: string[];

  keyMoments: {
    question: string;
    responseEvaluation: string;
    improvementSuggestion: string;
  }[];

  report: string;
}
