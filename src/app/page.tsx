import LandingPage from '../pages/landing-page';
import { CALL_FOR_SPEAKERS_OPEN } from '@/src/lib/config';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
        <LandingPage cfsOpen={CALL_FOR_SPEAKERS_OPEN} />
    </div>
  );
}