<template>
  <div class="grid h-full relative" :class="rowClass">
    <template v-for="column in columns" :key="`${data.id}-${column.id}`">
      <VDataGridCell :column="column" :data="data" />
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  VDataGridStateType,
  VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import { inject, computed } from "vue";
import VDataGridCell from "./VDataGridCell.vue";

const props = defineProps<{
  data: VDataRow;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { columns, selectedRowId } = state!;

const rowClass = computed(() =>
  selectedRowId.value === props.data.id
    ? "bg-theme-primary-100 hover:bg-theme-primary-200"
    : "bg-theme-bg hover:bg-theme-bg-50"
);
</script>
