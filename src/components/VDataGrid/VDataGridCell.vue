<template>
  <td
    class="table-cell flex border relative max-w-full h-full items-center"
    :class="[cellClass, { 'z-[1]': column.locked }]"
    tabindex="-1"
  >
    <VLabel
      class="px-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-inherit"
      :class="[editable ? '' : '', { 'text-right': isNumber }]"
      @click="selectCell"
      @contextmenu="selectCell"
      @dblclick="startEdit"
    >
      {{ formattedValue }}
    </VLabel>
  </td>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VLabel from "@/components/VLabel/VLabel.vue";
import { VDataType } from "@/enums";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { VDataColumn, VDataGridStateType, VDataRow } from "./types";

const props = defineProps<{
  data: RowType;
  column: VDataColumn<RowType>;
  editable: boolean;
  state: VDataGridStateType<RowType>;
}>();

const { n, d } = useI18n();

const {} = props.state;

const cellId = computed(() => `${props.data.id}-${props.column.id}`);

const cellClass = computed(() => {
  let value = `cell-${cellId.value} `;

  return value;
});

const isBoolean =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.BOOLEAN;

const isNumber =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.NUMBER;

const isDate =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.DATE;

const formattedValue = computed(() => {
  if (props.data.options?.filler) {
    return "";
  }

  if (props.column.valueFormatter) {
    return props.column.valueFormatter(props.data[props.column.id]);
  }

  if (props.column.dataType !== undefined) {
    if (isBoolean) return props.data[props.column.id] ? "fa-check" : undefined;
    if (isNumber) return n(props.data[props.column.id]);
    if (isDate)
      return props.data[props.column.id] && props.data[props.column.id] !== null
        ? d(props.data[props.column.id])
        : null;
  }

  return props.data[props.column.id];
});

function selectCell() {
  console.log("cell selected");
}

function startEdit() {}
</script>

<style scoped></style>
