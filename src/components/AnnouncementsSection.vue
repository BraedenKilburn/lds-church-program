<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();

function formatPhoneNumber(event: Event): void {
  const input = event.target as HTMLInputElement;
  // Strip all non-digits
  const digits = input.value.replace(/\D/g, '').slice(0, 10);

  // Format as (XXX) XXX-XXXX
  let formatted = '';
  if (digits.length > 0) {
    formatted = '(' + digits.slice(0, 3);
  }
  if (digits.length >= 3) {
    formatted += ') ' + digits.slice(3, 6);
  }
  if (digits.length >= 6) {
    formatted += '-' + digits.slice(6, 10);
  }

  store.program.executiveSecretaryPhone = formatted;
}
</script>

<template>
  <section class="form-section">
    <h2>Announcements</h2>

    <VueDraggable
      v-model="store.program.announcements"
      :animation="200"
      handle=".drag-handle"
      ghost-class="dragging"
    >
      <div
        v-for="(announcement, index) in store.program.announcements"
        :key="announcement.id"
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
          <span class="item-number">Announcement {{ index + 1 }}</span>
          <button
            type="button"
            class="remove-btn"
            @click="store.removeAnnouncement(announcement.id)"
          >
            Remove
          </button>
        </div>
        <div class="field">
          <input
            v-model="announcement.title"
            type="text"
            placeholder="Title (e.g., Temple Baptisms)"
          />
        </div>
        <div class="field">
          <textarea
            v-model="announcement.description"
            placeholder="Description (e.g., Saturday, February 7 - Meet at 9am)"
            rows="2"
          ></textarea>
        </div>
      </div>
    </VueDraggable>

    <button type="button" class="add-btn" @click="store.addAnnouncement">
      + Add Announcement
    </button>

    <h2 class="section-divider">Missionaries</h2>
    <p class="section-hint">Missionaries serving from your ward</p>

    <VueDraggable
      v-model="store.program.missionaries"
      :animation="200"
      handle=".drag-handle"
      ghost-class="dragging"
    >
      <div
        v-for="(missionary, index) in store.program.missionaries"
        :key="missionary.id"
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
          <span class="item-number">Missionary {{ index + 1 }}</span>
          <button
            type="button"
            class="remove-btn"
            @click="store.removeMissionary(missionary.id)"
          >
            Remove
          </button>
        </div>
        <div class="field">
          <input
            v-model="missionary.name"
            type="text"
            placeholder="Name (e.g., Abigail Myers)"
          />
        </div>
        <div class="field">
          <input
            v-model="missionary.mission"
            type="text"
            placeholder="Mission (e.g., Las Vegas Area Service Mission)"
          />
        </div>
        <div class="field">
          <input
            v-model="missionary.email"
            type="email"
            placeholder="Email (e.g., abigail.myers@missionary.org)"
          />
        </div>
      </div>
    </VueDraggable>

    <button type="button" class="add-btn" @click="store.addMissionary">
      + Add Missionary
    </button>

    <h2 class="section-divider">Bishop Contact</h2>

    <div class="field-row">
      <div class="field">
        <label for="execSecName">Executive Secretary Name</label>
        <input
          id="execSecName"
          v-model="store.program.executiveSecretaryName"
          type="text"
          placeholder="e.g., Brother Kilburn"
        />
      </div>
      <div class="field">
        <label for="execSecPhone">Executive Secretary Phone</label>
        <input
          id="execSecPhone"
          :value="store.program.executiveSecretaryPhone"
          type="tel"
          placeholder="(555) 555-5555"
          @input="formatPhoneNumber"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-hint {
  color: #666;
  font-size: 14px;
  margin: -10px 0 15px 0;
}

.section-divider {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

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
