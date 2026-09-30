'use client';

import { useState } from 'react';
import Button from '@components/ui/Button';
import Modal from '@components/common/Modal';
import { CONTACT_EMAIL } from '@/src/lib/links';

/** "Become a partner" call to action. The 2026 prospectus is being refreshed,
 *  so instead of a download this opens a short note with the contact address. */
export default function SponsorshipInquiry() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Sponsorship packages
      </Button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Partner with GopherCon Africa" size="sm">
        <div className="space-y-4 text-body">
          <p>
            We&apos;re updating the 2026 sponsorship prospectus. In the meantime, email us and
            we&apos;ll send you the current packages and answer any questions.
          </p>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=GopherCon%20Africa%202026%20sponsorship`}
              className="font-semibold text-brand hover:text-brand-dark dark:text-brand-bright dark:hover:text-brand-light"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
}
