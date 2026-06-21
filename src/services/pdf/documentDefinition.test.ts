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
    midProgramMusicType: 'congregationalHymn',
    congregationalHymn: { number: '', title: '' },
    specialMusic: { title: '', description: '' },
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
  if (
    content &&
    typeof content === 'object' &&
    'stack' in content &&
    Array.isArray(content.stack)
  ) {
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

  it('inserts special music before the final speaker', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({
          midProgramMusicType: 'specialMusic',
          specialMusic: {
            title: "Father's Day Musical Number",
            description: 'Primary children singing "My Dad" and "Love Is Spoken Here"',
          },
        }),
      ),
    );

    expect(text.indexOf("Father's Day Musical Number")).toBeLessThan(text.indexOf('Final Speaker'));
  });

  it('renders special music title and description', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({
          midProgramMusicType: 'specialMusic',
          specialMusic: {
            title: 'Special Musical Number',
            description: '"Come Thou Fount" - Jane Doe, violin',
          },
        }),
      ),
    );

    expect(text).toContain('Special Musical Number');
    expect(text).toContain('"Come Thou Fount" - Jane Doe, violin');
  });

  it('omits blank special music', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({
          midProgramMusicType: 'specialMusic',
          specialMusic: { title: '', description: '' },
        }),
      ),
    );

    expect(text).not.toContain('Special Musical Number');
  });

  it('uses compact spacing when special music is present with three or more speakers', () => {
    const stack = getStack(
      buildServiceOrderPage(
        createProgram({
          midProgramMusicType: 'specialMusic',
          specialMusic: { title: 'Special Musical Number', description: 'Ward choir' },
          speakers: [
            { id: 'speaker-1', name: 'First Speaker' },
            { id: 'speaker-2', name: 'Second Speaker' },
            { id: 'speaker-3', name: 'Final Speaker' },
          ],
        }),
      ),
    );

    expect(collectText(stack[6])).toContain('Sacrament Hymn');
    expect(stack[6]).toMatchObject({ margin: [0, 0, 0, 24] });
  });

  it('omits special music on fast Sunday', () => {
    const text = getDocumentText(
      buildProgramDocumentDefinition(
        createProgram({
          isFastSunday: true,
          midProgramMusicType: 'specialMusic',
          specialMusic: { title: 'Special Musical Number', description: 'Ward choir' },
        }),
      ),
    );

    expect(text).not.toContain('Special Musical Number');
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

    expect(stack[2]).toMatchObject({ text: '', margin: [0, 0, 0, 12] });
    expect(stack[3]).toMatchObject({ text: '', margin: [0, 0, 0, 42] });
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
