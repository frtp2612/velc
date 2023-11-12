import { ComputedRef, Ref } from "vue";

export type VDataRow = {
  id: number;
  [key: string]: any;
};

export type VDataColumn = {
  id: string;
  size?: BaseElementSize;
  valueFormatter?: (value: any) => string;
  label: {
    type: TranslationType;
    value: RawTranslationValue | ExplicitTranslationValue | KeyTranslationValue;
  };
  locked?: boolean;
  dataType?: VDataType;
  hasSelectAll?: boolean;
  selectAllEnabling?: (...args: any[]) => boolean;
  editable?: boolean;
  editor?: {
    type: VDataType;
    values?: any[];
  };
  filterable?: boolean;
};

export type ExperimentalVDataColumn<T extends string | boolean> = {
  id: string;
  size?: BaseElementSize;
  valueFormatter?: (value: any) => string;
  label: {
    type: TranslationType;
    value: RawTranslationValue | ExplicitTranslationValue | KeyTranslationValue;
  };
  locked?: boolean;
  dataType?: VDataType;
  hasSelectAll?: boolean;
  selectAllEnabling?: (...args: any[]) => boolean;
  editable?: boolean;
  editor?: {
    type: VDataType;
    values?: any[];
  };
  filterable?: boolean;
  options: VDataColumnOptions<T>;
};

export type VDataColumnOptions<T extends string | boolean> = T extends boolean
  ? VDataColumnEditableBooleanOptions
  : VDataColumnStringOptions;
export type VDataColumnStringOptions = {};

export type VDataColumnEditableBooleanOptions = {
  hasSelectAll?: boolean;
  selectAllEnabling?: (...args: any[]) => boolean;
};

export enum TranslationType {
  RAW,
  EXPLICIT,
  KEY_LOOKUP,
}

export type RawTranslationValue = string;

export type KeyTranslationValue = {
  key: string;
  params?: Array<any>;
};

export type ExplicitTranslationValue = {
  nameEn: string;
  nameDe: string;
};

export type ElementSize = {
  min?: number;
  max?: number;
};

export type BaseElementSize = ElementSize & {
  initial?: number;
};

export type CalculatedElementSize = ElementSize & {
  current?: number;
};

export enum VDataType {
  STRING,
  NUMBER,
  BOOLEAN,
  EDITABLE_BOOLEAN,
  DATE,
  SELECT,
}

export type VDataGridStateType = {
  init: (tableContainer: HTMLElement, columnsContainer: HTMLElement) => void;
  updateColumnSize: (columnId: string, width: number) => void;
  sort: (key: string) => void;

  changeSelectedCell: (
    rowId: string | number,
    columnId: string,
    cellId: string
  ) => void;
  onCellEditEnd: () => void;

  columnsLayout: ComputedRef<string>;
  selectAllMap: Ref<Map<string, Ref<boolean>>>;

  data: VDataRow[];
  initialized: Ref<boolean>;
  tableHeight: ComputedRef<number>;
  lockedColumnsMap: Ref<Map<string, number>>;
  columns: VDataColumn[];
  sortKey: Ref<string>;
  sortOrder: Ref<string>;

  filters: Ref<Map<string, any>>;
  setFilter: (filterKey: string, filterValue: any) => void;

  selectedRowId: Ref<number>;
  selectedColumnId: Ref<string>;
  selectedCellId: Ref<string>;

  editMode: Ref<boolean>;
  isDirty: ComputedRef<boolean>;

  toggleAllValues: (newValue: boolean, columnId: string) => void;
};

export type VDataGridEmits = {
  (
    event: "cellValueChanged",
    data: { row: VDataRow; column: VDataColumn; newValue: any }
  ): void;
  (event: "rowDoubleClick", row: VDataRow): void;
  (
    event: "cellDoubleClick",
    data: { row: VDataRow; column: VDataColumn }
  ): void;
  (
    event: "selectAllValueChanged",
    data: { newValue: boolean; columnId: string }
  ): void;
};

export enum VButtonTypes {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
  SUCCESS = "success",
  DANGER = "danger",
}

export type VTreeNodeType = {
  id: string;
  children?: VTreeNodeType[];
};

export type VInteractiveItem = {
  callback: () => void;
  children?: VInteractiveItem[];
  label: {
    type: TranslationType;
    value: RawTranslationValue | ExplicitTranslationValue | KeyTranslationValue;
  };
  icon?: string;
  enabling?: (...args: any[]) => boolean;
  addSeparator?: boolean;
};

export type VNavItem = {
  children?: VNavItem[];
  label: {
    type: TranslationType;
    value: RawTranslationValue | ExplicitTranslationValue | KeyTranslationValue;
  };
  icon?: string;
  to?: string;
};
