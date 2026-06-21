import type { ProgramData } from '../types/program';
import { getNextSunday, isFirstSundayOfMonth } from '../utils/date';

export function createDefaultProgram(): ProgramData {
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
    midProgramMusicType: 'congregationalHymn',
    congregationalHymn: { number: '', title: '' },
    specialMusic: { title: '', description: '' },

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
