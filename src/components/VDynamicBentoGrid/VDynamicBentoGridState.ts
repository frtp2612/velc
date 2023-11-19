import { ref, computed } from "vue";
import { VDynamicBentoGridRegionData } from "../../enums/index";
type GridBlock = {
  id: number;
  rowIndex: number;
  colIndex: number;
};

type GridRegion = {
  id: string;
  rowIndex: number;
  colIndex: number;
  rowSpan: number;
  colSpan: number;
  data: VDynamicBentoGridRegionData;
};

export function VDynamicBentoGridState(rows: number, columns: number) {
  const gridBlocks = ref<GridBlock[]>([]);
  const regions = ref<Map<string, GridRegion>>(new Map());
  const usedGridBlocks = ref<Set<string>>(new Set());

  const previewElementWidth = ref("");
  const previewElementHeight = ref("");
  const previewElementPath = ref("");
  const previewElementName = ref("");
  const dragging = ref(false);

  const activeGridBlock = ref<GridBlock>();
  const activeRegionId = ref("");

  const gridRows = computed(() => `repeat(${rows}, minmax(0, 1fr))`);
  const gridColumns = computed(() => `repeat(${columns}, minmax(0, 1fr))`);
  const positionValid = ref(false);

  function initializeGrid() {
    for (let index = 0; index < rows * columns; index++) {
      gridBlocks.value.push({
        id: index,
        rowIndex: Math.floor(index / columns),
        colIndex: index % columns,
      });
    }
  }

  function addRegionContent(
    rowSpan: number,
    colSpan: number,
    data: VDynamicBentoGridRegionData
  ) {
    if (activeGridBlock.value) {
      const region: GridRegion = {
        id: `${activeGridBlock.value.rowIndex}-${activeGridBlock.value.colIndex}`,
        rowSpan,
        colSpan,
        rowIndex: activeGridBlock.value.rowIndex,
        colIndex: activeGridBlock.value.colIndex,
        data,
      };
      console.log(region);

      regions.value.set(region.id, region);
    }
  }

  function onDragOver(gridBlock: GridBlock) {
    const data = JSON.parse(sessionStorage.getItem("draggable")!);
    if (previewElementPath.value === "") {
      previewElementPath.value = data.componentPath;
    }

    if (previewElementName.value === "") {
      previewElementName.value = data.name;
    }

    previewElementWidth.value =
      gridBlock.colIndex + 1 + " / span " + data.size.x;
    previewElementHeight.value =
      gridBlock.rowIndex + 1 + " / span " + data.size.y;

    activeGridBlock.value = gridBlock;

    positionValid.value =
      gridBlock.colIndex + data.size.x <= columns &&
      gridBlock.rowIndex + data.size.y <= rows &&
      isBlockAvailable(data.size.y, data.size.x);
    dragging.value = true;
  }

  function onDrop(event: DragEvent) {
    if (positionValid.value) {
      const data = JSON.parse(event.dataTransfer?.getData("text/plain")!);
      console.log(data);

      addRegionContent(data.size.y, data.size.x, data);
      updateUsedBlocks(data.size.y, data.size.x);
    }
    onDragEnd();
  }

  function updateUsedBlocks(rowSpan: number, colSpan: number) {
    if (activeGridBlock.value) {
      for (let rowIndex = 0; rowIndex < rowSpan; rowIndex++) {
        const effectiveRowIndex =
          (activeGridBlock.value.rowIndex + rowIndex) * rows;
        for (let colIndex = 0; colIndex < colSpan; colIndex++) {
          const effectiveColIndex = activeGridBlock.value.colIndex + colIndex;
          usedGridBlocks.value.add(effectiveRowIndex + "-" + effectiveColIndex);
        }
      }
    }
  }

  function isBlockAvailable(rowSpan: number, colSpan: number) {
    if (activeGridBlock.value) {
      for (let rowIndex = 0; rowIndex < rowSpan; rowIndex++) {
        const effectiveRowIndex =
          (activeGridBlock.value.rowIndex + rowIndex) * rows;

        for (let colIndex = 0; colIndex < colSpan; colIndex++) {
          const effectiveColIndex = activeGridBlock.value.colIndex + colIndex;

          if (
            usedGridBlocks.value.has(
              effectiveRowIndex + "-" + effectiveColIndex
            )
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  function onDragEnd() {
    dragging.value = false;
    previewElementWidth.value = "";
    previewElementHeight.value = "";
    previewElementPath.value = "";
    previewElementName.value = "";
  }

  initializeGrid();

  return {
    activeRegionId,

    gridRows,
    gridColumns,

    previewElementHeight,
    previewElementWidth,
    previewElementPath,
    previewElementName,
    dragging,
    positionValid,

    gridBlocks,
    regions,
    addRegionContent,
    onDragOver,
    onDrop,
    onDragEnd,
  };
}
