import { isReviewPeriodOpen } from '@/src/lib/config';
import ReviewPeriodClosed from '../_components/ReviewPeriodClosed';
import ReviewWorkspaceClient from './ReviewWorkspaceClient';

// The deadline check must run per-request, not at build time — a prerendered
// page would bake in whichever side of REVIEW_DEADLINE the build ran on.
export const dynamic = 'force-dynamic';

export default function ReviewWorkspacePage() {
  if (!isReviewPeriodOpen()) {
    return <ReviewPeriodClosed />;
  }
  return <ReviewWorkspaceClient />;
}
