export interface Vocabulary {
  id: string;
  word: string;
  meaning: string;
}

export interface Question {
  id: string;
  qno: number;
  text: string;
}

export interface Note {
  id: string;
  title: string;
  content: string; // HTML string
  vocabularies: Vocabulary[];
  image: string | null; // Base64 data URL
  questions: Question[];
  createdAt: number;
}
