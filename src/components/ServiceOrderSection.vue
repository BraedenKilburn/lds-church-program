<script setup lang="ts">
import { useProgramStore } from '../stores/programStore';

const store = useProgramStore();
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

    <div class="hymn-group">
      <label>Opening Hymn</label>
      <div class="hymn-inputs">
        <input
          v-model="store.program.openingHymn.number"
          type="text"
          placeholder="#"
          class="hymn-number"
        />
        <input
          v-model="store.program.openingHymn.title"
          type="text"
          placeholder="Hymn Title"
          class="hymn-title"
        />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="invocation">Invocation (Opening Prayer)</label>
        <input id="invocation" v-model="store.program.invocation" type="text" />
      </div>
    </div>

    <div class="hymn-group">
      <label>Sacrament Hymn</label>
      <div class="hymn-inputs">
        <input
          v-model="store.program.sacramentHymn.number"
          type="text"
          placeholder="#"
          class="hymn-number"
        />
        <input
          v-model="store.program.sacramentHymn.title"
          type="text"
          placeholder="Hymn Title"
          class="hymn-title"
        />
      </div>
    </div>

    <div v-if="!store.program.isFastSunday" class="hymn-group">
      <label>Congregational Hymn (Optional)</label>
      <div class="hymn-inputs">
        <input
          v-model="store.program.congregationalHymn.number"
          type="text"
          placeholder="#"
          class="hymn-number"
        />
        <input
          v-model="store.program.congregationalHymn.title"
          type="text"
          placeholder="Hymn Title"
          class="hymn-title"
        />
      </div>
    </div>

    <div class="hymn-group">
      <label>Closing Hymn</label>
      <div class="hymn-inputs">
        <input
          v-model="store.program.closingHymn.number"
          type="text"
          placeholder="#"
          class="hymn-number"
        />
        <input
          v-model="store.program.closingHymn.title"
          type="text"
          placeholder="Hymn Title"
          class="hymn-title"
        />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="benediction">Benediction (Closing Prayer)</label>
        <input id="benediction" v-model="store.program.benediction" type="text" />
      </div>
    </div>
  </section>
</template>
