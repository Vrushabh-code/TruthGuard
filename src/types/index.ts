export interface Article {
  title: string;
  content: string;
  url?: string;
  source?: string;
}

export interface PredictionResult {
  id: string;
  article: Article;
  prediction: 'fake' | 'real';
  confidence: number;
  keyIndicators: string[];
  timestamp: Date;
  sources: string[];
  userFeedback?: 'correct' | 'incorrect';
  verificationMethod?: 'online_verification' | 'content_analysis' | 'hybrid';
}