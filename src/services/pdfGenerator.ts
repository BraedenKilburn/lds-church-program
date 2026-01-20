import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions, Content, ContentColumns } from 'pdfmake/interfaces';
import type { ProgramData, Hymn } from '../types/program';

// Handle different module formats for vfs_fonts
const vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs || (pdfFonts as any).vfs;
pdfMake.vfs = vfs;

// Page dimensions: 11" x 8.5" landscape in points (72 points/inch)
const PAGE_WIDTH = 792;
const PAGE_HEIGHT = 612;
const PANEL_WIDTH = (PAGE_WIDTH - 72) / 2; // Account for margins
const MARGIN = 36;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper to create a space-between row (label left, value right)
function buildRow(label: string, value: string, marginBottom: number = 4): Content {
  return {
    columns: [
      { text: label, alignment: 'left' },
      { text: value, alignment: 'right' },
    ],
    margin: [0, 0, 0, marginBottom],
  };
}

function buildHymnRow(label: string, hymn: Hymn, marginBottom: number = 4): Content {
  const content: Content[] = [
    // First row: label and hymn number
    {
      columns: [
        { text: label, alignment: 'left' },
        { text: hymn.number ? `#${hymn.number}` : '', alignment: 'right' },
      ],
      margin: [0, 0, 0, 8],
    },
  ];

  // Second row: title centered and italicized
  if (hymn.title) {
    content.push({
      text: `"${hymn.title}"`,
      alignment: 'center',
      italics: true,
    });
  }

  return { stack: content, margin: [0, 0, 0, marginBottom] };
}

// Page 1: Front Cover
function buildCoverPage(data: ProgramData): Content {
  const content: Content[] = [
    { text: 'The Church of Jesus Christ of Latter-day Saints', style: 'churchName', alignment: 'center' },
    { text: data.stakeName || 'Stake Name',  alignment: 'center' },
    { text: data.wardName || 'Ward Name',  alignment: 'center' }
  ];

    if (data.coverImage) {
      content.push({
        image: data.coverImage,
        width: PANEL_WIDTH - 40,
        alignment: 'center',
      } as Content);
    }

    content.push({
      text: formatDate(data.meetingDate),
      style: 'date',
      alignment: 'center',
      absolutePosition: { x: PANEL_WIDTH + MARGIN, y: PAGE_HEIGHT - MARGIN - 20 },
    });

  return {
    stack: content,
  };
}

// Page 2: Inside Left (Blank)
function buildInsideLeftPage(): Content {
  return {
    text: '',
  };
}

// Page 3: Inside Right (Service Order)
function buildServiceOrderPage(data: ProgramData): Content {
  const items: Content[] = [
    // Leadership (grouped together with small spacing)
    buildRow('Presiding', data.presiding, 2),
    buildRow('Conducting', data.conducting, 2),
    buildRow('Chorister', data.chorister, 2),
    buildRow('Organist', data.organist, 32),

    // Opening Hymn
    buildHymnRow('Opening Hymn', data.openingHymn, 24),

    // Invocation
    buildRow('Invocation', data.invocation || 'By Invitation', 24),

    // Sacrament Hymn
    buildHymnRow('Sacrament Hymn', data.sacramentHymn, 24),

    // Administration of the Sacrament
    {
      text: 'Administration of the Sacrament',
      alignment: 'center',
      italics: true,
      margin: [0, 0, 0, 32],
    },
  ];

  // Speakers with congregational hymn between first and second
  const validSpeakers = data.speakers.filter((s) => s.name);
  const hasCongregationalHymn = data.congregationalHymn?.number || data.congregationalHymn?.title;

  validSpeakers.forEach((speaker, index) => {
    items.push(buildRow('Speaker', speaker.name, 24));

    // Insert congregational hymn after first speaker
    if (index === 0 && hasCongregationalHymn) {
      items.push(buildHymnRow('Congregational Hymn', data.congregationalHymn, 24));
    }
  });

  // Closing Hymn
  items.push(buildHymnRow('Closing Hymn', data.closingHymn, 24));

  // Benediction
  items.push(buildRow('Benediction', data.benediction || 'By Invitation'));

  return {
    stack: items,
  };
}

// Page 4: Back Cover (Announcements)
function buildAnnouncementsPage(data: ProgramData): Content {
  const items: Content[] = [
    // Announcements header
    {
      text: 'Announcements',
      style: 'sectionTitle',
      margin: [0, 0, 0, 20],
    },
  ];

  // Announcements with bold title and description
  const validAnnouncements = data.announcements.filter((a) => a.title);
  validAnnouncements.forEach((announcement) => {
    items.push({
      text: announcement.title,
      bold: true,
      margin: [0, 0, 0, 2],
    });
    if (announcement.description) {
      items.push({
        text: announcement.description,
        margin: [0, 0, 0, 20],
      });
    }
  });

  // Bottom section with missionaries and bishop contact
  const bottomItems: Content[] = [];

  // Missionaries section
  const validMissionaries = data.missionaries.filter((m) => m.name);
  if (validMissionaries.length > 0) {
    bottomItems.push({
      text: 'Write to the Missionaries Serving from our Ward',
      bold: true,
      alignment: 'center',
      margin: [0, 0, 0, 15],
    });

    validMissionaries.forEach((missionary) => {
      const missionaryLines: Content[] = [];
      const nameLine = missionary.mission
        ? `${missionary.name} - ${missionary.mission}`
        : missionary.name;
      missionaryLines.push({
        text: nameLine,
        alignment: 'center',
        margin: [0, 0, 0, 2],
      });
      if (missionary.email) {
        missionaryLines.push({
          text: missionary.email,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        });
      }
      bottomItems.push({ stack: missionaryLines });
    });
  }

  // Bishop contact info
  if (data.executiveSecretaryName || data.executiveSecretaryPhone) {
    const contactText = `If you need to meet with the Bishop, please contact the Executive Secretary, ${data.executiveSecretaryName || '[Name]'}, at ${data.executiveSecretaryPhone || '[Phone]'}.`;
    bottomItems.push({
      text: contactText,
      alignment: 'center',
      margin: [0, 20, 0, 0],
    });
  }

  // Add spacing before bottom section
  if (bottomItems.length > 0) {
    items.push({ text: '', margin: [0, 40, 0, 0] });
    items.push(...bottomItems);
  }

  return {
    stack: items,
  };
}

export function generateProgramPdf(data: ProgramData): void {
  const sheet1: ContentColumns = {
    columns: [buildAnnouncementsPage(data), buildCoverPage(data)],
    columnGap: 40,
  };

  const sheet2: ContentColumns = {
    columns: [buildInsideLeftPage(), buildServiceOrderPage(data)],
    columnGap: 40,
  };

  const docDefinition: TDocumentDefinitions = {
    pageSize: { width: PAGE_WIDTH, height: PAGE_HEIGHT },
    pageOrientation: 'landscape',
    pageMargins: MARGIN,

    content: [sheet1, { text: '', pageBreak: 'after' }, sheet2],

    styles: {
      churchName: {
        fontSize: 14,
        bold: true,
      },
      date: {
        fontSize: 14,
        bold: true,
      },
      subtitle: {
        fontSize: 16,
        italics: true,
      },
      sectionTitle: {
        fontSize: 16,
        bold: true,
      },
      label: {
        fontSize: 11,
        bold: true,
      },
    },

    defaultStyle: {
      fontSize: 12,
    },
  };

  const fileName = data.wardName
    ? `${data.wardName.replace(/\s+/g, '-').toLowerCase()}-program.pdf`
    : 'ward-program.pdf';

  pdfMake.createPdf(docDefinition).download(fileName);
}
