import type { ProgramData, ProgramValidationResult } from '../types/program';

function hasHymnValue(hymn: { number: string; title: string }): boolean {
  return Boolean(hymn.number.trim() || hymn.title.trim());
}

export function validateProgram(data: ProgramData): ProgramValidationResult {
  const errors = [];

  if (!data.wardName.trim()) {
    errors.push({ field: 'wardName', message: 'Ward name is required.' });
  }

  if (!data.meetingDate.trim()) {
    errors.push({ field: 'meetingDate', message: 'Meeting date is required.' });
  }

  if (!hasHymnValue(data.openingHymn)) {
    errors.push({ field: 'openingHymn', message: 'Opening hymn is required.' });
  }

  if (!hasHymnValue(data.sacramentHymn)) {
    errors.push({ field: 'sacramentHymn', message: 'Sacrament hymn is required.' });
  }

  if (!hasHymnValue(data.closingHymn)) {
    errors.push({ field: 'closingHymn', message: 'Closing hymn is required.' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
