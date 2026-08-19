import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary:
    'border border-line bg-surface text-ink hover:border-brand hover:text-brand',
  ghost: 'text-brand hover:text-brand-dark',
} as const;

const SIZES = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

type Variant = keyof typeof VARIANTS;
type Size = keyof typeof SIZES;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type LinkProps = CommonProps & { href: string; external?: boolean };
type NativeProps = CommonProps & { href?: undefined; external?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'children'
  >;

export type ButtonProps = LinkProps | NativeProps;

/** The site's only button. Ghost renders as a text action (no box). */
export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  href,
  external,
  ...rest
}: ButtonProps) {
  const classes = [
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
    VARIANTS[variant],
    variant === 'ghost' ? '' : `rounded-control ${SIZES[size]}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (typeof href === 'string') {
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
