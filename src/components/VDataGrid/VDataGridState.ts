import { useSorter } from "@/composables/UseSorter";
import {
  CalculatedElementSize,
  VDataColumn,
  VDataGridEmits,
  VDataRow,
  VDataType,
} from "@/enums";
import { clamp, onKeyStroke, useElementSize } from "@vueuse/core";
import { computed, ref, watch, Ref } from "vue";
import { useFilter } from "../../composables/UseFilter";

type DataGridColumnData = {
  id: string;
  el: HTMLElement;
  size: CalculatedElementSize;
  offset?: number;
};

function VDataGridState(
  rows: VDataRow[],
  columns: VDataColumn[],
  defaultSortKey: string | undefined,
  defaultSortDirection: string | undefined,
  emit: VDataGridEmits
) {
  const tableContainerRef = ref<HTMLElement>();
  const columnsContainerRef = ref<HTMLElement>();
  const contentContainerRef = ref<HTMLElement>();
  const columnsDataList = ref<DataGridColumnData[]>([]);
  const lockedColumnsMap = ref<Map<string, number>>(new Map<string, number>());
  const initialized = ref(false);

  const selectedRowId = ref<number>(0);
  const selectedColumnId = ref<string>("");
  const selectedCellId = ref<string>("");

  const editMode = ref(false);

  const reactiveRows = ref(rows);

  const { width, height } = useElementSize(contentContainerRef);
  const { data, filters, setFilter } = useFilter<VDataRow>(reactiveRows);

  const selectAllMap = ref<Map<string, Ref<boolean>>>(new Map());

  function updateRows(updatedRows: VDataRow[]) {
    reactiveRows.value = updatedRows;
  }

  const { sort, sortKey, sortOrder, applySort } = useSorter<VDataRow>(
    defaultSortKey,
    defaultSortDirection
  );

  const columnsLayout = computed(() =>
    columnsDataList.value
      .map((column: DataGridColumnData) =>
        column.size.current === -1
          ? `minmax(${column.size.min}px, 1fr)`
          : `${column.size.current!}px`
      )
      .join(" ")
  );

  function init(
    tableContainer: HTMLElement,
    columnsContainer: HTMLElement,
    contentContainer: HTMLElement
  ) {
    tableContainerRef.value = tableContainer;
    columnsContainerRef.value = columnsContainer;
    contentContainerRef.value = contentContainer;

    initializeSelectAllMap();

    requestAnimationFrame(() => {
      initializeColumnsData();
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

  function initializeSelectAllMap() {
    columns
      .filter(
        (column: VDataColumn) => column.dataType === VDataType.EDITABLE_BOOLEAN
      )
      .forEach((column: VDataColumn) =>
        selectAllMap.value.set(
          column.id,
          computed(() =>
            reactiveRows.value.every((row: VDataRow) => row[column.id] === true)
          )
        )
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
      if (nextColumnData && nextColumnData.offset) {
        nextColumnData.offset = columnData.offset! + columnData.size.current!;
        lockedColumnsMap.value.set(nextColumnData.id, nextColumnData.offset);
      }
    }
  }

  function changeSelectedCell(rowId: number, columnId: string, cellId: string) {
    selectedRowId.value = rowId;
    selectedColumnId.value = columnId;
    selectedCellId.value = cellId;
  }

  onKeyStroke(
    [
      "ArrowDown",
      "ArrowUp",
      "ArrowLeft",
      "ArrowRight",
      "Escape",
      "Tab",
      "Enter",
      " ",
    ],
    (e) => {
      if (e.key === " ") {
        e.preventDefault();
        return;
      }

      let direction = {
        x: 0,
        y: 0,
      };

      if (editMode.value) {
        if (e.key === "Tab" || e.key === "Enter") {
          e.preventDefault();
          direction.y = 0;
          if (e.shiftKey) {
            direction.x = -1;
          } else {
            direction.x = 1;
          }
          onCellEditEnd();
        } else if (e.key === "Escape") {
          editMode.value = false;
        } else {
          return;
        }
      } else {
        e.preventDefault();
        direction = {
          x: +(e.key === "ArrowRight") - +(e.key === "ArrowLeft"),
          y: +(e.key === "ArrowDown") - +(e.key === "ArrowUp"),
        };
      }

      if (getColumnIndex() + direction.x < 0 && getRowIndex() > 0) {
        direction.x = 99999;
        direction.y = -1;
      } else if (
        getColumnIndex() + direction.x >= columns.length &&
        getRowIndex() < data.value.length - 1
      ) {
        direction.x = -99999;
        direction.y = 1;
      }

      const nextRowIndex = clamp(
        getRowIndex() + direction.y,
        0,
        data.value.length - 1
      );
      const nextColumnIndex = clamp(
        getColumnIndex() + direction.x,
        0,
        columns.length - 1
      );

      const rowId = data.value[nextRowIndex].id;
      const columnId = columns[nextColumnIndex].id;
      const cellId = `${rowId}-${columnId}`;
      changeSelectedCell(rowId, columnId, `${cellId}`);
      const match = tableContainerRef.value?.querySelector(`.cell-${cellId}`);
      if (match) {
        (match as HTMLElement).focus();
      }
    },
    { target: tableContainerRef.value }
  );

  function getRowIndex() {
    return data.value.findIndex(
      (row: VDataRow) => row.id === selectedRowId.value
    );
  }

  function getColumnIndex() {
    return columns.findIndex(
      (column: VDataColumn) => column.id === selectedColumnId.value
    );
  }

  function onCellEditEnd() {
    const column: VDataColumn = columns[getColumnIndex()];

    if (column && column.editable) {
      const row: VDataRow | undefined = rows.find(
        (row: VDataRow) => row.id === selectedRowId.value
      );
      if (row) {
        console.log("NEW VALUE", row[column.id]);

        emit("cellValueChanged", {
          row,
          column,
          newValue: row[column.id],
        });
      }
    }
  }

  function toggleAllValues(newValue: boolean, columnId: string) {
    reactiveRows.value.forEach((row: VDataRow) => (row[columnId] = newValue));
    emit("selectAllValueChanged", {
      newValue,
      columnId,
    });
  }

  watch(
    () => editMode.value,
    (current: boolean, previous: boolean) => {
      if (previous !== current && !current) {
        onCellEditEnd();
      }
    }
  );

  return {
    // methods
    init,
    updateColumnSize,
    updateRows,

    changeSelectedCell,

    sort,

    filters,
    setFilter,

    onCellEditEnd,

    // computed properties
    columnsLayout,

    selectAllMap,
    toggleAllValues,

    data: computed(() => applySort(data)),
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
  };
}

export default VDataGridState;
