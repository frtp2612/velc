<template>
  <div class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full">
    <div class="min-h-0 min-w-0 h-full w-full overflow-auto">
      <div
        class="w-full max-h-full h-full min-h-0 bg-color-bg relative overflow-auto border border-color-border-200"
        ref="table"
      >
        <div
          class="sticky-header bg-color-bg border-b border-inherit divide-y divide-color-border-200"
        >
          <!-- additional header with colspan -->
          <div
            class="grid bg-color-bg border-inherit"
            ref="columnGroupsWrapper"
            v-if="columnGroups"
            :style="{
              gridTemplateColumns: layout,
            }"
          >
            <div
              v-for="columnGroup in columnGroups"
              class="px-2 py-2 border-r border-inherit"
              :style="[
                {
                  gridColumn: `span ${columnGroup.span}`,
                },
              ]"
            >
              <span>{{ textFormatter(columnGroup.label, i18n) }}</span>
            </div>
          </div>
          <!-- columns header -->
          <div
            class="grid bg-color-bg border-inherit"
            ref="columnsWrapper"
            :style="{
              gridTemplateColumns: layout,
            }"
          >
            <VDataGridColumn
              v-for="(column, index) in columns"
              :data="column"
              :index="index"
              :state="state"
              class="bg-color-bg border-r border-inherit"
              :style="[
                columnsDataList[index]
                  ? { width: `${columnsDataList[index].size.current}px` }
                  : {},
              ]"
            />
          </div>
        </div>
        <VirtualScroller
          :items="data"
          :item-height="31"
          :scrollable-container="table"
          :render-ahead="8"
          wrapper-class="min-h-0 h-full divide-y divide-color-border-100 w-fit"
          v-if="initialized && table"
          ref="virtualScroller"
        >
          <template
            v-slot="{
              item,
              index,
              height,
              styleBinding,
            }: {
              item: RowType,
              index: number,
              height: number,
              styleBinding: StyleValue[],
            }"
          >
            <VDataGridRow
              :row="item"
              :index="index"
              :state
              :cellHeight="`${height}px`"
              :style="
                styleBinding.concat([
                  {
                    gridTemplateColumns: layout,
                  },
                ])
              "
              @dblclick="emit('rowDoubleClick', item)"
            />
          </template>
        </VirtualScroller>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup generic="RowType extends VDataRow">
import {
  VDataColumn,
  VDataGridStateType,
  VDataGroupColumn,
  VDataRow,
} from "./types";
import { computed, onMounted, ref } from "vue";
import VDataGridState from "./VDataGridState";
import VDataGridColumn from "./VDataGridColumn.vue";
import { textFormatter } from "@/formatters";
import { useI18n } from "vue-i18n";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import VDataGridRow from "./VDataGridRow.vue";
import { StyleValue } from "vue";
import { VDataGridDescriptor } from "./types";
import { getDefaultDescriptor } from "./defaultDescriptor";
import { ComponentInstance } from "vue";
import { clamp } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    columns: VDataColumn[];
    rows?: RowType[];
    columnGroups?: VDataGroupColumn[];
    descriptor?: VDataGridDescriptor<RowType>;
    defaultSortKey?: string;
    defaultSortDirection?: string;
  }>(),
  {
    descriptor: () => getDefaultDescriptor<RowType>(),
    rows: Array,
  }
);

const i18n = useI18n();

const emit = defineEmits();

const table = ref<HTMLElement | null>(null);
const columnGroupsWrapper = ref<HTMLElement | null>(null);
const columnsWrapper = ref<HTMLElement | null>(null);
const virtualScroller = ref<ComponentInstance<typeof VirtualScroller> | null>(
  null
);

const state: VDataGridStateType<RowType> = VDataGridState(
  computed(() => props.rows),
  computed(() => props.columns),
  props.descriptor,
  props.defaultSortKey,
  props.defaultSortDirection,
  emit
);

const { initialized, layout, data, columnsDataList } = state;

onMounted(() => {
  requestAnimationFrame(() => {
    if (table.value !== null && columnsWrapper.value !== null) {
      state.init(table.value!, columnsWrapper.value!);
    }
  });
});

defineExpose<{
  scrollToIndex: ((nodeIndex: number) => void) | undefined;
}>({
  scrollToIndex: (value: number) => {
    value = clamp(value, 0, data.value.length - 1);
    virtualScroller.value?.scrollToIndex(value);
    // changeSelectedCell(data.value[value].id, props.columns[0].id);
  },
});
</script>

<style scoped>
.sticky-header {
  @apply sticky w-fit top-0 z-10;
}
</style>
