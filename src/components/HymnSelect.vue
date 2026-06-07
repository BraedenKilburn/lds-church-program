<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import hymnData from '../../hymns.json';
import type { Hymn } from '../types/program';

interface HymnChoice {
  hymnName: string;
  hymnNumber: string;
}

interface HymnOption {
  number: string;
  title: string;
  label: string;
  searchText: string;
}

const EMPTY_QUERY_LIMIT = 25;
const SEARCH_RESULT_LIMIT = 50;

const props = defineProps<{
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
}>();

const model = defineModel<Hymn>({ required: true });

const choices = hymnData as HymnChoice[];
const options: HymnOption[] = choices.map((hymn) => {
  const number = hymn.hymnNumber;
  const title = hymn.hymnName;
  const label = `#${number} ${title}`;

  return {
    number,
    title,
    label,
    searchText: `${number} ${title} ${label}`.toLowerCase(),
  };
});

const query = ref('');
const isOpen = ref(false);
const activeIndex = ref(0);
const optionElements = useTemplateRef<HTMLLIElement[]>('optionElements');

const listboxId = computed(() => `${props.id}-options`);
const activeOptionId = computed(() =>
  isOpen.value && filteredOptions.value[activeIndex.value]
    ? `${props.id}-option-${activeIndex.value}`
    : undefined,
);
const placeholder = computed(() =>
  props.optional
    ? 'Search by hymn number or title, or leave blank'
    : 'Search by hymn number or title',
);
const hasInput = computed(() => query.value.trim().length > 0);
const selectedLabel = computed(() => getDisplayValue(model.value));
const filteredOptions = computed(() => {
  const normalizedQuery = normalizeQuery(query.value);
  return normalizedQuery
    ? options.filter((option) => option.searchText.includes(normalizedQuery))
    : options;
});
const visibleOptions = computed(() => {
  const limit = normalizeQuery(query.value) ? SEARCH_RESULT_LIMIT : EMPTY_QUERY_LIMIT;
  return filteredOptions.value.slice(0, limit);
});
const hasMoreOptions = computed(() => filteredOptions.value.length > visibleOptions.value.length);

watch(
  model,
  (hymn) => {
    if (!isOpen.value) {
      query.value = getDisplayValue(hymn);
    }
  },
  { immediate: true, deep: true },
);

watch(visibleOptions, (nextOptions) => {
  if (activeIndex.value >= nextOptions.length) {
    activeIndex.value = Math.max(0, nextOptions.length - 1);
  }
});

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase().replace(/^#/, '');
}

function getDisplayValue(hymn: Hymn): string {
  if (!hymn.number && !hymn.title) {
    return '';
  }

  const exactMatch = findOptionForHymn(hymn);

  if (exactMatch) {
    return exactMatch.label;
  }

  if (hymn.number && hymn.title) {
    return `#${hymn.number} ${hymn.title}`;
  }

  return hymn.number ? `#${hymn.number}` : hymn.title;
}

function findOptionForHymn(hymn: Hymn): HymnOption | undefined {
  if (hymn.number) {
    const numberMatch = options.find((option) => option.number === hymn.number);
    if (numberMatch) {
      return numberMatch;
    }
  }

  if (hymn.title) {
    return options.find((option) => option.title.toLowerCase() === hymn.title.toLowerCase());
  }

  return undefined;
}

function findExactQueryMatch(value: string): HymnOption | undefined {
  const normalizedValue = normalizeQuery(value);
  if (!normalizedValue) {
    return undefined;
  }

  return options.find(
    (option) =>
      option.number === normalizedValue ||
      option.title.toLowerCase() === normalizedValue ||
      option.label.toLowerCase() === value.trim().toLowerCase(),
  );
}

function openOptions(): void {
  isOpen.value = true;
  activeIndex.value = 0;
}

function closeOptions(): void {
  isOpen.value = false;
  activeIndex.value = 0;
}

function handleFocus(): void {
  openOptions();
}

function handleInput(event: Event): void {
  query.value = (event.target as HTMLInputElement).value;
  openOptions();
}

function selectOption(option: HymnOption): void {
  model.value = {
    number: option.number,
    title: option.title,
  };
  query.value = option.label;
  closeOptions();
}

function clearSelection(): void {
  model.value = { number: '', title: '' };
  query.value = '';
  openOptions();
  void nextTick(() => {
    document.getElementById(props.id)?.focus();
  });
}

function restoreSelectedValue(): void {
  const exactMatch = findExactQueryMatch(query.value);
  if (exactMatch) {
    selectOption(exactMatch);
    return;
  }

  query.value = selectedLabel.value;
  closeOptions();
}

function moveActive(delta: number): void {
  if (!isOpen.value) {
    openOptions();
    return;
  }

  if (filteredOptions.value.length === 0) {
    activeIndex.value = 0;
    return;
  }

  const nextIndex = activeIndex.value + delta;
  activeIndex.value = (nextIndex + visibleOptions.value.length) % visibleOptions.value.length;
  void nextTick(() => {
    optionElements.value?.[activeIndex.value]?.scrollIntoView({
      block: 'nearest',
    });
  });
}

function selectActive(): void {
  const activeOption = visibleOptions.value[activeIndex.value];
  if (activeOption) {
    selectOption(activeOption);
  }
}
</script>

<template>
  <div class="hymn-select">
    <label :for="id">{{ label }}{{ optional ? ' (Optional)' : '' }}</label>
    <div class="hymn-combobox">
      <input
        :id="id"
        class="hymn-combobox-input"
        :value="query"
        type="text"
        role="combobox"
        autocomplete="off"
        :aria-autocomplete="'list'"
        :aria-controls="listboxId"
        :aria-expanded="isOpen"
        :aria-activedescendant="activeOptionId"
        :aria-invalid="Boolean(error)"
        :aria-describedby="error ? `${id}-error` : undefined"
        :placeholder="placeholder"
        @focus="handleFocus"
        @input="handleInput"
        @blur="restoreSelectedValue"
        @keydown.down.prevent="moveActive(1)"
        @keydown.up.prevent="moveActive(-1)"
        @keydown.enter.prevent="selectActive"
        @keydown.esc.prevent="restoreSelectedValue"
      />
      <button
        v-if="hasInput"
        class="hymn-clear-btn"
        type="button"
        aria-label="Clear hymn"
        @mousedown.prevent
        @click="clearSelection"
      >
        &times;
      </button>
      <ul v-if="isOpen" :id="listboxId" class="hymn-options" role="listbox">
        <li
          v-for="(option, index) in visibleOptions"
          :id="`${id}-option-${index}`"
          :key="`${option.number}-${option.title}`"
          ref="optionElements"
          class="hymn-option"
          :class="{ 'is-active': index === activeIndex }"
          role="option"
          :aria-selected="index === activeIndex"
          @mousedown.prevent="selectOption(option)"
        >
          {{ option.label }}
        </li>
        <li
          v-if="filteredOptions.length === 0"
          class="hymn-option-empty"
          role="option"
          aria-disabled="true"
        >
          No hymns found
        </li>
        <li v-else-if="hasMoreOptions" class="hymn-option-empty" aria-disabled="true">
          Start typing to search all hymns
        </li>
      </ul>
    </div>
    <p v-if="error" :id="`${id}-error`" class="error">{{ error }}</p>
  </div>
</template>
