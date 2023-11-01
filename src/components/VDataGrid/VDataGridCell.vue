<template>
  <div
    :style="column.locked ? lockedStyle : ''"
    class="leading-[31px] border-b border-r-theme-bg-100 border-r"
    :class="cellClass"
    @click="selectCell"
    @dblclick="startEdit"
  >
    <input
      type="text"
      v-model="data[column.id]"
      v-if="editingCell"
      ref="editor"
      class="w-full px-2"
    />
    <VLabel
      class="px-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
      v-else
    >
      {{ data[column.id] }}
    </VLabel>
  </div>
</template>

<script setup lang="ts">
import {
  VDataColumn,
  VDataGridStateType,
  VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import VLabel from "@/components/VLabel/VLabel.vue";
import { onClickOutside } from "@vueuse/core";
import { computed, inject, ref } from "vue";

const props = defineProps<{
  data: VDataRow;
  column: VDataColumn;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { lockedColumnsMap, changeSelectedCell, selectedCellId, editMode } =
  state!;

const editor = ref<HTMLElement | null>(null);

onClickOutside(editor, () => (editMode.value = false));

const lockedStyle = computed(
  () =>
    `position: sticky; left:${lockedColumnsMap.value.get(props.column.id)}px`
);

const cellClass = computed(() => {
  let value = "";

  if (props.column.locked && selectedCellId.value !== cellId.value) {
    value += "bg-inherit";
  } else if (selectedCellId.value === cellId.value) {
    value += "bg-theme-primary-300";
  }

  return value;
});

const cellId = computed(() => `${props.data.id}-${props.column.id}`);

function selectCell() {
  changeSelectedCell(props.data.id, props.column.id, cellId.value);
}

function startEdit() {
  selectCell();
  editMode.value = true;
}

const editingCell = computed(
  () => editMode.value && selectedCellId.value === cellId.value
);
</script>

<style scoped></style>
