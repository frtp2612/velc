<template>
  <div class="grid relative border-b border-color-border-50" :class="rowClass">
    <template v-for="column in columns" :key="`${data.id}-${column.id}`">
      <VDataGridCell
        :column="column"
        :data="data"
        :editable="column.editable || false"
        :style="{
          lineHeight: cellHeight,
        }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { VDataGridStateType, VDataRow } from "@/enums";
import { computed, inject } from "vue";
import VDataGridCell from "./VDataGridCell.vue";

const props = defineProps<{
  data: VDataRow;
  index: number;
  cellHeight: string;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { columns, selectedRowId } = state!;

const rowClass = computed(() =>
  selectedRowId.value === props.data.id
    ? "bg-color-bg-50 hover:bg-color-bg-100"
    : "bg-color-bg hover:bg-color-bg-50"
);
</script>
