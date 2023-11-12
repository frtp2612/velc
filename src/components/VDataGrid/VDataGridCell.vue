<template>
  <div
    :style="column.locked ? lockedStyle : ''"
    class="flex leading-[32px] border-b border-r-color-border-100 border-r outline-0 p-[1px] relative max-w-full"
    :class="[cellClass, { 'z-[1]': column.locked }]"
    tabindex="-1"
  >
    <VCheckBox
      type="checkbox"
      v-model="data[column.id]"
      v-if="isEditableBoolean"
      class="w-full h-full self-center"
      @update:model-value="onCellEditEnd"
      @click="selectCell"
      :id="cellId"
      tabindex="0"
    />
    <VDataEditor
      :type="column.dataType"
      :values="column.editor?.values"
      :formatter="column.valueFormatter"
      :id="cellId"
      v-model="data[column.id]"
      v-else-if="editable && editingCell"
      tabindex="0"
      ref="editor"
    />
    <div
      class="grid w-full items-center justify-items-center"
      v-else-if="isBoolean"
      @click="selectCell"
    >
      <font-awesome-icon
        :icon="formattedValue"
        class="w-4 h-4"
        v-if="formattedValue"
      />
    </div>
    <VLabel
      class="px-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
      :class="[editable ? 'hover:outline outline-color-primary outline-1' : '']"
      v-else
      @click="selectCell"
      @dblclick="startEdit"
    >
      {{ formattedValue }}
    </VLabel>
  </div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/VLabel.vue";
import { VDataColumn, VDataGridStateType, VDataRow, VDataType } from "@/enums";
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import VCheckBox from "../VCheckBox/index";
import VDataEditor from "./VDataEditor.vue";

const props = defineProps<{
  data: VDataRow;
  column: VDataColumn;
  editable: boolean;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { n, d } = useI18n();

const {
  lockedColumnsMap,
  changeSelectedCell,
  onCellEditEnd,
  selectedCellId,
  editMode,
} = state!;

const editor = ref<HTMLElement | null>(null);

const cellId = computed(() => `${props.data.id}-${props.column.id}`);

const lockedStyle = computed(
  () =>
    `position: sticky; left:${lockedColumnsMap.value.get(props.column.id)}px`
);

const cellClass = computed(() => {
  let value = `cell-${cellId.value} `;

  if (props.column.locked && selectedCellId.value !== cellId.value) {
    value += "bg-inherit";
  } else if (selectedCellId.value === cellId.value) {
    value += "bg-color-secondary-200";
  }

  return value;
});

const editingCell = computed(
  () => editMode.value && selectedCellId.value === cellId.value
);

const isBoolean =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.BOOLEAN;
const isEditableBoolean =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.EDITABLE_BOOLEAN;

const isNumber =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.NUMBER;

const isDate =
  props.column.dataType !== undefined &&
  (props.column.dataType as VDataType) === VDataType.DATE;

const formattedValue = computed(() => {
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
  if (editMode.value) {
    editMode.value = false;
  }
  changeSelectedCell(props.data.id, props.column.id, cellId.value);
}

function startEdit() {
  selectCell();
  if (props.column.editable && !isEditableBoolean && !isBoolean) {
    editMode.value = true;
  }
}
</script>

<style scoped></style>
