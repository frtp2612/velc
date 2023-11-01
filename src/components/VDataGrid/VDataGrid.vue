<template>
  <div
    class="flex flex-col border bg-theme-bg border-theme-bg-200 min-h-0 min-w-0 h-full w-full overflow-auto"
  >
    <div class="relative min-h-0 flex flex-col h-full" ref="tableContainer">
      <!--GRID LEADING CONTENT-->

      <!-- GRID CONTENT -->
      <VirtualScroller
        :item-height="32"
        :items="data"
        :wrapper-class="initialized ? 'w-fit' : ''"
        ref="content"
      >
        <template #prepend>
          <!-- GRID HEADER -->
          <div
            class="sticky grid top-0 bg-theme-bg-50 z-10 border-b"
            :class="{ 'w-fit': initialized }"
            :style="{
              gridTemplateColumns: columnsLayout || columnsGridLayout,
            }"
            ref="columnsContainer"
          >
            <VDataGridColumn
              v-for="(column, index) in columns"
              :data="column"
              :index="index"
              class="px-3 leading-[32px]"
            />
          </div>
        </template>
        <!-- GRID ROWS -->
        <template v-slot="{ item }">
          <VDataGridRow
            :data="item"
            :style="{
              gridTemplateColumns: columnsLayout || columnsGridLayout,
            }"
          />
        </template>
      </VirtualScroller>
      <div>
        {{ isDirty }}
      </div>
      <!--GRID TRAILING CONTENT-->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, provide, ref } from "vue";
import VirtualScroller from "@/components/VirtualScroller/VirtualScroller.vue";
import VDataGridColumn from "./VDataGridColumn.vue";
import VDataGridRow from "./VDataGridRow.vue";
import VDataGridState from "./VDataGridState";
import { VDataColumn, VDataRow } from "./VDataGridTypes";
// import { useScrollSyncrhonizer } from "../../composables/UseScrollSynchronizer";

const props = defineProps<{
  columns: Array<VDataColumn>;
  rows: Array<VDataRow>;
  defaultSortKey?: string;
  defaultSortDirection?: string;
}>();

const columnsGridLayout = computed(
  () => `repeat(${props.columns.length}, 1fr)`
);

const state = VDataGridState(
  ref(props.rows),
  props.columns,
  props.defaultSortKey,
  props.defaultSortDirection
);

const { initialized, columnsLayout, data, isDirty } = state;

const tableContainer = ref<HTMLElement | null>(null);
const columnsContainer = ref<HTMLElement | null>(null);
const content = ref<InstanceType<typeof VirtualScroller> | null>(null);

provide("state", state);

// useScrollSyncrhonizer(
//   true,
//   false,
//   computed(() => content.value!.container),
//   columnsContainer
// );

onMounted(() => {
  if (tableContainer.value !== null && columnsContainer.value !== null) {
    state.init(tableContainer.value, columnsContainer.value);
  }
});
</script>
