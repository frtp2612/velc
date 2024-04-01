import { clamp, useElementSize, watchOnce } from "@vueuse/core";
import { computed, ref, type Ref } from "vue";
import {
  VDataColumn,
  VDataColumnState,
  VDataGridDescriptor,
  VDataRow,
} from "./types";
import { VDataType } from "@/enums";

function isElementVisible(el: HTMLElement | undefined) {
  return el && !!el.offsetParent;
}

function VDataGridState<RowType extends VDataRow>(
  rows: Ref<RowType[]>,
  columns: Ref<VDataColumn[]>,
  descriptor: VDataGridDescriptor<RowType>,
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

  function getRow(rowId: number): RowType | undefined {
    return reactiveRows.value.find((row) => row.id === rowId);
  }

  const isString = (row: RowType, column: VDataColumn) =>
    descriptor && descriptor.getDataType(row, column) === VDataType.STRING;
  const isNumber = (row: RowType, column: VDataColumn) =>
    descriptor && descriptor.getDataType(row, column) === VDataType.NUMBER;
  const isDropdown = (row: RowType, column: VDataColumn) =>
    descriptor && descriptor.getDataType(row, column) === VDataType.SELECT;
  const isDate = (row: RowType, column: VDataColumn) =>
    descriptor && descriptor.getDataType(row, column) === VDataType.DATE;
  const isBoolean = (row: RowType, column: VDataColumn) =>
    descriptor && descriptor.getDataType(row, column) === VDataType.BOOLEAN;
  const isEditableBoolean = (row: RowType, column: VDataColumn) =>
    descriptor &&
    descriptor.getDataType(row, column) === VDataType.EDITABLE_BOOLEAN;

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

    getRow,

    // vars
    initialized,
    layout,
    data: reactiveRows,

    descriptor,
    height,

    columns,
    columnsDataList,

    isString,
    isNumber,
    isDropdown,
    isDate,
    isBoolean,
    isEditableBoolean,
  };
}

export default VDataGridState;
