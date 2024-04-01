<template>
  <div
    class="relative grid border-color-border-50 divide-x divide-color-border-100"
  >
    <template v-for="column in columns" :key="`${data.id}-${column.id}`">
      <VDataGridCell :column="column" :state="state" :rowId="data.id" />
    </template>
  </div>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VDataGridCell from "./VDataGridCell.vue";
import { VDataGridStateType, VDataRow } from "./types";

const props = defineProps<{
  data: VDataRow;
  index: number;
  cellHeight: string;
  state: VDataGridStateType<RowType>;
}>();

const { columns } = props.state;
</script>
