import { HorizontalAlignment, Position, VDataType } from "@/enums";
import { BaseElementSize, CalculatedElementSize, Translatable } from "@/types";
import { Component, ComputedRef, Ref, VNode } from "vue";

export type VDataRow = {
  id: number;
  options?: VDataRowOptions;
  [key: string]: any;
};

export type VDataRowOptions = {
  lighten?: boolean;
  darken?: number;
  filler?: boolean;
  indent?: number;
};

export type VDataColumn = {
  id: string;
  label: Translatable;
  descriptor: VDataColumnDescriptor;
  dataType: VDataType;
};

export type VDataColumnDescriptor = {
  isLocked?: boolean;
  isFilterable?: boolean;
  size?: BaseElementSize;
};

export type VCellEditor =
  | VBooleanCellEditor
  | VStringCellEditor
  | VDropdownCellEditor
  | VNumberCellEditor
  | VDateCellEditor;

export type VBooleanCellEditor = {
  type: VDataType.BOOLEAN;
};

export type VStringCellEditor = {
  type: VDataType.STRING;
};

export type VNumberCellEditor = {
  type: VDataType.NUMBER;
  min?: number;
  max?: number;
};

export type VDropdownCellEditor = {
  type: VDataType.SELECT;
  values: () => any[];
  formatter: (value: any) => string;
};

export type VDateCellEditor = {
  type: VDataType.DATE;
};

export type VDataGroupColumn = {
  id: string;
  span: number;
  label: Translatable;
};

export type VDataColumnState = {
  id: string;
  el: HTMLElement;
  size: CalculatedElementSize;
  offset?: number;
};

export type VDataGridStateType<RowType extends VDataRow> = {
  init: (tableWrapper: HTMLElement, columnsWrapper: HTMLElement) => void;
  getRow: (rowId: number) => RowType | undefined;

  getCellForeground: (row: RowType, column: VDataColumn) => string;
  getCellBackground: (row: RowType, column: VDataColumn) => string;
  getCellComponent?: (row: RowType, column: VDataColumn) => VNode | Component;
  getCellEditor: (row: RowType, column: VDataColumn) => VCellEditor;
  getValueFormatter?: (value: any) => string;
  getDataType?: (row: RowType, column: VDataColumn) => VDataType;
  getHorizontalAlignment: (
    row: RowType,
    column: VDataColumn
  ) => HorizontalAlignment | undefined;
  getIcon: (
    row: RowType,
    column: VDataColumn
  ) => string | VNode | Component | undefined;
  getIconAlignment: (row: RowType, column: VDataColumn) => Position | undefined;
  getTooltip: (row: RowType, column: VDataColumn) => string | undefined;
  isTextVisible: (row: RowType, column: VDataColumn) => boolean;

  updateColumnSize: (columnId: string, width: number) => void;
  getLockedColumnPosition: (columnId: string) => number;

  setSelectedCell: (rowId: number, columnId: string, cellId: string) => void;
  setEditMode: (value: boolean) => void;

  layout: ComputedRef<string>;

  data: Ref<RowType[]>;
  descriptor: VDataGridDescriptor<RowType>;
  initialized: Ref<boolean>;
  editMode: Ref<boolean>;
  height: Ref<number>;
  columns: Ref<VDataColumn[]>;
  columnsDataList: Ref<VDataColumnState[]>;
  selectedCellId: Ref<string>;

  isString: (row: RowType, column: VDataColumn) => boolean;
  isNumber: (row: RowType, column: VDataColumn) => boolean;
  isDropdown: (row: RowType, column: VDataColumn) => boolean;
  isDate: (row: RowType, column: VDataColumn) => boolean;
  isBoolean: (row: RowType, column: VDataColumn) => boolean;
  isEditableBoolean: (row: RowType, column: VDataColumn) => boolean;
};

export type VDataGridDescriptor<RowType extends VDataRow> = {
  getCellForeground?: (row: RowType, column: VDataColumn) => string | undefined;
  getCellBackground?: (row: RowType, column: VDataColumn) => string | undefined;
  getCellComponent?: (row: RowType, column: VDataColumn) => VNode | Component;
  getCellEditor?: (
    row: RowType,
    column: VDataColumn
  ) => VCellEditor | undefined;
  getDataType?: (row: RowType, column: VDataColumn) => VDataType;
  getValueFormatter?: (row: RowType, column: VDataColumn) => Function;
  getHorizontalAlignment?: (
    row: RowType,
    column: VDataColumn
  ) => HorizontalAlignment | undefined;
  getIcon?: (
    row: RowType,
    column: VDataColumn
  ) => string | VNode | Component | undefined;
  getIconAlignment?: (
    row: RowType,
    column: VDataColumn
  ) => Position | undefined;
  getTooltip?: (row: RowType, column: VDataColumn) => string | undefined;
  isTextVisible?: (row: RowType, column: VDataColumn) => boolean;
};

export type VDataGridEmits<RowType> = {
  (
    event: "cellValueChanged",
    data: { row: RowType; column: VDataColumn; newValue: any }
  ): void;
  (event: "rowClick", row: RowType | undefined): void;
  (event: "rowDoubleClick", row: RowType | undefined): void;
  (event: "cellDoubleClick", data: { row: RowType; column: VDataColumn }): void;
  (
    event: "selectAll",
    data: { data: RowType[]; columnId: string; value: any }
  ): void;
};
