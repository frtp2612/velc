<template>
  <div
    class="flex relative max-w-full h-full items-center"
    :class="[cellClass, { 'z-[1]': column.descriptor?.isLocked }]"
    tabindex="-1"
  >
    <VLabel
      v-if="row"
      class="px-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-inherit"
      :class="[isEditable ? '' : '']"
      @click="selectCell"
      @contextmenu="selectCell"
      @dblclick="startEdit"
    >
      {{ formattedValue }}
    </VLabel>
  </div>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VLabel from "@/components/VLabel/VLabel.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { VDataColumn, VDataGridStateType, VDataRow } from "./types";

const props = defineProps<{
  rowId: number;
  column: VDataColumn;
  state: VDataGridStateType<RowType>;
}>();

const { n, d } = useI18n();

const {
  getRow,
  isBoolean,
  isDate,
  isDropdown,
  isEditableBoolean,
  isNumber,
  isString,
  descriptor,
} = props.state;

const row = computed(() => getRow(props.rowId));

const cellId = computed(() => `${props.rowId}-${props.column.id}`);

const cellClass = computed(() => {
  let value = `cell-${cellId.value} `;

  return value;
});

function getFormattedValue(row: RowType | undefined, column: VDataColumn) {
  if (row) {
    if (row?.options?.filler) {
      return "";
    }

    if (isBoolean(row, column)) return row[column.id] ? "fa-check" : undefined;
    if (isNumber(row, column)) return n(row[column.id]);
    if (isDate(row, column))
      return row[column.id] && row[column.id] !== null
        ? d(row[column.id])
        : null;

    return descriptor.getValueFormatter(row, column)();
  }
  return "";
}

const isEditable = computed(() => descriptor.getCellEditor);

const formattedValue = computed(() =>
  getFormattedValue(row.value, props.column)
);

function selectCell() {
  console.log("cell selected");
}

function startEdit() {}
</script>

<style scoped></style>
