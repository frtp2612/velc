import { clamp, useElementSize, watchOnce } from "@vueuse/core";
import { computed, ref, type Ref } from "vue";
import {
  VDataColumn,
  VDataColumnState,
  VDataGroupColumn,
  VDataRow,
} from "./types";

function isElementVisible(el: HTMLElement | undefined) {
  return el && !!el.offsetParent;
}

function VDataGridState<RowType extends VDataRow>(
  rows: Ref<RowType[]>,
  columns: Ref<VDataColumn<RowType>[]>,
  // columnGroups: VDataGroupColumn[] | undefined,
  emit: {}
) {
  const tableContainerRef = ref<HTMLElement>();
  const columnsContainerRef = ref<HTMLElement>();
  const columnsDataList = ref<VDataColumnState[]>([]);
  const lockedColumnsMap = ref<Map<string, number>>(new Map<string, number>());
  const initialized = ref(false);

  const reactiveRows = ref(rows);

  const { width, height } = useElementSize(tableContainerRef);
  const visible = computed(
    () => width.value !== 0 && isElementVisible(tableContainerRef.value)
  );

  function updateRows(updatedRows: RowType[]) {
    reactiveRows.value = updatedRows;
  }

  const layout = computed(() =>
    initialized.value
      ? columnsDataList.value
          .map((column: VDataColumnState) =>
            column.size.current === -1
              ? `minmax(${column.size.min}px, 1fr)`
              : `${column.size.current!}px`
          )
          .join(" ")
      : `repeat(${columns.value.length}, 1fr)`
  );

  function init(tableContainer: HTMLElement, columnsContainer: HTMLElement) {
    tableContainerRef.value = tableContainer;
    columnsContainerRef.value = columnsContainer;
  }

  function initializeColumnsData() {
    if (!columnsContainerRef.value) return;

    columnsDataList.value.length = 0;

    Array.from(columnsContainerRef.value.children).forEach(
      (column: Element, index: number) => {
        const columnProps: VDataColumn<RowType> = columns.value[index];

        const columnData: VDataColumnState = {
          id: columnProps.id,
          el: column as HTMLElement,
          size: {
            current:
              columnProps.size && columnProps.size.initial
                ? columnProps.size.initial
                : width.value / columns.value.length,
            max:
              columnProps.size && columnProps.size.max
                ? columnProps.size.max
                : width.value,
            min:
              columnProps.size && columnProps.size.min
                ? columnProps.size.min
                : 30,
          },
        };

        if (columnData.size.current! !== -1) {
          columnData.size.current = clamp(
            columnData.size.current!,
            columnData.size.min!,
            columnData.size.max!
          );
        }

        if (columnProps.locked) {
          lockedColumnsMap.value.set(columnProps.id, 0);
          columnData.offset = 0;
        }

        columnsDataList.value.push(columnData);
      }
    );
  }

  function refreshColumnsData() {
    columnsDataList.value.forEach(
      (columnData: VDataColumnState, index: number) => {
        if (columnData.size.current! === -1) {
          columnData.size.current = columnData.el.getBoundingClientRect().width;
        }

        columnData.size.current = clamp(
          columnData.size.current!,
          columnData.size.min!,
          columnData.size.max!
        );

        if (index > 0 && columnData.offset !== undefined) {
          columnData.offset =
            columnsDataList.value[index - 1].offset! +
            columnsDataList.value[index - 1].size.current!;
          lockedColumnsMap.value.set(columnData.id, columnData.offset!);
        }
      }
    );
  }

  watchOnce(
    () => visible.value,
    () => {
      initializeColumnsData();
      refreshColumnsData();
      initialized.value = true;
      console.log(initialized);
    }
  );

  return {
    // methods
    init,

    // vars
    initialized,
    layout,
    data: reactiveRows,

    height,

    columns,
    columnsDataList,
  };
}

export default VDataGridState;
