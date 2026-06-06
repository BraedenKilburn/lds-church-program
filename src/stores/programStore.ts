import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ProgramData, StoredData } from '../types/program';

const STORAGE_KEY = 'ward-program-data';
const STORAGE_VERSION = 1;

function getNextSunday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + daysUntilSunday);

  // Use local date methods to avoid timezone issues with toISOString()
  const year = nextSunday.getFullYear();
  const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
  const day = String(nextSunday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isFirstSundayOfMonth(dateStr: string): boolean {
  const date = new Date(dateStr + 'T12:00:00');
  // First Sunday is always on day 1-7 of the month
  return date.getDay() === 0 && date.getDate() <= 7;
}

function createDefaultProgram(): ProgramData {
  const nextSunday = getNextSunday();
  return {
    stakeName: '',
    wardName: '',
    meetingDate: nextSunday,
    coverImage: null,

    presiding: '',
    conducting: '',
    organist: '',
    chorister: '',

    openingHymn: { number: '', title: '' },
    sacramentHymn: { number: '', title: '' },
    closingHymn: { number: '', title: '' },
    congregationalHymn: { number: '', title: '' },

    invocation: '',
    benediction: '',

    isFastSunday: isFirstSundayOfMonth(nextSunday),
    speakers: [{ id: crypto.randomUUID(), name: '' }],

    announcements: [],
    missionaries: [],
    executiveSecretaryName: '',
    executiveSecretaryPhone: '',
  };
}

export const useProgramStore = defineStore('program', () => {
  const program = ref<ProgramData>(createDefaultProgram());

  function loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredData = JSON.parse(stored);
        if (parsed.version === STORAGE_VERSION) {
          const data = parsed.data as ProgramData & {
            restHymn?: { number: string; title: string };
            calendarItems?: unknown[];
          };

          // Migrate old restHymn to congregationalHymn
          if (data.restHymn && !data.congregationalHymn) {
            data.congregationalHymn = data.restHymn;
            delete data.restHymn;
          }
          if (!data.congregationalHymn) {
            data.congregationalHymn = { number: '', title: '' };
          }

          // Migrate old announcement format (text -> title/description)
          const firstAnnouncement = data.announcements?.[0];
          if (firstAnnouncement && 'text' in firstAnnouncement) {
            data.announcements = (data.announcements as unknown as { id: string; text: string }[]).map((a) => ({
              id: a.id,
              title: a.text,
              description: '',
            }));
          }

          // Remove old calendarItems
          delete data.calendarItems;

          // Ensure new fields exist
          if (!data.announcements) data.announcements = [];
          if (!data.missionaries) data.missionaries = [];
          if (!data.executiveSecretaryName) data.executiveSecretaryName = '';
          if (!data.executiveSecretaryPhone) data.executiveSecretaryPhone = '';

          // Always reset meeting date to the upcoming Sunday on load
          const nextSunday = getNextSunday();
          data.meetingDate = nextSunday;
          data.isFastSunday = isFirstSundayOfMonth(nextSunday);

          program.value = data;
        }
      } catch (e) {
        console.warn('Failed to parse stored program data', e);
      }
    }
  }

  function saveToStorage(): void {
    const toStore: StoredData = {
      version: STORAGE_VERSION,
      data: program.value,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  function clearProgram(): void {
    program.value = createDefaultProgram();
    localStorage.removeItem(STORAGE_KEY);
  }

  function addSpeaker(): void {
    program.value.speakers.push({
      id: crypto.randomUUID(),
      name: '',
    });
  }

  function removeSpeaker(id: string): void {
    const index = program.value.speakers.findIndex((s) => s.id === id);
    if (index > -1 && program.value.speakers.length > 1) {
      program.value.speakers.splice(index, 1);
    }
  }

  function addAnnouncement(): void {
    program.value.announcements.push({
      id: crypto.randomUUID(),
      title: '',
      description: '',
    });
  }

  function removeAnnouncement(id: string): void {
    const index = program.value.announcements.findIndex((a) => a.id === id);
    if (index > -1) {
      program.value.announcements.splice(index, 1);
    }
  }

  function addMissionary(): void {
    program.value.missionaries.push({
      id: crypto.randomUUID(),
      name: '',
      mission: '',
      email: '',
    });
  }

  function removeMissionary(id: string): void {
    const index = program.value.missionaries.findIndex((m) => m.id === id);
    if (index > -1) {
      program.value.missionaries.splice(index, 1);
    }
  }

  function setCoverImage(base64: string | null): void {
    program.value.coverImage = base64;
  }

  // Load from storage on initialization
  loadFromStorage();

  // Auto-update isFastSunday when meeting date changes
  watch(
    () => program.value.meetingDate,
    (newDate) => {
      if (newDate) {
        program.value.isFastSunday = isFirstSundayOfMonth(newDate);
      }
    }
  );

  // Auto-save on any change
  watch(
    program,
    () => {
      saveToStorage();
    },
    { deep: true }
  );

  return {
    program,
    loadFromStorage,
    saveToStorage,
    clearProgram,
    addSpeaker,
    removeSpeaker,
    addAnnouncement,
    removeAnnouncement,
    addMissionary,
    removeMissionary,
    setCoverImage,
  };
});
