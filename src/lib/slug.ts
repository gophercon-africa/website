/** 'Bala Grivine Ochieng' → 'bala-grivine-ochieng'. Deterministic, so the
 *  schedule and speakers pages agree on slugs without a join table. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
