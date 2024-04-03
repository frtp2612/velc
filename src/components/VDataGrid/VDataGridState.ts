import {
  clamp,
  onKeyStroke,
  onStartTyping,
  useElementSize,
  watchOnce,
} from "@vueuse/core";
import { computed, ref, VNode, type Ref, Component, watch } from "vue";
import {
  VCellEditor,
  VDataColumn,
  VDataColumnState,
  VDataGridDescriptor,
  VDataGridEmits,
  VDataRow,
} from "./types";
import { HorizontalAlignment, Position, VDataType } from "@/enums";
import { useSorter } from "@/composables/UseSorter";
import { useFilter } from "@/composables/UseFilter";

function isElementVisible(el: HTMLElement | undefined) {
  return el && !!el.offsetParent;
}

function VDataGridState<RowType extends VDataRow>(
  rows: Ref<RowType[]>,
  columns: Ref<VDataColumn[]>,
  descriptor: VDataGridDescriptor<RowType>,
  defaultSortKey: string | undefined,
  defaultSortDirection: string | undefined,
  emit: VDataGridEmits<RowType>
) {
  const tableContainerRef = ref<HTMLElement>();
  const columnsContainerRef = ref<HTMLElement>();
  const columnsDataList = ref<VDataColumnState[]>([]);
  const lockedColumnsMap = ref<Map<string, number>>(new Map<string, number>());
  const selectAllMap = ref<Map<string, Ref<boolean>>>(new Map());
  const initialized = ref(false);

  const reactiveRows = ref(rows);

  const selectedRowId = ref<number>(0);
  const selectedColumnId = ref<string>("");
  const selectedCellId = ref<string>("");

  const activeCell = ref<HTMLElement>();

  const editMode = ref<boolean>(false);

  const { width, height } = useElementSize(tableContainerRef);

  const { filteredData, filters, setFilter, resetFilter, applyFilters } =
    useFilter<RowType>(reactiveRows);

  const { sort, sortKey, sortOrder, applySort } = useSorter<RowType>(
    defaultSortKey,
    defaultSortDirection
  );

  function updateRows(updatedRows: RowType[]) {
    reactiveRows.value = updatedRows;
  }

  const selectedRow = computed(() =>
    reactiveRows.value.find((row) => row.id === selectedRowId.value)
  );
  const selectedColumn = computed(() =>
    columns.value.find((column) => column.id === selectedColumnId.value)
  );

  const visible = computed(
    () => width.value !== 0 && isElementVisible(tableContainerRef.value)
  );

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

  const data = ref(applySort(reactiveRows)) as Ref<RowType[]>;

  watch(
    () => filteredData.value,
    () => {
      data.value = filteredData.value;
      data.value = applySort(data);
      console.log("Data filtered", data.value);
    },
    { immediate: true }
  );

  watch(
    () => [sortKey.value, sortOrder.value],
    () => {
      data.value = applySort(data);
    },
    { immediate: true }
  );

  watch(
    () => reactiveRows.value.length,
    () => {
      applyFilters();
    }
  );

  function init(tableContainer: HTMLElement, columnsContainer: HTMLElement) {
    tableContainerRef.value = tableContainer;
    columnsContainerRef.value = columnsContainer;
  }

  initializeSelectAllMap();

  function initializeSelectAllMap() {
    columns.value
      .filter(
        (column: VDataColumn) => column.dataType === VDataType.EDITABLE_BOOLEAN
      )
      .forEach((column: VDataColumn) => {
        selectAllMap.value.set(
          column.id,
          computed(() =>
            data.value.every((row: RowType) => row[column.id] === true)
          )
        );
      });
  }

  function initializeColumnsData() {
    if (!columnsContainerRef.value) return;

    columnsDataList.value.length = 0;

    Array.from(columnsContainerRef.value.children).forEach(
      (column: Element, index: number) => {
        const columnProps: VDataColumn = columns.value[index];
        const size = columnProps.descriptor.size;
        const columnData: VDataColumnState = {
          id: columnProps.id,
          el: column as HTMLElement,
          size: {
            current:
              size && size.initial
                ? size.initial
                : width.value / columns.value.length,
            max: size && size.max ? size.max : width.value,
            min: size && size.min ? size.min : 30,
          },
        };

        if (columnData.size.current! !== -1) {
          columnData.size.current = clamp(
            columnData.size.current!,
            columnData.size.min!,
            columnData.size.max!
          );
        }

        if (columnProps.descriptor.isLocked) {
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

  function updateColumnSize(columnId: string, width: number) {
    const columnDataIndex: number = columnsDataList.value.findIndex(
      (column: VDataColumnState) => column.id === columnId
    );

    if (columnDataIndex !== -1) {
      const columnData: VDataColumnState =
        columnsDataList.value[columnDataIndex];

      columnData.size.current = clamp(
        width,
        columnData.size.min!,
        columnData.size.max!
      );

      const nextColumnData: VDataColumnState =
        columnsDataList.value[columnDataIndex + 1];
      if (nextColumnData && nextColumnData.offset) {
        nextColumnData.offset = columnData.offset! + columnData.size.current!;
        lockedColumnsMap.value.set(nextColumnData.id, nextColumnData.offset);
      }
    }
  }

  function getRow(rowId: number): RowType | undefined {
    return data.value.find((row) => row.id === rowId);
  }

  function getLockedColumnPosition(columnId: string): number {
    return lockedColumnsMap.value.get(columnId) ?? 0;
  }

  // DESCRIPTOR METHODS START

  function getCellBackground(
    row: RowType,
    column: VDataColumn
  ): string | undefined {
    return descriptor.getCellBackground
      ? descriptor.getCellBackground(row, column)
      : undefined;
  }

  function getCellForeground(row: RowType, column: VDataColumn) {
    return descriptor.getCellForeground
      ? descriptor.getCellForeground(row, column)
      : undefined;
  }

  function getHorizontalAlignment(
    row: RowType,
    column: VDataColumn
  ): HorizontalAlignment | undefined {
    return descriptor.getHorizontalAlignment
      ? descriptor.getHorizontalAlignment(row, column)
      : undefined;
  }

  function getIcon(
    row: RowType,
    column: VDataColumn
  ): string | VNode | Component | undefined {
    return descriptor.getIcon ? descriptor.getIcon(row, column) : undefined;
  }

  function getIconAlignment(
    row: RowType,
    column: VDataColumn
  ): Position | undefined {
    return descriptor.getIconAlignment
      ? descriptor.getIconAlignment(row, column)
      : undefined;
  }

  function getTooltip(row: RowType, column: VDataColumn): string | undefined {
    return descriptor.getTooltip
      ? descriptor.getTooltip(row, column)
      : undefined;
  }

  function isTextVisible(row: RowType, column: VDataColumn): boolean {
    return descriptor.isTextVisible
      ? descriptor.isTextVisible(row, column)
      : true;
  }

  function getCellEditor(
    row: RowType,
    column: VDataColumn
  ): VCellEditor | undefined {
    return descriptor.getCellEditor
      ? descriptor.getCellEditor(row, column)
      : {
          type: VDataType.STRING,
        };
  }

  // DESCRIPTOR METHODS END

  function setSelectedCell(rowId: number, columnId: string, cellId: string) {
    if (editMode.value) {
      editMode.value = false;
      onCellEditEnd();
    }

    selectedRowId.value = rowId;
    selectedColumnId.value = columnId;
    selectedCellId.value = cellId;
  }

  function setEditMode(value: boolean) {
    editMode.value = value;
  }

  const isString = (row: RowType, column: VDataColumn) =>
    !descriptor ||
    (descriptor && !descriptor.getDataType) ||
    (descriptor &&
      descriptor.getDataType &&
      descriptor.getDataType(row, column) === VDataType.STRING);
  const isNumber = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType &&
    descriptor.getDataType(row, column) === VDataType.NUMBER;
  const isDropdown = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType &&
    descriptor.getDataType(row, column) === VDataType.SELECT;
  const isDate = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType &&
    descriptor.getDataType(row, column) === VDataType.DATE;
  const isBoolean = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType &&
    descriptor.getDataType(row, column) === VDataType.BOOLEAN;
  const isEditableBoolean = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType &&
    descriptor.getDataType(row, column) === VDataType.EDITABLE_BOOLEAN;

  function onCellEditEnd() {
    const column: VDataColumn = columns.value[getColumnIndex()];

    if (column) {
      const row: RowType | undefined = rows.value.find(
        (row: RowType) => row.id === selectedRowId.value
      );
      if (row) {
        const newValue = row[column.id];
        console.log("value changed");

        emit("cellValueChanged", {
          row,
          column,
          newValue,
        });
      }
    }
  }

  function getRowIndex() {
    return data.value.findIndex(
      (row: RowType) => row.id === selectedRowId.value
    );
  }

  function getColumnIndex() {
    return columns.value.findIndex(
      (column: VDataColumn) => column.id === selectedColumnId.value
    );
  }

  function isCellFocused() {
    return (
      getSelectedCell() !== null && getSelectedCell() === document.activeElement
    );
  }

  function getSelectedCell() {
    return tableContainerRef.value?.querySelector(
      `.cell-${selectedRowId.value}-${selectedColumnId.value}`
    );
  }

  function selectAll(columnId: string, value: boolean) {
    data.value.forEach((row: VDataRow) => {
      row[columnId] = value;
    });

    emit("selectAll", {
      data: data.value,
      columnId,
      value,
    });
  }

  onKeyStroke(
    ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"],
    (event: KeyboardEvent) => {
      if (!isCellFocused()) return;
      if (editMode.value) return;
      event.preventDefault();
      event.stopPropagation();

      let direction = {
        x: +(event.key === "ArrowRight") - +(event.key === "ArrowLeft"),
        y: +(event.key === "ArrowDown") - +(event.key === "ArrowUp"),
      };

      jumpToNextCell(direction);
    },
    { target: tableContainerRef.value }
  );

  onKeyStroke(
    ["Enter"],
    (event: KeyboardEvent) => {
      if (!editMode.value) return;
      event.preventDefault();
      event.stopPropagation();

      let direction = {
        x: 1,
        y: 0,
      };

      jumpToNextCell(direction);
    },
    { target: tableContainerRef.value }
  );

  onKeyStroke(
    [" "],
    (event: KeyboardEvent) => {
      if (!isCellFocused()) return;
      if (editMode.value) return;
      event.preventDefault();
    },
    { target: tableContainerRef.value }
  );

  onStartTyping((event: KeyboardEvent) => {
    if (!isCellFocused()) return;
    if (editMode.value) return;

    if (
      selectedRow.value &&
      selectedColumn.value &&
      getCellEditor(selectedRow.value, selectedColumn.value)
    ) {
      setEditMode(true);
      (selectedRow.value as VDataRow)[selectedColumnId.value] = null;
    }
  });

  function jumpToNextCell(direction: { x: number; y: number }) {
    if (getColumnIndex() + direction.x < 0 && getRowIndex() > 0) {
      direction.x = Infinity;
      direction.y = -1;
    } else if (
      getColumnIndex() + direction.x >= columns.value.length &&
      getRowIndex() < data.value.length - 1
    ) {
      direction.x = -Infinity;
      direction.y = 1;
    }

    let nextRowIndex = clamp(
      getRowIndex() + direction.y,
      0,
      data.value.length - 1
    );

    let nextColumnIndex = clamp(
      getColumnIndex() + direction.x,
      0,
      columns.value.length - 1
    );

    const rowId = data.value[nextRowIndex].id;
    const columnId = columns.value[nextColumnIndex].id;

    setSelectedCell(rowId, columnId, `${rowId}-${columnId}`);
  }

  watch(
    () => selectedCellId.value,
    () => {
      const match = tableContainerRef.value?.querySelector(
        `.cell-${selectedCellId.value}`
      );
      if (match) {
        (match as HTMLElement).focus();
        activeCell.value = match as HTMLElement;
      }

      emit("rowClick", getRow(selectedRowId.value));
    }
  );

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

    sort,
    setFilter,
    resetFilter,

    getRow,

    getCellEditor,
    getLockedColumnPosition,
    getCellBackground,
    getCellForeground,
    getHorizontalAlignment,
    getIcon,
    getIconAlignment,
    getTooltip,
    isTextVisible,

    setSelectedCell,
    setEditMode,

    updateColumnSize,

    // vars
    initialized,
    layout,
    data,

    editMode,

    filters,
    sortKey,
    sortOrder,

    descriptor,
    height,

    columns,
    columnsDataList,

    selectedCellId,

    isString,
    isNumber,
    isDropdown,
    isDate,
    isBoolean,
    isEditableBoolean,
  };
}

export default VDataGridState;
