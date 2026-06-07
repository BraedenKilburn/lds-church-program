import type pdfMakeType from 'pdfmake/build/pdfmake';
import type { ProgramData } from '../../types/program';
import { buildProgramDocumentDefinition } from './documentDefinition';

let pdfMakePromise: Promise<typeof pdfMakeType> | null = null;

async function loadPdfMake(): Promise<typeof pdfMakeType> {
  pdfMakePromise ??= Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ]).then(([{ default: pdfMake }, { default: pdfFonts }]) => {
    pdfMake.addVirtualFileSystem(pdfFonts);
    return pdfMake;
  });

  return pdfMakePromise;
}

export function getProgramPdfFileName(data: ProgramData): string {
  return data.wardName
    ? `${data.wardName.replace(/\s+/g, '-').toLowerCase()}-program.pdf`
    : 'ward-program.pdf';
}

export async function downloadProgramPdf(data: ProgramData): Promise<void> {
  const pdfMake = await loadPdfMake();
  pdfMake.createPdf(buildProgramDocumentDefinition(data)).download(getProgramPdfFileName(data));
}

export async function openProgramPdf(data: ProgramData): Promise<void> {
  const pdfMake = await loadPdfMake();
  pdfMake.createPdf(buildProgramDocumentDefinition(data)).open();
}
