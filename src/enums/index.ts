import {
  ComputedRef,
  Ref,
  DefineComponent,
  ComponentOptionsMixin,
  ExtractPropTypes,
} from "vue";

export type VDataRow = {
  id: number;
  options?: VDataRowOptions;
  [key: string]: any;
};

export type VDataRowOptions = {
  lighten?: boolean;
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
  editable?: boolean;
  editor?: {
    type: VDataType;
    values?: any[];
  };
  filterable?: boolean;
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
  sort: (key: string, formatter: Function | undefined) => void;

  changeSelectedCell: (
    rowId: string | number,
    columnId: string,
    cellId: string
  ) => void;
  onCellEditEnd: () => void;

  columnsLayout: ComputedRef<string>;

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
};

export type VDataGridEmits = {
  (
    event: "cellValueChanged",
    data: { row: VDataRow; column: VDataColumn; newValue: any }
  ): void;
  (event: "rowClick", row: VDataRow | undefined): void;
  (event: "rowDoubleClick", row: VDataRow | undefined): void;
  (
    event: "cellDoubleClick",
    data: { row: VDataRow; column: VDataColumn }
  ): void;
};

export enum VButtonTypes {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
  SUCCESS = "success",
  DANGER = "danger",
}

export enum VMediaPlayerTypes {
  MP4 = "video/mp4",
  WEBM = "video/webm",
}

export type VMediaPlayerResource = {
  link: string;
  type: VMediaPlayerTypes | string;
};

export type VTreeNodeType = {
  [key: string]: any;
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

export type Widget = {
  widget: DefineComponent<
    {},
    {},
    {},
    {},
    {},
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    {},
    string,
    any,
    Readonly<ExtractPropTypes<{}>>,
    {},
    {}
  >;
  name: string;
  size: {
    x: number;
    y: number;
  };
};

export type VDynamicBentoGridRegionData = {
  componentPath: string;
  [key: string]: any;
};

export enum ExportTypes {
  XLS,
  XML,
  PDF,
  HTML,
}

export enum HorizontalDirections {
  LEFT,
  RIGHT,
}

export enum MessageType {
  NORMAL,
  ALERT,
  ERROR,
  SUCCESS,
  INFO,
}

export enum UploadStatus {
  NONE,
  LOADING,
  SUCCESS,
  ERROR,
}
