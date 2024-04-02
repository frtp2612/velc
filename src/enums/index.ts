import { VDataColumn, VDataRow } from "@/components/VDataGrid/types";
import { Translatable } from "@/types";
import type {
  ComponentOptionsMixin,
  ComputedRef,
  DefineComponent,
  ExtractPropTypes,
  Ref,
  VNode,
} from "vue";

export enum TranslationType {
  RAW,
  EXPLICIT,
  KEY_LOOKUP,
}

export enum VDataType {
  STRING,
  NUMBER,
  BOOLEAN,
  EDITABLE_BOOLEAN,
  DATE,
  SELECT,
  OBJECT,
}

export enum VButtonTypes {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
  SUCCESS = "success",
  ERROR = "error",
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

export type VCallableItem = {
  callback: () => void;
  label: Translatable;
  icon?: string;
  enabling?: (...args: any[]) => boolean;
};

export type VInteractiveItem = {
  callback: () => void;
  children?: VInteractiveItem[];
  label: Translatable;
  icon?: string;
  enabling?: (...args: any[]) => boolean;
  addSeparator?: boolean;
};

export type VNavItem = {
  children?: VNavItem[];
  label: Translatable;
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

export enum PopAlignment {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export type VStep = {
  title: string;
  component: Object;
  completionCondition?: () => boolean;
  enablingCondition?: () => boolean;
  visibilityCondition?: () => boolean;
};

export enum HorizontalAlignment {
  LEFT,
  CENTER,
  RIGHT,
}

export enum Position {
  LEFT,
  RIGHT,
}
