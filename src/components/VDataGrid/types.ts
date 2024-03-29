import { VDataType } from "@/enums";
import { BaseElementSize, CalculatedElementSize, Translatable } from "@/types";
import { ComputedRef, Ref, VNode } from "vue";

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

export type VDataColumn<RowType> = {
  id: string;
  size?: BaseElementSize;
  valueFormatter?: (value: any) => string;
  label: Translatable;
  locked?: boolean;
  dataType?: VDataType;
  editable?: boolean;
  editor?: {
    type: VDataType;
    values?: any[];
  };
  filterable?: boolean;
  cell?: (row: RowType) => string | VNode;
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

  layout: ComputedRef<string>;

  data: Ref<RowType[]>;
  initialized: Ref<boolean>;
  height: Ref<number>;
  columns: Ref<VDataColumn<RowType>[]>;
  columnsDataList: Ref<VDataColumnState[]>;
};
