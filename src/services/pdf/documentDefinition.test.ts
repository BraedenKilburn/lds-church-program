import { describe, expect, it } from 'vitest';
import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ProgramData } from '../../types/program';
import { buildProgramDocumentDefinition } from './documentDefinition';
import { buildServiceOrderPage } from './sections';

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

function getStack(content: Content): Content[] {
  if (content && typeof content === 'object' && 'stack' in content && Array.isArray(content.stack)) {
    return content.stack as Content[];
  }

  throw new Error('Expected content stack.');
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

  it('omits blank chorister and organist rows', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(createProgram({ chorister: '', organist: '' })),
    );

    expect(text).not.toContain('Chorister');
    expect(text).not.toContain('Organist');
  });

  it('keeps music role spacing when chorister and organist rows are blank', () => {
    const stack = getStack(buildServiceOrderPage(createProgram({ chorister: '', organist: '' })));

    expect(stack[2]).toMatchObject({ text: '', margin: [0, 0, 0, 16] });
    expect(stack[3]).toMatchObject({ text: '', margin: [0, 0, 0, 46] });
    expect(collectText(stack[4])).toContain('Opening Hymn');
  });

  it('treats whitespace-only chorister and organist values as blank', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(createProgram({ chorister: '   ', organist: '\t' })),
    );

    expect(text).not.toContain('Chorister');
    expect(text).not.toContain('Organist');
  });

  it('includes filled chorister and organist rows', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({ chorister: 'Sister Chorister', organist: 'Brother Organist' }),
      ),
    );

    expect(text).toContain('Chorister');
    expect(text).toContain('Sister Chorister');
    expect(text).toContain('Organist');
    expect(text).toContain('Brother Organist');
  });
});
