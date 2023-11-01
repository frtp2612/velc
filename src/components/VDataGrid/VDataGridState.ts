import {
	CalculatedElementSize,
	VDataColumn,
	VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import { clamp } from "@vueuse/core";
import { Ref, computed, nextTick, ref } from "vue";
import { useSorter } from "../../composables/UseSorter";

type DataGridColumnData = {
	id: string;
	el: HTMLElement;
	size: CalculatedElementSize;
	offset?: number;
};

function VDataGridState(
	rows: Ref<VDataRow[]>,
	columns: VDataColumn[],
	defaultSortKey: string | undefined,
	defaultSortDirection: string | undefined
) {
	const tableContainerRef = ref<HTMLElement>();
	const columnsContainerRef = ref<HTMLElement>();
	const columnsDataList = ref<DataGridColumnData[]>([]);
	const lockedColumnsMap = ref<Map<string, number>>(new Map<string, number>());
	const initialized = ref(false);

	const activeRow = ref<VDataRow>();
	const activeColumn = ref<VDataColumn>();

	const editMode = ref(false);

	const tableWidth = computed(
		() => tableContainerRef.value?.getBoundingClientRect().width || 0
	);
	const tableHeight = computed(
		() => tableContainerRef.value?.getBoundingClientRect().height || 0
	);

	const columnsLayout = computed(() =>
		columnsDataList.value
			.map((column: DataGridColumnData) =>
				column.size.current === -1
					? `minmax(${column.size.min}px, 1fr)`
					: `${column.size.current!}px`
			)
			.join(" ")
	);

	const { sortedData, sort, sortKey, sortOrder } = useSorter<VDataRow>(
		rows,
		defaultSortKey,
		defaultSortDirection
	);

	function init(tableContainer: HTMLElement, columnsContainer: HTMLElement) {
		tableContainerRef.value = tableContainer;
		columnsContainerRef.value = columnsContainer;

		initializeColumnsData();

		nextTick(() => {
			refreshColumnsData();
			initialized.value = true;
		});
	}

	function initializeColumnsData() {
		Array.from(columnsContainerRef.value!.children).forEach(
			(column: Element, index: number) => {
				const columnProps: VDataColumn = columns[index];

				const columnData: DataGridColumnData = {
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
								: tableWidth.value,
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

				if (columnProps.locked) {
					lockedColumnsMap.value.set(columnProps.id, 0);
					columnData.offset = 0;
				}

				columnsDataList.value.push(columnData);
			}
		);
	}

	function refreshColumnsData() {
		columnsDataList.value.forEach(
			(columnData: DataGridColumnData, index: number) => {
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
					lockedColumnsMap.value.set(columnData.id, columnData.offset);
				}
			}
		);
	}

	function updateColumnSize(columnId: string, width: number) {
		const columnDataIndex: number = columnsDataList.value.findIndex(
			(column: DataGridColumnData) => column.id === columnId
		);

		if (columnDataIndex !== -1) {
			const columnData: DataGridColumnData =
				columnsDataList.value[columnDataIndex];

			columnData.size.current = clamp(
				width,
				columnData.size.min!,
				columnData.size.max!
			);

			const nextColumnData: DataGridColumnData =
				columnsDataList.value[columnDataIndex + 1];
			if (nextColumnData.offset) {
				nextColumnData.offset = columnData.offset! + columnData.size.current!;
				lockedColumnsMap.value.set(nextColumnData.id, nextColumnData.offset);
			}
		}
	}

	return {
		// methods
		init,
		updateColumnSize,

		sort,

		// computed properties
		columnsLayout,

		data: sortedData,
		sortKey,
		sortOrder,

		initialized,
		tableHeight,
		lockedColumnsMap,

		columns,
	};
}

export default VDataGridState;
