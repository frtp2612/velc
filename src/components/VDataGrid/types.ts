import { VDataType } from "@/enums";
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
};

export type VDataColumnDescriptor = {
  isLocked?: boolean;
  isFilterable?: boolean;
  size?: BaseElementSize;
};

type VCellEditor =
  | VBooleanCellEditor
  | VStringCellEditor
  | VDropdownCellEditor
  | VNumberCellEditor;

type VBooleanCellEditor = {
  type: VDataType.BOOLEAN;
};

type VStringCellEditor = {
  type: VDataType.STRING;
};

type VNumberCellEditor = {
  type: VDataType.NUMBER;
  min?: number;
  max?: number;
};

type VDropdownCellEditor = {
  type: VDataType.SELECT;
  values: () => any[];
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

  getCellForeground?: (row: RowType, column: VDataColumn) => string;
  getCellBackground?: (row: RowType, column: VDataColumn) => string;
  getCellComponent?: (row: RowType, column: VDataColumn) => VNode | Component;
  getCellEditor?: (row: RowType, column: VDataColumn) => VCellEditor;
  getValueFormatter?: (value: any) => string;
  getDataType?: (row: RowType, column: VDataColumn) => VDataType;

  layout: ComputedRef<string>;

  data: Ref<RowType[]>;
  descriptor: VDataGridDescriptor<RowType>;
  initialized: Ref<boolean>;
  height: Ref<number>;
  columns: Ref<VDataColumn[]>;
  columnsDataList: Ref<VDataColumnState[]>;

  isString: (row: RowType, column: VDataColumn) => boolean;
  isNumber: (row: RowType, column: VDataColumn) => boolean;
  isDropdown: (row: RowType, column: VDataColumn) => boolean;
  isDate: (row: RowType, column: VDataColumn) => boolean;
  isBoolean: (row: RowType, column: VDataColumn) => boolean;
  isEditableBoolean: (row: RowType, column: VDataColumn) => boolean;
};

export type VDataGridDescriptor<RowType extends VDataRow> = {
  getCellForeground?: (row: RowType, column: VDataColumn) => string;
  getCellBackground?: (row: RowType, column: VDataColumn) => string;
  getCellComponent?: (row: RowType, column: VDataColumn) => VNode | Component;
  getCellEditor?: (row: RowType, column: VDataColumn) => VCellEditor;
  getDataType: (row: RowType, column: VDataColumn) => VDataType;
  getValueFormatter: (row: RowType, column: VDataColumn) => Function;
};
