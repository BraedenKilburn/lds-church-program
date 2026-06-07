<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';
import DynamicList from './DynamicList.vue';
import type { Announcement, Missionary } from '../types/program';

const store = useProgramStore();

function updateAnnouncements(announcements: Announcement[]): void {
  store.program.announcements = announcements;
}

function updateMissionaries(missionaries: Missionary[]): void {
  store.program.missionaries = missionaries;
}

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

    <DynamicList
      :items="store.program.announcements"
      label="Announcement"
      add-label="+ Add Announcement"
      empty-text="No announcements added."
      @update:items="updateAnnouncements"
      @remove="store.removeAnnouncement"
      @add="store.addAnnouncement"
    >
      <template #default="{ item: announcement }">
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
      </template>
    </DynamicList>

    <h2 class="section-divider">Missionaries</h2>
    <p class="section-hint">Missionaries serving from your ward</p>

    <DynamicList
      :items="store.program.missionaries"
      label="Missionary"
      add-label="+ Add Missionary"
      empty-text="No missionaries added."
      @update:items="updateMissionaries"
      @remove="store.removeMissionary"
      @add="store.addMissionary"
    >
      <template #default="{ item: missionary }">
        <div class="field">
          <input v-model="missionary.name" type="text" placeholder="Name (e.g., Abigail Myers)" />
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
      </template>
    </DynamicList>

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
  color: var(--color-text-muted);
  font-size: 14px;
  margin: -10px 0 15px 0;
}

.section-divider {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}
</style>
