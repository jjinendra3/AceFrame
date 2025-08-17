interface Candidate {
  id: string;
  name: string;
  email: string;
}
interface Auth {
  message: string;
  success: boolean;
}
export type GeneralStore = {
  interviewId: string | null;
  candidate: Candidate | null;
  round: string | null;
  startAudio: Blob | null;
  resume: Blob | null;
  setResume: (resume: Blob | null) => void;
  setRound: (round: string) => void;
  setStartAudio: (audio: Blob | null) => void;
  setInterviewId: (id: string | null) => void;
  setCandidate: (id: string, name: string, email: string) => void;
  logout: () => Promise<Auth>;
  loginWithGoogle: () => Promise<Auth>;

  rehydrateState?: () => void;
};

type InterviewID = {
  success: boolean;
  id: string;
};

export type Conversation = {
  role: string;
  content: string;
};
export type InterviewStore = {
  isRecording: boolean;
  aiSpeaking: boolean;
  isLoading: boolean;
  seconds: string | null;
  minutes: string | null;
  subtitles: string | null;
  interviewEnded: boolean;
  conversation: Conversation[];
  currentAudio: HTMLAudioElement | null;  
  setConversation: (conversation: Conversation[]) => void;
  setSubtitles: (subtitles: string | null) => void;
  startInterview: (round: string) => Promise<InterviewID>;
  setSeconds: (seconds: string | null) => void;
  setMinutes: (minutes: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setAiSpeaking: (speaking: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  setInterviewEnded: (ended: boolean) => void;
  playPing: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  stopAudio: () => void;
  record: () => void;
  playAudio: (audioBlob: Blob) => void;
  sendAudio: (audioBlob: Blob) => void;
  endInterview: () => Promise<void>;
  endRecording: () => void;
};
