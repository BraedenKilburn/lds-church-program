export interface Speaker {
  id: string;
  name: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
}

export interface Missionary {
  id: string;
  name: string;
  mission: string;
  email: string;
}

export interface Hymn {
  number: string;
  title: string;
}

export type MidProgramMusicType = 'congregationalHymn' | 'specialMusic';

export interface SpecialMusic {
  title: string;
  description: string;
}

export interface ProgramData {
  // Cover (Page 1)
  stakeName: string;
  wardName: string;
  meetingDate: string;
  coverImage: string | null;

  // Service Order (Page 3)
  presiding: string;
  conducting: string;
  organist: string;
  chorister: string;

  openingHymn: Hymn;
  sacramentHymn: Hymn;
  closingHymn: Hymn;
  midProgramMusicType: MidProgramMusicType;
  congregationalHymn: Hymn;
  specialMusic: SpecialMusic;

  invocation: string;
  benediction: string;

  isFastSunday: boolean;
  speakers: Speaker[];

  // Back Page (Page 4)
  announcements: Announcement[];
  missionaries: Missionary[];
  executiveSecretaryName: string;
  executiveSecretaryPhone: string;
}

export interface StoredData {
  version: number;
  data: ProgramData;
  lastSaved: string;
}

export interface ProgramValidationError {
  field: string;
  message: string;
}

export interface ProgramValidationResult {
  valid: boolean;
  errors: ProgramValidationError[];
}
