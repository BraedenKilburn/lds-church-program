import { describe, expect, it } from 'vitest';
import type { ProgramData, StoredData } from '../types/program';
import { migrateStoredProgram } from './programMigrations';

type LegacyProgramFixture = Partial<Omit<ProgramData, 'announcements'>> &
  Record<string, unknown> & {
    announcements?: Array<
      { id: string; title: string; description: string } | { id: string; text: string }
    >;
  };

function createStoredData(data: LegacyProgramFixture): StoredData {
  return {
    version: 1,
    lastSaved: '2026-01-01T00:00:00.000Z',
    data: {
      stakeName: '',
      wardName: '',
      meetingDate: '2020-01-01',
      coverImage: null,
      presiding: '',
      conducting: '',
      organist: '',
      chorister: '',
      openingHymn: { number: '', title: '' },
      sacramentHymn: { number: '', title: '' },
      closingHymn: { number: '', title: '' },
      midProgramMusicType: 'congregationalHymn',
      congregationalHymn: { number: '', title: '' },
      specialMusic: { title: '', description: '' },
      invocation: '',
      benediction: '',
      isFastSunday: false,
      speakers: [{ id: 'speaker-1', name: '' }],
      announcements: [],
      missionaries: [],
      executiveSecretaryName: '',
      executiveSecretaryPhone: '',
      ...data,
    } as ProgramData,
  };
}

describe('program migrations', () => {
  it('migrates restHymn to congregationalHymn', () => {
    const migrated = migrateStoredProgram(
      createStoredData({
        congregationalHymn: undefined,
        restHymn: { number: '2', title: 'The Spirit of God' },
      }),
    );

    expect(migrated?.congregationalHymn).toEqual({
      number: '2',
      title: 'The Spirit of God',
    });
  });

  it('initializes missing mid-program music fields', () => {
    const migrated = migrateStoredProgram(
      createStoredData({
        midProgramMusicType: undefined,
        specialMusic: undefined,
      }),
    );

    expect(migrated?.midProgramMusicType).toBe('congregationalHymn');
    expect(migrated?.specialMusic).toEqual({ title: '', description: '' });
  });

  it('migrates old announcement text format', () => {
    const migrated = migrateStoredProgram(
      createStoredData({
        announcements: [{ id: 'announcement-1', text: 'Temple baptisms' }],
      }),
    );

    expect(migrated?.announcements).toEqual([
      { id: 'announcement-1', title: 'Temple baptisms', description: '' },
    ]);
  });

  it('initializes missing missionaries and contact fields', () => {
    const migrated = migrateStoredProgram(
      createStoredData({
        missionaries: undefined,
        executiveSecretaryName: undefined,
        executiveSecretaryPhone: undefined,
      }),
    );

    expect(migrated?.missionaries).toEqual([]);
    expect(migrated?.executiveSecretaryName).toBe('');
    expect(migrated?.executiveSecretaryPhone).toBe('');
  });
});
