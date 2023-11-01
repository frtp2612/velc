import {
  CalculatedElementSize,
  VDataColumn,
  VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import { clamp, useElementSize } from "@vueuse/core";
import { Ref, computed, nextTick, ref } from "vue";
import { useSorter } from "../../composables/UseSorter";

type DataGridColumnData = {
  id: string;
  el: HTMLElement;
  size: CalculatedElementSize;
  offset?: number;
};

function VDataGridState(
  rows: Ref<VDataRow[]>,
  columns: VDataColumn[],
  defaultSortKey: string | undefined,
  defaultSortDirection: string | undefined
) {
  const initialState = JSON.stringify(rows.value);
  const tableContainerRef = ref<HTMLElement>();
  const columnsContainerRef = ref<HTMLElement>();
  const columnsDataList = ref<DataGridColumnData[]>([]);
  const lockedColumnsMap = ref<Map<string, number>>(new Map<string, number>());
  const initialized = ref(false);

  const selectedRowId = ref<string>("");
  const selectedColumnId = ref<string>("");
  const selectedCellId = ref<string>("");

  const editMode = ref(false);

  const { width, height } = useElementSize(tableContainerRef);

  const columnsLayout = computed(() =>
    columnsDataList.value
      .map((column: DataGridColumnData) =>
        column.size.current === -1
          ? `minmax(${column.size.min}px, 1fr)`
          : `${column.size.current!}px`
      )
      .join(" ")
  );

  const { sortedData, sort, sortKey, sortOrder } = useSorter<VDataRow>(
    rows,
    defaultSortKey,
    defaultSortDirection
  );

  function init(tableContainer: HTMLElement, columnsContainer: HTMLElement) {
    tableContainerRef.value = tableContainer;
    columnsContainerRef.value = columnsContainer;

    initializeColumnsData();

    nextTick(() => {
      refreshColumnsData();
      initialized.value = true;
    });
  }

  function initializeColumnsData() {
    Array.from(columnsContainerRef.value!.children).forEach(
      (column: Element, index: number) => {
        const columnProps: VDataColumn = columns[index];

        const columnData: DataGridColumnData = {
          id: columnProps.id,
          el: column as HTMLElement,
          size: {
            current:
              columnProps.size && columnProps.size.initial
                ? columnProps.size.initial
                : -1,
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
      (columnData: DataGridColumnData, index: number) => {
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
          lockedColumnsMap.value.set(columnData.id, columnData.offset);
        }
      }
    );
  }

  function updateColumnSize(columnId: string, width: number) {
    const columnDataIndex: number = columnsDataList.value.findIndex(
      (column: DataGridColumnData) => column.id === columnId
    );

    if (columnDataIndex !== -1) {
      const columnData: DataGridColumnData =
        columnsDataList.value[columnDataIndex];

      columnData.size.current = clamp(
        width,
        columnData.size.min!,
        columnData.size.max!
      );

      const nextColumnData: DataGridColumnData =
        columnsDataList.value[columnDataIndex + 1];
      if (nextColumnData.offset) {
        nextColumnData.offset = columnData.offset! + columnData.size.current!;
        lockedColumnsMap.value.set(nextColumnData.id, nextColumnData.offset);
      }
    }
  }

  function changeSelectedCell(rowId: string, columnId: string, cellId: string) {
    selectedRowId.value = rowId;
    selectedColumnId.value = columnId;
    selectedCellId.value = cellId;
  }

  const isDirty = computed(
    () => initialState !== JSON.stringify(sortedData.value)
  );

  return {
    // methods
    init,
    updateColumnSize,

    changeSelectedCell,

    sort,

    // computed properties
    columnsLayout,

    data: sortedData,
    sortKey,
    sortOrder,

    initialized,
    tableHeight: height,
    lockedColumnsMap,

    columns,

    selectedRowId,
    selectedColumnId,
    selectedCellId,

    editMode,

    isDirty,
  };
}

export default VDataGridState;
