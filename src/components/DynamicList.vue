<script setup lang="ts" generic="TItem extends { id: string }">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import DragHandle from './DragHandle.vue';

const props = withDefaults(
  defineProps<{
    items: TItem[];
    label: string;
    addLabel: string;
    canRemove?: (item: TItem, index: number) => boolean;
    emptyText?: string;
  }>(),
  {
    canRemove: () => true,
    emptyText: '',
  },
);

const emit = defineEmits<{
  add: [];
  remove: [id: string];
  'update:items': [items: TItem[]];
}>();

const draggableItems = computed({
  get: () => props.items,
  set: (items) => emit('update:items', items),
});
</script>

<template>
  <p v-if="items.length === 0 && emptyText" class="empty-state">{{ emptyText }}</p>

  <VueDraggable
    v-model="draggableItems"
    :animation="200"
    handle=".drag-handle"
    ghost-class="dragging"
  >
    <div v-for="(item, index) in items" :key="item.id" class="dynamic-item">
      <div class="dynamic-item-header">
        <div class="dynamic-item-title">
          <DragHandle />
          <span class="item-number">{{ label }} {{ index + 1 }}</span>
        </div>
        <button
          type="button"
          class="remove-btn"
          :disabled="!canRemove(item, index)"
          @click="emit('remove', item.id)"
        >
          Remove
        </button>
      </div>

      <slot :item="item" :index="index" />
    </div>
  </VueDraggable>

  <button type="button" class="add-btn" @click="emit('add')">
    {{ addLabel }}
  </button>
</template>
