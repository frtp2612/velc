<template>
  <tr class="relative border-color-border-50">
    <template v-for="column in columns" :key="`${data.id}-${column.id}`">
      <VDataGridCell
        :column="column"
        :state="state"
        :data="data"
        :editable="column.editable || false"
      />
    </template>
  </tr>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VDataGridCell from "./VDataGridCell.vue";
import { VDataGridStateType, VDataRow } from "./types";

const props = defineProps<{
  data: RowType;
  index: number;
  cellHeight: string;
  state: VDataGridStateType<RowType>;
}>();

const { columns } = props.state;
</script>
