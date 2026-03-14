export interface ReviewData {
  id: string;
  talkId: string;
  reviewerEmail: string;
  rating: number;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TalkWithReview {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  bio: string;
  talkTitle: string;
  talkDescription: string;
  talkCategory: string;
  talkDuration: string;
  talkLevel: string;
  previousSpeakingExperience: string;
  additionalNotes: string;
  eventYear: string;
  IsAccepted: boolean;
  IsPendingReview: boolean;
  createdAt: Date;
  updatedAt: Date;
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
