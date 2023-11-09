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
	sort: (key: string) => void;

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
};

export enum VButtonTypes {
	PRIMARY = "primary",
	SECONDARY = "secondary",
	TEXT = "text",
	SUCCESS = "success",
	DANGER = "danger",
}
