<script setup lang="ts">
import { computed, ref } from 'vue';
import CoverSection from './CoverSection.vue';
import ServiceOrderSection from './ServiceOrderSection.vue';
import SpeakersSection from './SpeakersSection.vue';
import AnnouncementsSection from './AnnouncementsSection.vue';
import FormActions from './FormActions.vue';
import { useProgramStore } from '../stores/programStore';
import { downloadProgramPdf, openProgramPdf } from '../services/pdf/pdfActions';
import { validateProgram } from '../services/programValidation';
import type { ProgramValidationError } from '../types/program';

type PdfAction = 'download' | 'preview';

const store = useProgramStore();
const validationErrors = ref<ProgramValidationError[]>([]);
const activeAction = ref<PdfAction | null>(null);

const errorByField = computed(() =>
  Object.fromEntries(validationErrors.value.map((error) => [error.field, error.message])),
);

async function handlePdfAction(action: PdfAction): Promise<void> {
  const result = validateProgram(store.program);
  validationErrors.value = result.errors;

  if (!result.valid) {
    return;
  }

  activeAction.value = action;

  try {
    if (action === 'preview') {
      await openProgramPdf(store.program);
    } else {
      await downloadProgramPdf(store.program);
    }
  } finally {
    activeAction.value = null;
  }
}
</script>

<template>
  <form class="program-form" @submit.prevent>
    <CoverSection :errors="errorByField" />
    <ServiceOrderSection :errors="errorByField" />
    <SpeakersSection />
    <AnnouncementsSection />
    <FormActions
      :validation-errors="validationErrors"
      :active-action="activeAction"
      @download="handlePdfAction('download')"
      @preview="handlePdfAction('preview')"
    />
  </form>
</template>
