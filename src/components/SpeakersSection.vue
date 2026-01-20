<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();
</script>

<template>
  <section class="form-section">
    <h2>Speakers</h2>

    <div
      v-for="(speaker, index) in store.program.speakers"
      :key="speaker.id"
      class="dynamic-item"
    >
      <div class="dynamic-item-header">
        <span class="item-number">Speaker {{ index + 1 }}</span>
        <button
          type="button"
          class="remove-btn"
          :disabled="store.program.speakers.length === 1"
          @click="store.removeSpeaker(speaker.id)"
        >
          Remove
        </button>
      </div>
      <div class="field">
        <input v-model="speaker.name" type="text" placeholder="Speaker Name" />
      </div>
    </div>

    <button type="button" class="add-btn" @click="store.addSpeaker">
      + Add Speaker
    </button>
  </section>
</template>
