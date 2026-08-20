'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Button from '@components/ui/Button';
import Container from '@components/ui/Container';
import Section from '@components/ui/Section';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up a real subscription backend.
    toast.success('Thanks — you’re on the list!');
    setEmail('');
  };

  return (
    <Section>
      <Container size="narrow" className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-ink">
          Stay up to date
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-body">
          Occasional emails about tickets, speakers, and the program. No spam.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            aria-label="Email address"
            required
            className="flex-1 rounded-control border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </Container>
    </Section>
  );
}
