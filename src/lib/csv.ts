function escapeCsvValue(value: string | number | null): string {
  const str = value === null ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(rows: Record<string, string | number | null>[], columns: string[]): string {
  const header = columns.map(escapeCsvValue).join(',');
  const lines = rows.map((row) => columns.map((col) => escapeCsvValue(row[col] ?? null)).join(','));
  return [header, ...lines].join('\n');
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
