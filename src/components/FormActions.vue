<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';
import type { ProgramValidationError } from '../types/program';

const store = useProgramStore();
const emit = defineEmits<{
  download: [];
  preview: [];
}>();

defineProps<{
  validationErrors: ProgramValidationError[];
  activeAction: 'download' | 'preview' | null;
}>();

function handleClear() {
  if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
    store.clearProgram();
  }
}
</script>

<template>
  <div class="form-actions">
    <p v-if="validationErrors.length" class="validation-summary">
      Please fix the required fields before generating a PDF.
    </p>
    <button
      type="button"
      class="secondary-btn"
      :disabled="Boolean(activeAction)"
      @click="emit('preview')"
    >
      {{ activeAction === 'preview' ? 'Opening...' : 'Preview PDF' }}
    </button>
    <button
      type="button"
      class="primary-btn"
      :disabled="Boolean(activeAction)"
      @click="emit('download')"
    >
      {{ activeAction === 'download' ? 'Generating...' : 'Generate PDF' }}
    </button>
    <button type="button" class="danger-btn" @click="handleClear">Clear Form</button>
  </div>
</template>
