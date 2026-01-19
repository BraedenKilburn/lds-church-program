<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();
</script>

<template>
  <section class="form-section">
    <h2>Announcements</h2>

    <div
      v-for="(announcement, index) in store.program.announcements"
      :key="announcement.id"
      class="dynamic-item"
    >
      <div class="dynamic-item-header">
        <span class="item-number">Announcement {{ index + 1 }}</span>
        <button
          type="button"
          class="remove-btn"
          :disabled="store.program.announcements.length === 1"
          @click="store.removeAnnouncement(announcement.id)"
        >
          Remove
        </button>
      </div>
      <textarea
        v-model="announcement.text"
        placeholder="Announcement text"
        rows="2"
      ></textarea>
    </div>

    <button type="button" class="add-btn" @click="store.addAnnouncement">
      + Add Announcement
    </button>

    <h3>Upcoming Events</h3>

    <div
      v-for="(item, index) in store.program.calendarItems"
      :key="item.id"
      class="dynamic-item"
    >
      <div class="dynamic-item-header">
        <span class="item-number">Event {{ index + 1 }}</span>
        <button
          type="button"
          class="remove-btn"
          @click="store.removeCalendarItem(item.id)"
        >
          Remove
        </button>
      </div>
      <div class="field-row">
        <div class="field" style="flex: 0 0 150px">
          <input v-model="item.date" type="text" placeholder="Date (e.g., Jan 15)" />
        </div>
        <div class="field" style="flex: 1">
          <input v-model="item.event" type="text" placeholder="Event description" />
        </div>
      </div>
    </div>

    <button type="button" class="add-btn" @click="store.addCalendarItem">
      + Add Event
    </button>
  </section>
</template>
