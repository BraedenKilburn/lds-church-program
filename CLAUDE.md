# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `bun run dev` - Start development server
- `bun run build` - Type-check with vue-tsc and build for production
- `bun run preview` - Preview production build

## Architecture

This is a Vue 3 + TypeScript app that generates printable church sacrament meeting programs as PDF booklets.

### Key Files

- **src/types/program.ts** - TypeScript interfaces for all data structures (ProgramData, Speaker, Hymn, etc.)
- **src/stores/programStore.ts** - Pinia store handling state, localStorage persistence, and auto-save
- **src/services/pdfGenerator.ts** - pdfmake PDF generation with booklet layout logic

### PDF Booklet Layout

The PDF generates a folded booklet from a single 11x8.5" landscape sheet:
- Sheet 1: [Page 4 (Announcements), Page 1 (Cover)] - prints on one side
- Sheet 2: [Page 2 (Blank), Page 3 (Service Order)] - prints on reverse

User prints double-sided, then folds in half.

### State Persistence

The store automatically saves to localStorage on every change via a deep watcher. On load, it migrates old data formats (e.g., `restHymn` → `congregationalHymn`).

### pdfmake Notes

When importing pdfmake with Vite/ESM, use this pattern for the virtual file system:
```typescript
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs || (pdfFonts as any).vfs;
pdfMake.vfs = vfs;
```
