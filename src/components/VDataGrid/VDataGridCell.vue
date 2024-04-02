<template>
  <div
    class="flex relative max-w-full h-full items-center border-r border-inherit outline-none after:absolute after:top-0 after:left-0 after:w-full after:h-full after:border after:border-color-primary after:pointer-events-none"
    :class="[
      cellClass,
      { 'z-[1]': column.descriptor?.isLocked },
      selectedCellId === cellId ? '' : 'hover:after:block after:hidden',
    ]"
    :style="column.descriptor?.isLocked ? lockedStyle : ''"
    tabindex="-1"
    :title="getTooltip((row as RowType), column)"
  >
    <VDataEditor
      v-if="isEditable && editMode && selectedCellId === cellId"
      :descriptor="cellEditor"
      :id="cellId"
      auto-focus
      v-model="(row as RowType)[column.id]"
      ref="editor"
    />
    <template v-else>
      <div
        class="absolute top-0 left-0 w-full h-full"
        @click="selectCell"
        @contextmenu="selectCell"
        @dblclick="startEdit"
      ></div>
      <template v-if="isBooleanValue">
        <div
          class="grid w-full items-center justify-items-center"
          @click="selectCell"
        >
          <font-awesome-icon
            :icon="formattedValue"
            class="w-4 h-4"
            v-if="formattedValue"
          />
        </div>
      </template>
      <template v-else>
        <VLabel
          class="px-2 w-full h-full overflow-hidden overflow-ellipsis whitespace-nowrap text-inherit"
          :class="[isEditable ? '' : '']"
        >
          <font-awesome-icon
            :icon="iconName"
            class="w-4 h-4"
            v-if="hasIcon && getIconAlignment((row as RowType), column) !== Position.RIGHT"
          />
          <span v-if="textVisible">{{ formattedValue }}</span>
          <font-awesome-icon
            :icon="iconName"
            class="w-4 h-4"
            v-if="hasIcon && getIconAlignment((row as RowType), column) === Position.RIGHT"
          />
        </VLabel>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VLabel from "@/components/VLabel/VLabel.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { VDataColumn, VDataGridStateType, VDataRow } from "./types";
import { HorizontalAlignment, Position } from "@/enums";
import VDataEditor from "@/components/VDataEditor/VDataEditor.vue";

const props = defineProps<{
  row: RowType;
  column: VDataColumn;
  state: VDataGridStateType<RowType>;
}>();

const { n, d } = useI18n();

const {
  getCellBackground,
  getCellForeground,
  getCellEditor,
  getHorizontalAlignment,
  getIcon,
  getIconAlignment,
  getTooltip,
  isTextVisible,
  isBoolean,
  isDate,
  isEditableBoolean,
  isNumber,
  descriptor,
  setSelectedCell,
  setEditMode,
  editMode,
  selectedCellId,
} = props.state;

const isBooleanValue = isBoolean(props.row, props.column);

const isEditableBooleanValue = computed(() =>
  isEditableBoolean(props.row, props.column)
);

const cellEditor = getCellEditor(props.row, props.column);

const cellId = `${props.row.id}-${props.column.id}`;

const cellClass = computed(() => {
  let value = `cell-${cellId} `;

  if (props.row && getCellBackground(props.row, props.column)) {
    value += getCellBackground(props.row, props.column) + " ";
  }

  if (props.row && getCellForeground(props.row, props.column)) {
    value += getCellForeground(props.row, props.column) + " ";
  }

  if (getHorizontalAlignment(props.row, props.column)) {
    switch (getHorizontalAlignment(props.row, props.column)!) {
      case HorizontalAlignment.CENTER:
        value += "text-center ";
        break;
      case HorizontalAlignment.RIGHT:
        value += "text-right ";
        break;
    }
  }

  if (props.column.descriptor.isLocked) {
    value += "bg-inherit ";
  }

  if (selectedCellId.value === cellId) {
    value += " ";
  }

  return value;
});

const hasIcon = getIcon && getIcon(props.row, props.column);

const iconName = getIcon(props.row, props.column);

const textVisible = isTextVisible(props.row, props.column);

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

const lockedStyle = computed(
  () =>
    `position: sticky; left:${props.state.getLockedColumnPosition(
      props.column.id
    )}px;`
);

const isEditable = computed(
  () =>
    descriptor.getCellEditor &&
    descriptor.getCellEditor(props.row, props.column)
);

const formattedValue = computed(() =>
  getFormattedValue(props.row, props.column)
);

function selectCell() {
  setSelectedCell(props.row.id, props.column.id, cellId);
}

function startEdit() {
  if (isEditable.value) {
    setEditMode(true);
  }
}
</script>

<style scoped></style>
