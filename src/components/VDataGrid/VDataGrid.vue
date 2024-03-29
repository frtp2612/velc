<template>
  <div class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full">
    <div class="min-h-0 min-w-0 h-full w-full overflow-auto">
      <table
        class="table table-fixed w-full max-h-full h-full min-h-0 bg-color-bg relative overflow-auto border border-collapse border-color-border-200"
        ref="table"
      >
        <thead class="sticky-header border-b">
          <!-- additional header with colspan -->
          <tr
            class=""
            ref="columnGroupsWrapper"
            v-if="columnGroups"
            :style="{
              gridTemplateColumns: layout,
            }"
          >
            <th
              v-for="columnGroup in columnGroups"
              class="table-cell px-2 py-2 bg-color-bg border border-inherit"
              :colspan="columnGroup.span"
            >
              <span>{{ textFormatter(columnGroup.label, i18n) }}</span>
            </th>
          </tr>
          <!-- columns header -->
          <tr
            class="table-row"
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
              class="bg-color-bg table-cell"
              :style="[
                columnsDataList[index]
                  ? { width: `${columnsDataList[index].size.current}px` }
                  : {},
              ]"
            />
          </tr>
        </thead>
        <VirtualScroller
          :items="data"
          :item-height="30"
          wrapper-tag="tbody"
          wrapper-class="min-h-0 h-full"
          v-if="initialized"
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
              :data="item"
              :index="index"
              :state="state"
              :cellHeight="`${height}px`"
              :style="
                styleBinding.concat([
                  {
                    height: `${height}px`,
                    gridTemplateColumns: layout,
                  },
                ])
              "
              @dblclick="emit('rowDoubleClick', item)"
            />
          </template>
        </VirtualScroller>
        <tfoot></tfoot>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup generic="RowType extends VDataRow">
// import VirtualScroller from "@/components/VirtualScroller/VirtualScroller.vue";
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

const props = withDefaults(
  defineProps<{
    columns: VDataColumn<RowType>[];
    rows?: RowType[];
    columnGroups?: VDataGroupColumn[];
  }>(),
  {
    rows: Array,
  }
);

const i18n = useI18n();

const emit = defineEmits();

const table = ref<HTMLElement | null>(null);
const columnGroupsWrapper = ref<HTMLElement | null>(null);
const columnsWrapper = ref<HTMLElement | null>(null);
// const content = ref<InstanceType<typeof VirtualScroller> | null>(null);

const state: VDataGridStateType<RowType> = VDataGridState(
  computed(() => props.rows),
  computed(() => props.columns),
  emit
);

const { initialized, layout, data, columnsDataList } = state;

onMounted(() => {
  requestAnimationFrame(() => {
    if (table.value !== null && columnsWrapper.value !== null) {
      console.log("init");

      state.init(table.value!, columnsWrapper.value!);
    }
  });
});
</script>

<style scoped>
.sticky-header {
  @apply sticky top-0 left-0;
}
</style>
