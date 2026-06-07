import type { ContentColumns, TDocumentDefinitions } from 'pdfmake/interfaces';
import type { ProgramData } from '../../types/program';
import { COLUMN_GAP, MARGIN, PAGE_HEIGHT, PAGE_WIDTH } from './layout';
import {
  buildAnnouncementsPage,
  buildCoverPage,
  buildInsideLeftPage,
  buildServiceOrderPage,
} from './sections';

export function buildProgramDocumentDefinition(data: ProgramData): TDocumentDefinitions {
  const sheet1: ContentColumns = {
    columns: [buildAnnouncementsPage(data), buildCoverPage(data)],
    columnGap: COLUMN_GAP,
  };

  const sheet2: ContentColumns = {
    columns: [buildInsideLeftPage(), buildServiceOrderPage(data)],
    columnGap: COLUMN_GAP,
  };

  return {
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
}
