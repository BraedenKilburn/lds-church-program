<script setup lang="ts">
import HymnSelect from './HymnSelect.vue';
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();

defineProps<{
  errors?: Record<string, string>;
}>();
</script>

<template>
  <section class="form-section">
    <h2>Service Order</h2>

    <div class="checkbox-field">
      <label>
        <input type="checkbox" v-model="store.program.isFastSunday" />
        Fast Sunday (Testimony Meeting)
      </label>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="presiding">Presiding</label>
        <input id="presiding" v-model="store.program.presiding" type="text" />
      </div>
      <div class="field">
        <label for="conducting">Conducting</label>
        <input id="conducting" v-model="store.program.conducting" type="text" />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="organist">Organist</label>
        <input id="organist" v-model="store.program.organist" type="text" />
      </div>
      <div class="field">
        <label for="chorister">Chorister</label>
        <input id="chorister" v-model="store.program.chorister" type="text" />
      </div>
    </div>

    <HymnSelect
      id="opening-hymn"
      v-model="store.program.openingHymn"
      label="Opening Hymn"
      :error="errors?.openingHymn"
    />

    <div class="field-row">
      <div class="field">
        <label for="invocation">Invocation (Opening Prayer)</label>
        <input id="invocation" v-model="store.program.invocation" type="text" />
      </div>
    </div>

    <HymnSelect
      id="sacrament-hymn"
      v-model="store.program.sacramentHymn"
      label="Sacrament Hymn"
      :error="errors?.sacramentHymn"
    />

    <HymnSelect
      v-if="!store.program.isFastSunday"
      id="congregational-hymn"
      v-model="store.program.congregationalHymn"
      label="Congregational Hymn"
      optional
    />

    <HymnSelect
      id="closing-hymn"
      v-model="store.program.closingHymn"
      label="Closing Hymn"
      :error="errors?.closingHymn"
    />

    <div class="field-row">
      <div class="field">
        <label for="benediction">Benediction (Closing Prayer)</label>
        <input id="benediction" v-model="store.program.benediction" type="text" />
      </div>
    </div>
  </section>
</template>
