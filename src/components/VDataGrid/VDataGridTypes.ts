import { ComputedRef, Ref } from "vue";
type VDataRow = {
  id: string;
  [key: string]: any;
};

type VDataColumn = {
  id: string;
  size?: BaseElementSize;
  formatter: Function;
  label: string;
  locked?: boolean;
};

type ElementSize = {
  min?: number;
  max?: number;
};

type BaseElementSize = ElementSize & {
  initial?: number;
};

type CalculatedElementSize = ElementSize & {
  current?: number;
};

type VDataGridStateType = {
  init: (tableContainer: HTMLElement, columnsContainer: HTMLElement) => void;
  updateColumnSize: (columnId: string, width: number) => void;
  sort: (key: string) => void;

  changeSelectedCell: (rowId: string, columnId: string, cellId: string) => void;

  columnsLayout: ComputedRef<string>;

  data: VDataRow[];
  initialized: Ref<boolean>;
  tableHeight: ComputedRef<number>;
  lockedColumnsMap: Ref<Map<string, number>>;
  columns: VDataColumn[];
  sortKey: Ref<string>;
  sortOrder: Ref<string>;

  selectedRowId: Ref<string>;
  selectedColumnId: Ref<string>;
  selectedCellId: Ref<string>;

  editMode: Ref<boolean>;
  isDirty: ComputedRef<boolean>;
};

export type {
  BaseElementSize,
  CalculatedElementSize,
  ElementSize,
  VDataColumn,
  VDataGridStateType,
  VDataRow,
};