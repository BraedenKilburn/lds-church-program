<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';
import { useImageUpload } from '../composables/useImageUpload';

const store = useProgramStore();
const { isLoading, error, handleFileSelect } = useImageUpload();

function onFileChange(event: Event) {
  handleFileSelect(event, (base64) => {
    store.setCoverImage(base64);
  });
}

function removeImage() {
  store.setCoverImage(null);
}
</script>

<template>
  <section class="form-section">
    <h2>Cover Information</h2>

    <div class="field">
      <label for="stakeName">Stake Name</label>
      <input id="stakeName" v-model="store.program.stakeName" type="text" placeholder="Example Stake" />
    </div>

    <div class="field">
      <label for="wardName">Ward Name</label>
      <input id="wardName" v-model="store.program.wardName" type="text" placeholder="Example Ward" />
    </div>

    <div class="field">
      <label for="meetingDate">Meeting Date</label>
      <input id="meetingDate" v-model="store.program.meetingDate" type="date" />
    </div>

    <div class="field">
      <label>Cover Image (Optional)</label>
      <input type="file" accept="image/*" @change="onFileChange" />
      <p v-if="isLoading" class="info">Uploading...</p>
      <p v-if="error" class="error">{{ error }}</p>
      <div v-if="store.program.coverImage" class="image-preview">
        <img :src="store.program.coverImage" alt="Cover preview" />
        <button type="button" class="remove-btn" @click="removeImage">
          Remove Image
        </button>
      </div>
    </div>
  </section>
</template>
