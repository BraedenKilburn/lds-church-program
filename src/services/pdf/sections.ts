import type { Content } from 'pdfmake/interfaces';
import type { Hymn, ProgramData } from '../../types/program';
import { LEFT_PANEL_WIDTH, MARGIN, PAGE_HEIGHT, PANEL_WIDTH } from './layout';

const MUSIC_ROLE_ROW_HEIGHT = 10;

function formatDate(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildRow(label: string, value: string, marginBottom = 4): Content {
  return {
    columns: [
      { text: label, alignment: 'left' },
      { text: value, alignment: 'right' },
    ],
    margin: [0, 0, 0, marginBottom],
  };
}

function buildSpacer(marginBottom: number): Content {
  return { text: '', margin: [0, 0, 0, MUSIC_ROLE_ROW_HEIGHT + marginBottom] };
}

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

function buildHymnRow(label: string, hymn: Hymn, marginBottom = 4): Content {
  const content: Content[] = [
    {
      columns: [
        { text: label, alignment: 'left' },
        { text: hymn.number ? `#${hymn.number}` : '', alignment: 'right' },
      ],
      margin: [0, 0, 0, 8],
    },
  ];

  if (hymn.title) {
    content.push({
      text: `"${hymn.title}"`,
      alignment: 'center',
      italics: true,
    });
  }

  return { stack: content, margin: [0, 0, 0, marginBottom] };
}

export function buildCoverPage(data: ProgramData): Content {
  const content: Content[] = [
    {
      text: 'The Church of Jesus Christ of Latter-day Saints',
      style: 'churchName',
      alignment: 'center',
    },
    { text: data.stakeName || 'Stake Name', alignment: 'center' },
    { text: data.wardName || 'Ward Name', alignment: 'center' },
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

  return { stack: content };
}

export function buildInsideLeftPage(): Content {
  return { text: '' };
}

export function buildServiceOrderPage(data: ProgramData): Content {
  const validSpeakers = data.isFastSunday ? [] : data.speakers.filter((speaker) => speaker.name);
  const hasCongregationalHymn = data.congregationalHymn?.number || data.congregationalHymn?.title;
  const compact = validSpeakers.length >= 3 && hasCongregationalHymn;

  const sectionGap = compact ? 24 : 32;
  const itemGap = compact ? 20 : 24;

  const items: Content[] = [
    buildRow('Presiding', data.presiding, 2),
    buildRow('Conducting', data.conducting, 2),
  ];

  items.push(hasValue(data.chorister) ? buildRow('Chorister', data.chorister, 2) : buildSpacer(2));
  items.push(
    hasValue(data.organist)
      ? buildRow('Organist', data.organist, sectionGap)
      : buildSpacer(sectionGap),
  );

  items.push(buildHymnRow('Opening Hymn', data.openingHymn, itemGap));
  items.push(buildRow('Invocation', data.invocation || 'By Invitation', itemGap));
  items.push(buildHymnRow('Sacrament Hymn', data.sacramentHymn, sectionGap));
  items.push({
    text: 'Administration of the Sacrament',
    alignment: 'center',
    italics: true,
    margin: [0, 0, 0, sectionGap],
  });

  if (data.isFastSunday) {
    items.push({
      text: 'TESTIMONIES',
      alignment: 'center',
      bold: true,
      fontSize: 14,
      margin: [0, 32, 0, 8],
    });
    items.push({
      text: 'Please focus your testimony on Jesus Christ',
      alignment: 'center',
      italics: true,
      margin: [0, 0, 0, 64],
    });
  } else {
    validSpeakers.forEach((speaker, index) => {
      if (index === validSpeakers.length - 1 && hasCongregationalHymn) {
        items.push(buildHymnRow('Congregational Hymn', data.congregationalHymn, itemGap));
      }

      items.push(buildRow('Speaker', speaker.name, itemGap));
    });
  }

  items.push(buildHymnRow('Closing Hymn', data.closingHymn, itemGap));
  items.push(buildRow('Benediction', data.benediction || 'By Invitation'));

  return { stack: items };
}

export function buildAnnouncementsPage(data: ProgramData): Content {
  const items: Content[] = [
    {
      text: 'Announcements',
      style: 'sectionTitle',
      margin: [0, 0, 0, 20],
    },
  ];

  const validAnnouncements = data.announcements.filter((announcement) => announcement.title);
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

  const bottomItems: Content[] = [];
  const validMissionaries = data.missionaries.filter((missionary) => missionary.name);

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

  if (data.executiveSecretaryName || data.executiveSecretaryPhone) {
    const contactText = `If you need to meet with the Bishop, please contact the Executive Secretary, ${data.executiveSecretaryName || '[Name]'
      }, at ${data.executiveSecretaryPhone || '[Phone]'}.`;
    bottomItems.push({
      text: contactText,
      alignment: 'center',
      margin: [0, 20, 0, 0],
    });
  }

  let bottomHeight = 5;
  if (validMissionaries.length > 0) {
    bottomHeight += 30;
    bottomHeight += validMissionaries.length * 40;
  }
  if (data.executiveSecretaryName || data.executiveSecretaryPhone) {
    bottomHeight += 50;
  }

  if (bottomItems.length > 0) {
    items.push({
      absolutePosition: { x: MARGIN, y: PAGE_HEIGHT - MARGIN - bottomHeight },
      table: {
        widths: [LEFT_PANEL_WIDTH],
        body: [[{ stack: bottomItems }]],
      },
      layout: 'noBorders',
    } as Content);
  }

  return { stack: items };
}
