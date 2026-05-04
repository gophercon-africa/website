export interface ReviewData {
  id: string;
  talkId: string;
  reviewerEmail: string;
  rating: number | null;
  notes: string;
  skipped: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TalkWithReview {
  id: string;
  talkTitle: string;
  talkDescription: string;
  talkCategory: string;
  talkDuration: string;
  talkLevel: string;
  bio: string;
  previousSpeakingExperience: string;
  additionalNotes: string;
  reviews: ReviewData[];
}

export interface ReviewFormState {
  errors?: {
    rating?: string[];
    notes?: string[];
    _form?: string[];
  };
  success?: boolean;
}
