<script setup lang="ts">
import CoverSection from './CoverSection.vue';
import ServiceOrderSection from './ServiceOrderSection.vue';
import SpeakersSection from './SpeakersSection.vue';
import AnnouncementsSection from './AnnouncementsSection.vue';
import FormActions from './FormActions.vue';
</script>

<template>
  <form class="program-form" @submit.prevent>
    <CoverSection />
    <ServiceOrderSection />
    <SpeakersSection />
    <AnnouncementsSection />
    <FormActions />
  </form>
</template>
