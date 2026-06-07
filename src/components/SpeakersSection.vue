<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';
import DynamicList from './DynamicList.vue';
import type { Speaker } from '../types/program';

const store = useProgramStore();

function updateSpeakers(speakers: Speaker[]): void {
  store.program.speakers = speakers;
}
</script>

<template>
  <section v-if="!store.program.isFastSunday" class="form-section">
    <h2>Speakers</h2>

    <DynamicList
      :items="store.program.speakers"
      label="Speaker"
      add-label="+ Add Speaker"
      :can-remove="() => store.program.speakers.length > 1"
      @update:items="updateSpeakers"
      @remove="store.removeSpeaker"
      @add="store.addSpeaker"
    >
      <template #default="{ item: speaker }">
        <div class="field">
          <input v-model="speaker.name" type="text" placeholder="Speaker Name" />
        </div>
      </template>
    </DynamicList>
  </section>
</template>
