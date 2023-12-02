import { Ref, computed, onMounted, ref } from "vue";
import { VDynamicBentoGridRegionData } from "../../enums/index";
type GridBlock = {
	id: number;
	rowIndex: number;
	colIndex: number;
};

type GridRegion = {
	id: string;
	rowIndex: number;
	colIndex: number;
	rowSpan: number;
	colSpan: number;
	data: VDynamicBentoGridRegionData;
};

export function VDynamicBentoGridState(
	grid: Ref<HTMLElement | undefined>,
	rows: number,
	columns: number
) {
	let gridSize: DOMRect;

	const gridBlocks = ref<GridBlock[]>([]);
	const regions = ref<Map<string, GridRegion>>(new Map());
	const usedGridBlocks = ref<Set<string>>(new Set());

	const previewElementWidth = ref("");
	const previewElementPosition = ref({ x: 0, y: 0 });
	const previewElementHeight = ref("");
	const previewElementPath = ref("");
	const previewElementName = ref("");
	const dragging = ref(false);

	const activeGridBlock = ref<{ x: number; y: number }>();
	const activeRegionId = ref("");

	const gridRows = computed(() => `repeat(${rows}, 1fr)`);
	const gridColumns = computed(() => `repeat(${columns}, 1fr)`);
	const positionValid = ref(false);

	const draggedElement = ref();

	function initializeGrid() {
		for (let index = 0; index < rows * columns; index++) {
			gridBlocks.value.push({
				id: index,
				rowIndex: Math.floor(index / columns),
				colIndex: index % columns,
			});
		}
	}

	function addRegionContent(
		rowSpan: number,
		colSpan: number,
		data: VDynamicBentoGridRegionData
	) {
		if (activeGridBlock.value) {
			const region: GridRegion = {
				id: `${activeGridBlock.value.y}-${activeGridBlock.value.x}`,
				rowSpan,
				colSpan,
				rowIndex: activeGridBlock.value.y,
				colIndex: activeGridBlock.value.x,
				data,
			};
			console.log(region);

			regions.value.set(region.id, region);
		}
	}

	function onDragDetected() {
		if (!draggedElement.value && !dragging.value) {
			draggedElement.value = JSON.parse(sessionStorage.getItem("draggable")!);
			dragging.value = true;

			if (previewElementPath.value === "") {
				previewElementPath.value = draggedElement.value.componentPath;
			}

			if (previewElementName.value === "") {
				previewElementName.value = draggedElement.value.name;
			}
			gridSize = getGridSize();
		}
	}

	// function onDragOver(gridBlock: GridBlock) {
	// 	if (previewElementPath.value === "") {
	// 		previewElementPath.value = draggedElement.value.componentPath;
	// 	}

	// 	if (previewElementName.value === "") {
	// 		previewElementName.value = draggedElement.value.name;
	// 	}

	// 	previewElementWidth.value =
	// 		gridBlock.colIndex + 1 + " / span " + draggedElement.value.size.x;
	// 	previewElementHeight.value =
	// 		gridBlock.rowIndex + 1 + " / span " + draggedElement.value.size.y;

	// 	activeGridBlock.value = gridBlock;

	// 	positionValid.value =
	// 		gridBlock.colIndex + draggedElement.value.size.x <= columns &&
	// 		gridBlock.rowIndex + draggedElement.value.size.y <= rows &&
	// 		isBlockAvailable(
	// 			draggedElement.value.size.y,
	// 			draggedElement.value.size.x
	// 		);
	// }

	function onDragOver(event: DragEvent) {
		const x = Math.floor(
			(event.clientX - gridSize.x) / (gridSize.width / columns)
		);
		const y = Math.floor(
			(event.clientY - gridSize.y) / (gridSize.height / rows)
		);
		activeGridBlock.value = { x, y };
		previewElementPosition.value = {
			x: event.clientX - gridSize.x,
			y: event.clientY - gridSize.y,
		};
		if (
			x + draggedElement.value.size.x <= columns &&
			y + draggedElement.value.size.y <= rows &&
			isBlockAvailable(draggedElement.value.size.y, draggedElement.value.size.x)
		) {
			positionValid.value = true;
			previewElementWidth.value =
				x + 1 + " / span " + draggedElement.value.size.x;
			previewElementHeight.value =
				y + 1 + " / span " + draggedElement.value.size.y;
		} else {
			positionValid.value = false;
			previewElementWidth.value = x + 1 + "";
			previewElementHeight.value = y + 1 + "";
		}
	}

	function onDrop(event: DragEvent) {
		if (positionValid.value) {
			const data = JSON.parse(event.dataTransfer?.getData("text/plain")!);

			addRegionContent(data.size.y, data.size.x, data);
			updateUsedBlocks(data.size.y, data.size.x);
		}
		onDragEnd();
	}

	function updateUsedBlocks(rowSpan: number, colSpan: number) {
		if (activeGridBlock.value) {
			for (let rowIndex = 0; rowIndex < rowSpan; rowIndex++) {
				const effectiveRowIndex = (activeGridBlock.value.y + rowIndex) * rows;
				for (let colIndex = 0; colIndex < colSpan; colIndex++) {
					const effectiveColIndex = activeGridBlock.value.x + colIndex;
					usedGridBlocks.value.add(effectiveRowIndex + "-" + effectiveColIndex);
				}
			}
		}
	}

	function isBlockAvailable(rowSpan: number, colSpan: number) {
		if (activeGridBlock.value) {
			for (let rowIndex = 0; rowIndex < rowSpan; rowIndex++) {
				const effectiveRowIndex = (activeGridBlock.value.y + rowIndex) * rows;

				for (let colIndex = 0; colIndex < colSpan; colIndex++) {
					const effectiveColIndex = activeGridBlock.value.x + colIndex;

					if (
						usedGridBlocks.value.has(
							effectiveRowIndex + "-" + effectiveColIndex
						)
					) {
						return false;
					}
				}
			}
		}
		return true;
	}

	function onDragEnd() {
		activeGridBlock.value = undefined;
		dragging.value = false;
		draggedElement.value = undefined;
		previewElementWidth.value = "";
		previewElementHeight.value = "";
		previewElementPath.value = "";
		previewElementName.value = "";
	}

	function onDragLeave() {
		if (dragging.value) {
			console.log("drag left");

			onDragEnd();
		}
	}

	// function onMouseMove(event: MouseEvent) {
	// 	console.log([event.clientX, event.clientY]);

	// 	if (dragging.value) {
	// 		const intersectingElement = document.elementFromPoint(
	// 			event.clientX,
	// 			event.clientY
	// 		);
	// 		console.log(intersectingElement);
	// 	}
	// }

	onMounted(() => {
		gridSize = getGridSize();
	});

	function getGridSize(): DOMRect {
		return grid.value!.getBoundingClientRect();
	}

	initializeGrid();

	return {
		activeRegionId,
		activeGridBlock,

		gridRows,
		gridColumns,

		previewElementHeight,
		previewElementWidth,
		previewElementPosition,
		previewElementPath,
		previewElementName,
		dragging,
		positionValid,

		gridBlocks,
		regions,
		addRegionContent,
		onDragDetected,
		onDragOver,
		onDragLeave,
		onDrop,
		onDragEnd,
		// onMouseMove,
	};
}
