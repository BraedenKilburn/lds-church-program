import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { ProgramData, StoredData } from '../types/program';
import { createDefaultProgram } from './programDefaults';
import { migrateStoredProgram } from './programMigrations';
import { STORAGE_KEY, STORAGE_VERSION } from './storageKeys';
import { isFirstSundayOfMonth } from '../utils/date';

const SAVE_DEBOUNCE_MS = 300;

export const useProgramStore = defineStore('program', () => {
  const program = ref<ProgramData>(createDefaultProgram());
  let saveTimer: number | null = null;

  function loadFromStorage(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredData = JSON.parse(stored);
        const data = migrateStoredProgram(parsed);
        if (data) {
          program.value = data;
        }
      } catch (e) {
        console.warn('Failed to parse stored program data', e);
      }
    }
  }

  function saveToStorage(): void {
    if (saveTimer) {
      window.clearTimeout(saveTimer);
      saveTimer = null;
    }

    const toStore: StoredData = {
      version: STORAGE_VERSION,
      data: program.value,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  function scheduleSaveToStorage(): void {
    if (saveTimer) {
      window.clearTimeout(saveTimer);
    }

    saveTimer = window.setTimeout(() => {
      saveToStorage();
    }, SAVE_DEBOUNCE_MS);
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
    },
  );

  // Auto-save on any change
  watch(
    program,
    () => {
      scheduleSaveToStorage();
    },
    { deep: true },
  );

  window.addEventListener('beforeunload', saveToStorage);

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
