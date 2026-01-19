<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';
import { generateProgramPdf } from '../services/pdfGenerator';

const store = useProgramStore();

function handleGenerate() {
  generateProgramPdf(store.program);
}

function handleClear() {
  if (confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
    store.clearProgram();
  }
}
</script>

<template>
  <div class="form-actions">
    <button type="button" class="primary-btn" @click="handleGenerate">
      Generate PDF
    </button>
    <button type="button" class="danger-btn" @click="handleClear">
      Clear Form
    </button>
  </div>
</template>
