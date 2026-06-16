import type { TalkStatus } from '@/src/lib/talkStatus';

export interface AdminStats {
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
}

export interface AdminSubmission {
  id: string;
  talkTitle: string;
  fullName: string;
  email: string;
  talkCategory: string;
  status: TalkStatus;
  averageRating: number | null;
  reviewCount: number;
  skippedCount: number;
  duplicateCount: number;
  duplicateTalks: { id: string; talkTitle: string }[];
}

export interface AdminReview {
  id: string;
  reviewerEmail: string;
  rating: number | null;
  notes: string;
  skipped: boolean;
  skipReason: string | null;
  updatedAt: string;
}

export interface AdminSubmissionDetail {
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
  status: TalkStatus;
  decisionNotes: string | null;
  averageRating: number | null;
  reviewCount: number;
  reviews: AdminReview[];
}

export interface ReviewerProgress {
  reviewerEmail: string;
  reviewsCompleted: number;
  totalSubmissions: number;
  percentageComplete: number;
}

export interface AdminProgressResponse {
  reviewers: ReviewerProgress[];
  totalSubmissions: number;
}
