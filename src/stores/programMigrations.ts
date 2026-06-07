import type { Announcement, ProgramData, StoredData } from '../types/program';
import { getNextSunday, isFirstSundayOfMonth } from '../utils/date';
import { STORAGE_VERSION } from './storageKeys';

type LegacyStoredProgram = ProgramData & {
  restHymn?: { number: string; title: string };
  calendarItems?: unknown[];
  announcements?: (Announcement | { id: string; text: string })[];
};

function hasLegacyAnnouncementText(
  announcement: Announcement | { id: string; text: string } | undefined,
): announcement is { id: string; text: string } {
  return Boolean(announcement && 'text' in announcement);
}

export function migrateStoredProgram(parsed: StoredData): ProgramData | null {
  if (parsed.version !== STORAGE_VERSION) {
    return null;
  }

  const data = parsed.data as LegacyStoredProgram;

  if (data.restHymn && !data.congregationalHymn) {
    data.congregationalHymn = data.restHymn;
    delete data.restHymn;
  }

  if (!data.congregationalHymn) {
    data.congregationalHymn = { number: '', title: '' };
  }

  const firstAnnouncement = data.announcements?.[0];
  if (hasLegacyAnnouncementText(firstAnnouncement)) {
    data.announcements = data.announcements?.map((announcement): Announcement => {
      if ('text' in announcement) {
        return {
          id: announcement.id,
          title: String(announcement.text),
          description: '',
        };
      }

      return announcement;
    }) as Announcement[];
  }

  delete data.calendarItems;

  data.announcements ??= [];
  data.missionaries ??= [];
  data.executiveSecretaryName ??= '';
  data.executiveSecretaryPhone ??= '';

  const nextSunday = getNextSunday();
  data.meetingDate = nextSunday;
  data.isFastSunday = isFirstSundayOfMonth(nextSunday);

  return data;
}
