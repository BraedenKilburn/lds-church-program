<script setup lang="ts">
import ProgramForm from './components/ProgramForm.vue';
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Ward Program Generator</h1>
      <p class="subtitle">Create printable sacrament meeting programs</p>
    </header>
    <main>
      <ProgramForm />
    </main>
    <footer>
      <p>Print double-sided, landscape orientation, then fold in half.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  margin: 0 0 8px 0;
  color: var(--color-text-heading);
}

.subtitle {
  color: var(--color-text-muted);
  margin: 0;
}

footer {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 14px;
}
</style>
