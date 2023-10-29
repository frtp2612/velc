<template>
  <div class="relative h-full">
    <div
      class="absolute grid gap-4 w-full h-full pointer-events-none"
      :style="[
        { 'grid-template-rows': gridRows },
        { 'grid-template-columns': gridColumns },
      ]"
      ref="grid"
    >
      <div
        v-for="_gridBlock in gridBlocks"
        class="w-full h-full select-none"
      ></div>
    </div>
    <div
      class="grid gap-4 h-full"
      :style="[
        { 'grid-template-rows': gridRows },
        { 'grid-template-columns': gridColumns },
      ]"
    >
      <VDynamicGridBlock
        v-for="gridBlock in visibleBlocks"
        :key="gridBlock.id"
        :style="[
          {
            'grid-column-start': 'span ' + gridBlock.colSpan,
            'grid-row-start': 'span ' + gridBlock.rowSpan,
          },
        ]"
        :id="gridBlock.id"
        :data="gridBlock.data"
        :active="activeBlock?.id === gridBlock.id"
        @on-resize="onBlockResize"
        @on-select="selectContent(gridBlock)"
        @clear-data="onClearData(gridBlock)"
      >
        <slot v-if="gridBlock.data" :data="gridBlock.data"></slot>
      </VDynamicGridBlock>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import VDynamicGridBlock from "./VDynamicGridBlock.vue";

const props = defineProps<{
  rows: number;
  columns: number;
}>();

const emit = defineEmits(["selectBlockContent"]);

type GridBlock = {
  id: string;
  rowSpan: number;
  colSpan: number;
  visible: boolean;
  data?: Object;
};

type GridBlockData = {
  el: HTMLElement;
  blockIndex: number;
  rowIndex: number;
  colIndex: number;
  mergedWith: Set<number>;
};

const gridBlocks = ref<GridBlock[]>([]);
const gridBlocksData = ref<Map<string, GridBlockData>>(new Map());
const islands = computed<Array<number[]>>(() =>
  [...Array(props.rows)].map(() => Array(props.columns).fill(-1))
);

const activeBlock = ref<GridBlock>();

const gridRows = computed(() => `repeat(${props.rows}, minmax(0, 1fr))`);
const gridColumns = computed(() => `repeat(${props.columns}, minmax(0, 1fr))`);

const grid = ref<HTMLElement | null>(null);

onMounted(() => {
  calculateBlockData();
});

watch(
  () => [props.columns, props.rows],
  () => {
    calculateBlockData();
  }
);

function calculateBlockData() {
  gridBlocks.value.length = 0;
  for (let index = 0; index < props.rows * props.columns; index++) {
    gridBlocks.value.push({
      id: "" + index,
      colSpan: 1,
      rowSpan: 1,
      visible: true,
    });
  }

  requestAnimationFrame(() => {
    if (grid.value !== null) {
      let index = 0;

      for (const child of grid.value.children) {
        const blockData: GridBlockData = {
          el: child as HTMLElement,
          blockIndex: index,
          rowIndex: Math.floor(index / props.columns),
          colIndex: index % props.columns,
          mergedWith: new Set(),
        };

        gridBlocksData.value.set(gridBlocks.value[index].id, blockData);
        index++;
      }
    }
  });
}

function onBlockResize(
  blockId: string,
  blockSizeStart: { x: number; y: number },
  blockSizeEnd: { x: number; y: number }
) {
  const gridBlockData = gridBlocksData.value.get(blockId);

  if (gridBlockData) {
    let colSpan = 1;
    let rowSpan = 1;

    gridBlocksData.value.forEach((data: GridBlockData) => {
      const el = data.el.getBoundingClientRect();
      // if intersecting and not already merged, use it
      if (
        intersecting(
          blockSizeStart,
          blockSizeEnd,
          el.x,
          el.y,
          el.right,
          el.bottom
        )
      ) {
        if (
          gridBlockData.mergedWith.has(data.blockIndex) ||
          isAvailable(data.rowIndex, data.colIndex)
        ) {
          if (data.rowIndex !== gridBlockData.rowIndex) {
            rowSpan = Math.max(
              rowSpan,
              data.rowIndex - gridBlockData.rowIndex + 1
            );
          }

          if (data.colIndex !== gridBlockData.colIndex) {
            colSpan = Math.max(
              colSpan,
              data.colIndex - gridBlockData.colIndex + 1
            );
          }

          if (data.blockIndex !== gridBlockData.blockIndex) {
            gridBlocks.value[data.blockIndex].visible = false;
            gridBlockData.mergedWith.add(data.blockIndex);
          }
          islands.value[data.rowIndex][data.colIndex] =
            gridBlockData.blockIndex;
        }
      } else if (gridBlockData.mergedWith.has(data.blockIndex)) {
        gridBlocks.value[data.blockIndex].visible = true;
        islands.value[data.rowIndex][data.colIndex] = -1;
        gridBlockData.mergedWith.delete(data.blockIndex);
      }
    });

    if (
      !isAvailable(gridBlockData.rowIndex, gridBlockData.colIndex) &&
      colSpan == 1 &&
      rowSpan == 1
    ) {
      islands.value[gridBlockData.rowIndex][gridBlockData.colIndex] = -1;
    }

    gridBlocks.value[gridBlockData.blockIndex].colSpan = colSpan;
    gridBlocks.value[gridBlockData.blockIndex].rowSpan = rowSpan;
  }
}

function isAvailable(x: number, y: number) {
  return islands.value[x][y] === -1;
}

function intersecting(
  rect1Start: { x: number; y: number },
  rect1End: { x: number; y: number },
  rect2StartX: number,
  rect2StartY: number,
  rect2EndX: number,
  rect2EndY: number
) {
  return (
    rect1End.x >= rect2StartX &&
    rect1Start.x <= rect2EndX &&
    rect1Start.y <= rect2EndY &&
    rect1End.y >= rect2StartY
  );
}

function selectContent(gridBlock: GridBlock) {
  if (activeBlock.value?.id === gridBlock.id) {
    activeBlock.value = undefined;
  } else {
    activeBlock.value = gridBlock;
  }
}

function assignData(key: string, data: any) {
  if (activeBlock.value) {
    activeBlock.value["data"] = {
      [key]: data,
    };

    activeBlock.value = undefined;
  }
}

defineExpose({ assignData });

function onClearData(gridBlock: GridBlock) {
  gridBlock["data"] = undefined;
}

const visibleBlocks = computed(() =>
  gridBlocks.value.filter((block: GridBlock) => block.visible)
);
</script>
