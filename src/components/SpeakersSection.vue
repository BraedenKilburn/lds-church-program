<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();
</script>

<template>
  <section v-if="!store.program.isFastSunday" class="form-section">
    <h2>Speakers</h2>

    <VueDraggable
      v-model="store.program.speakers"
      :animation="200"
      handle=".drag-handle"
      ghost-class="dragging"
    >
      <div
        v-for="(speaker, index) in store.program.speakers"
        :key="speaker.id"
        class="dynamic-item"
      >
        <div class="dynamic-item-header">
          <div class="drag-handle" title="Drag to reorder">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <circle cx="5" cy="3" r="1.5" />
              <circle cx="11" cy="3" r="1.5" />
              <circle cx="5" cy="8" r="1.5" />
              <circle cx="11" cy="8" r="1.5" />
              <circle cx="5" cy="13" r="1.5" />
              <circle cx="11" cy="13" r="1.5" />
            </svg>
          </div>
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
    </VueDraggable>

    <button type="button" class="add-btn" @click="store.addSpeaker">
      + Add Speaker
    </button>
  </section>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
  padding: 4px 8px;
  color: #999;
  display: flex;
  align-items: center;
  border-radius: 4px;
  transition: color 0.2s, background-color 0.2s;
}

.drag-handle:hover {
  color: #666;
  background: #f0f0f0;
}

.drag-handle:active {
  cursor: grabbing;
}

.dragging {
  opacity: 0.5;
  background: #e8f4ff;
  border: 1px dashed #4a90d9;
  border-radius: 8px;
}
</style>
