<template>
  <div
    class="relative grid border-color-border-50 leading-loose"
    :class="rowClass"
  >
    <template v-for="column in columns" :key="`${row.id}-${column.id}`">
      <VDataGridCell :column="column" :state :row />
    </template>
  </div>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VDataGridCell from "./VDataGridCell.vue";
import { VDataGridStateType, VDataRow } from "./types";
import { computed } from "vue";

const props = defineProps<{
  row: RowType;
  index: number;
  cellHeight: string;
  state: VDataGridStateType<RowType>;
}>();

const { columns } = props.state;

const rowClass = computed(() => "bg-color-bg hover:bg-color-bg-50");
</script>
