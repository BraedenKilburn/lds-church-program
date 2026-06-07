# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun run dev` - Start development server
- `bun run build` - Type-check with vue-tsc and build for production
- `bun run preview` - Preview production build
- `bun run test` - Run Vitest tests
- `bun run format:check` - Check Oxcfmt formatting
- `bun run lint` - Run linting

## Architecture

This is a Vue 3 + TypeScript app that generates printable church sacrament meeting programs as PDF booklets.

### Key Files

- **src/types/program.ts** - TypeScript interfaces for all data structures (ProgramData, Speaker, Hymn, etc.)
- **src/stores/programStore.ts** - Pinia store handling state, debounced localStorage persistence, and list actions
- **src/stores/programMigrations.ts** - Stored data migration logic
- **src/services/pdf/** - PDF document definition, booklet sections, layout constants, and lazy-loaded pdfmake actions

### PDF Booklet Layout

The PDF generates a folded booklet from a single 11x8.5" landscape sheet:

- Sheet 1: [Page 4 (Announcements), Page 1 (Cover)] - prints on one side
- Sheet 2: [Page 2 (Blank), Page 3 (Service Order)] - prints on reverse

User prints double-sided, then folds in half.

### State Persistence

The store automatically saves to localStorage with a 300ms debounce and flushes on `beforeunload`. On load, it migrates old data formats (e.g., `restHymn` → `congregationalHymn`).

### pdfmake Notes

Keep pdfmake behind dynamic imports in `src/services/pdf/pdfActions.ts` so the initial app bundle stays small:

```typescript
const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
  import('pdfmake/build/pdfmake'),
  import('pdfmake/build/vfs_fonts'),
]);

pdfMake.addVirtualFileSystem(pdfFonts);
```
