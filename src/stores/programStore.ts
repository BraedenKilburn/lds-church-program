import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ProgramData, StoredData } from '../types/program';

const STORAGE_KEY = 'ward-program-data';
const STORAGE_VERSION = 1;

function createDefaultProgram(): ProgramData {
  return {
    stakeName: '',
    wardName: '',
    meetingDate: new Date().toISOString().split('T')[0],
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

    speakers: [{ id: crypto.randomUUID(), name: '', topic: '' }],

    announcements: [{ id: crypto.randomUUID(), text: '' }],
    calendarItems: [],
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
          program.value = parsed.data;
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
      topic: '',
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
      text: '',
    });
  }

  function removeAnnouncement(id: string): void {
    const index = program.value.announcements.findIndex((a) => a.id === id);
    if (index > -1 && program.value.announcements.length > 1) {
      program.value.announcements.splice(index, 1);
    }
  }

  function addCalendarItem(): void {
    program.value.calendarItems.push({
      id: crypto.randomUUID(),
      date: '',
      event: '',
    });
  }

  function removeCalendarItem(id: string): void {
    const index = program.value.calendarItems.findIndex((c) => c.id === id);
    if (index > -1) {
      program.value.calendarItems.splice(index, 1);
    }
  }

  function setCoverImage(base64: string | null): void {
    program.value.coverImage = base64;
  }

  // Load from storage on initialization
  loadFromStorage();

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
    addCalendarItem,
    removeCalendarItem,
    setCoverImage,
  };
});
