export interface AdminStats {
  total: number;
  pending: number;
  reviewed: number;
  accepted: number;
  rejected: number;
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
