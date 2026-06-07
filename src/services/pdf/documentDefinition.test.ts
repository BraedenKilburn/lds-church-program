import { describe, expect, it } from 'vitest';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ProgramData } from '../../types/program';
import { buildProgramDocumentDefinition } from './documentDefinition';

function createProgram(overrides: Partial<ProgramData> = {}): ProgramData {
  return {
    stakeName: 'Example Stake',
    wardName: 'Example Ward',
    meetingDate: '2026-06-07',
    coverImage: null,
    presiding: 'Bishop Example',
    conducting: 'Brother Conducting',
    organist: 'Organist',
    chorister: 'Chorister',
    openingHymn: { number: '1', title: 'The Morning Breaks' },
    sacramentHymn: { number: '169', title: 'As Now We Take the Sacrament' },
    closingHymn: { number: '2', title: 'The Spirit of God' },
    congregationalHymn: { number: '', title: '' },
    invocation: '',
    benediction: '',
    isFastSunday: false,
    speakers: [
      { id: 'speaker-1', name: 'First Speaker' },
      { id: 'speaker-2', name: 'Final Speaker' },
    ],
    announcements: [],
    missionaries: [],
    executiveSecretaryName: '',
    executiveSecretaryPhone: '',
    ...overrides,
  };
}

function collectText(value: unknown): string[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  if ('text' in value && typeof value.text === 'string') {
    return [value.text];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  return Object.values(value).flatMap(collectText);
}

function getDocumentText(doc: TDocumentDefinitions): string[] {
  return collectText(doc.content as Content);
}

describe('buildProgramDocumentDefinition', () => {
  it('includes regular Sunday speakers', () => {
    const text = getDocumentText(buildProgramDocumentDefinition(createProgram()));

    expect(text).toContain('First Speaker');
    expect(text).toContain('Final Speaker');
  });

  it('includes testimony content and omits speakers on fast Sunday', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(createProgram({ isFastSunday: true })),
    );

    expect(text).toContain('TESTIMONIES');
    expect(text).toContain('Please focus your testimony on Jesus Christ');
    expect(text).not.toContain('First Speaker');
  });

  it('inserts congregational hymn before the final speaker', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({ congregationalHymn: { number: '3', title: 'Now Let Us Rejoice' } }),
      ),
    );

    expect(text.indexOf('Congregational Hymn')).toBeLessThan(text.indexOf('Final Speaker'));
  });

  it('uses invitation fallback text for blank prayers', () => {
    const text = getDocumentText(buildProgramDocumentDefinition(createProgram()));

    expect(text.filter((entry) => entry === 'By Invitation')).toHaveLength(2);
  });
});
