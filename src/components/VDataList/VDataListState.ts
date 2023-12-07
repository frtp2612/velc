import { useFilter } from "@/composables/UseFilter";
import { useSorter } from "@/composables/UseSorter";
import {
	VColumnData,
	VDataColumn,
	VDataListEmits,
	VDataRow,
} from "@/enums/index";
import { clamp, useElementSize } from "@vueuse/core";
import { computed, ref, type Ref } from "vue";

export function VDataListState(
	rows: Ref<VDataRow[]>,
	columns: Ref<VDataColumn[]>,
	defaultSortKey: string | undefined,
	defaultSortDirection: string | undefined,
	emit: VDataListEmits
) {
	const listContainerRef = ref<HTMLElement>();
	const columnsContainerRef = ref<HTMLElement>();
	// const contentContainerRef = ref<HTMLElement>();
	const columnsDataList = ref<VColumnData[]>([]);
	const initialized = ref(false);

	const selectedRowsMap = ref<Map<number, boolean>>(new Map());

	rows.value.forEach((row: VDataRow) =>
		selectedRowsMap.value.set(row.id, false)
	);

	const selectAllSelected = computed(() =>
		data.value.every(
			(row: VDataRow) => selectedRowsMap.value.get(row.id) === true
		)
	);

	const selectedRowId = ref<number>(0);
	const selectedColumnId = ref<string>("");
	const selectedCellId = ref<string>("");

	const activeCell = ref<HTMLElement>();

	const editMode = ref(false);

	const reactiveRows = ref(rows);

	const { width, height } = useElementSize(listContainerRef);

	const { data, filters, setFilter, resetFilter } =
		useFilter<VDataRow>(reactiveRows);

	function updateRows(updatedRows: VDataRow[]) {
		reactiveRows.value = updatedRows;
	}

	const { sort, sortKey, sortOrder, applySort } = useSorter<VDataRow>(
		defaultSortKey,
		defaultSortDirection
	);

	const columnsLayout = computed(
		() =>
			"56px " +
			columnsDataList.value
				.map((column: VColumnData) =>
					column.size.current === -1
						? `minmax(${column.size.min}px, 1fr)`
						: `${column.size.current!}px`
				)
				.join(" ")
	);

	function onRowSelectionChanged(rowId: number, value: boolean) {
		selectedRowsMap.value.set(rowId, value);
	}

	function onSelectAllSelectionChanged(value: boolean) {
		data.value.forEach((row: VDataRow) =>
			selectedRowsMap.value.set(row.id, value)
		);
	}

	function init(listContainer: HTMLElement, columnsContainer: HTMLElement) {
		listContainerRef.value = listContainer;
		columnsContainerRef.value = columnsContainer;
		// contentContainerRef.value = contentContainer;

		requestAnimationFrame(() => {
			initializeColumnsData();
			refreshColumnsData();
			initialized.value = true;
		});
	}

	function initializeColumnsData() {
		if (!columnsContainerRef.value) return;
		console.log(columns.value);

		Array.from(columnsContainerRef.value.children).forEach(
			(column: Element, index: number) => {
				if (index > 0) {
					const columnProps: VDataColumn = columns.value[index - 1];

					const columnData: VColumnData = {
						id: columnProps.id,
						el: column as HTMLElement,
						size: {
							current:
								columnProps.size && columnProps.size.initial
									? columnProps.size.initial
									: -1,
							max:
								columnProps.size && columnProps.size.max
									? columnProps.size.max
									: width.value,
							min:
								columnProps.size && columnProps.size.min
									? columnProps.size.min
									: 30,
						},
					};

					if (columnData.size.current! !== -1) {
						columnData.size.current = clamp(
							columnData.size.current!,
							columnData.size.min!,
							columnData.size.max!
						);
					}

					columnsDataList.value.push(columnData);
				}
			}
		);
	}

	function refreshColumnsData() {
		columnsDataList.value.forEach((columnData: VColumnData) => {
			if (columnData.size.current! === -1) {
				columnData.size.current = columnData.el.getBoundingClientRect().width;
			}

			columnData.size.current = clamp(
				columnData.size.current!,
				columnData.size.min!,
				columnData.size.max!
			);
		});
	}

	function updateColumnSize(columnId: string, width: number) {
		const columnDataIndex: number = columnsDataList.value.findIndex(
			(column: VColumnData) => column.id === columnId
		);

		if (columnDataIndex !== -1) {
			const columnData: VColumnData = columnsDataList.value[columnDataIndex];

			columnData.size.current = clamp(
				width,
				columnData.size.min!,
				columnData.size.max!
			);
		}
	}

	function changeSelectedCell(rowId: number, columnId: string) {
		const cellId = `${rowId}-${columnId}`;

		if (editMode.value) {
			editMode.value = false;
			onCellEditEnd();
		}

		selectedRowId.value = rowId;
		selectedColumnId.value = columnId;
		selectedCellId.value = cellId;

		const match = listContainerRef.value?.querySelector(`.cell-${cellId}`);
		if (match) {
			(match as HTMLElement).focus();
			activeCell.value = match as HTMLElement;
		}

		emit("rowClick", getSelectedRow());
	}

	function cellFocused() {
		return (
			getSelectedCell() !== null && getSelectedCell() === document.activeElement
		);
	}

	function getSelectedCell() {
		return listContainerRef.value?.querySelector(
			`.cell-${selectedRowId.value}-${selectedColumnId.value}`
		);
	}

	function getSelectedRow() {
		return data.value.find((row: VDataRow) => row.id === selectedRowId.value);
	}

	function getRowIndex() {
		return data.value.findIndex(
			(row: VDataRow) => row.id === selectedRowId.value
		);
	}

	function getColumnIndex() {
		return columns.value.findIndex(
			(column: VDataColumn) => column.id === selectedColumnId.value
		);
	}

	function onCellEditEnd() {
		const column: VDataColumn = columns.value[getColumnIndex()];

		if (column && column.editable) {
			const row: VDataRow | undefined = rows.value.find(
				(row: VDataRow) => row.id === selectedRowId.value
			);
			if (row) {
				const newValue = row[column.id];

				emit("cellValueChanged", {
					row,
					column,
					newValue,
				});
			}
		}
	}

	function resetSelection() {
		changeSelectedCell(-1, "");
	}

	function toggleEdit() {
		editMode.value = !editMode.value;
	}

	return {
		initialized,

		data: computed(() => applySort(data)),
		columns,

		selectAllSelected,
		selectedRowsMap,

		listHeight: height,

		columnsLayout,

		sortKey,
		sortOrder,

		filters,

		selectedRowId,
		selectedColumnId,
		selectedCellId,

		editMode,

		init,

		sort,

		setFilter,
		resetFilter,

		updateRows,
		toggleEdit,
		resetSelection,

		cellFocused,
		getRowIndex,

		updateColumnSize,

		onRowSelectionChanged,
		onSelectAllSelectionChanged,

		changeSelectedCell,
	};
}
