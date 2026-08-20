/** Section title block. The overline is plain uppercase text — never a chip. */
export default function SectionHeading({
  overline,
  title,
  description,
  align = 'center',
}: {
  overline?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'text-center' : ''}>
      {overline && (
        <p className="text-xs font-semibold uppercase tracking-wide text-brand dark:text-brand-bright">
          {overline}
        </p>
      )}
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-2xl text-lg text-muted ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
}
