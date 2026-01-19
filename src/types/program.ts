export interface Speaker {
  id: string;
  name: string;
  topic?: string;
}

export interface Announcement {
  id: string;
  text: string;
}

export interface CalendarItem {
  id: string;
  date: string;
  event: string;
}

export interface Hymn {
  number: string;
  title: string;
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
  congregationalHymn: Hymn;

  invocation: string;
  benediction: string;

  speakers: Speaker[];

  // Announcements (Page 4)
  announcements: Announcement[];
  calendarItems: CalendarItem[];
}

export interface StoredData {
  version: number;
  data: ProgramData;
  lastSaved: string;
}
