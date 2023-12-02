import { clamp } from "@vueuse/core";
import { computed, onMounted, ref, type Ref } from "vue";

type SplitViewData = PanelData | GutterData;

enum SplitViewDataType {
	PANEL,
	GUTTER,
}

type PanelData = {
	type: SplitViewDataType.PANEL;
	ref: HTMLElement;
	size: {
		min: number;
		current: number;
	};
};

type GutterData = { type: SplitViewDataType.GUTTER };

export function VSplitViewState(
	containerRef: Ref<HTMLElement | null>,
	slots: Readonly<any>,
	vertical: boolean = false
) {
	const panels = ref<SplitViewData[]>([]);

	const clickPositionStart = ref({
		x: 0,
		y: 0,
	});

	const activePanelBefore = ref<PanelData>();
	const activePanelAfter = ref<PanelData>();

	const activePanelBeforeInitialSize = ref(0);
	const activePanelAfterInitialSize = ref(0);

	const activePanelPairTotalSize = ref(0);

	const activeGutter = ref<HTMLElement>();

	onMounted(() => {
		const slotData: any[] = slots.default();
		if (slotData) {
			let totalRemainingSize = 100;

			const minSizeList: number[] = [];
			const initialSizeList: number[] = [];

			let panelsWithoutInitialSize: number[] = [];

			// calculate all initial sizes
			const initialSizeListTemp = slotData
				.filter((slot: any) => typeof slot.type === "object")
				.map((slot, index: number) => {
					let initial = -1;
					if (slot.props !== null) {
						initial = slot.props["initialSize"] || -1;
						if (initial === -1) {
							panelsWithoutInitialSize.push(index);
						} else {
							totalRemainingSize -= initial;
						}
					} else {
						panelsWithoutInitialSize.push(index);
					}
					return initial;
				});

			// calculate equal distribution of width among all panels that do not have an initial size
			let remainingTotalSizeDistribution =
				totalRemainingSize / panelsWithoutInitialSize.length;

			// calculate min and real initial size using the distribution if the min value is lower than the distribution, or the min if greater.
			// use the initial size for the panels that have declared one
			slotData.forEach((slot, index: number) => {
				let min = 10;
				let initial = initialSizeListTemp[index];

				if (slot.props !== null) {
					min = slot.props["minSize"] || 10;
					if (initial === -1) {
						if (min > remainingTotalSizeDistribution) {
							remainingTotalSizeDistribution -=
								min - remainingTotalSizeDistribution;
						}
						initial = Math.max(remainingTotalSizeDistribution, min);
					}
				} else {
					initial = Math.max(remainingTotalSizeDistribution, min);
				}

				minSizeList.push(min);
				initialSizeList.push(initial);
			});

			initializePanels(minSizeList, initialSizeList);
		}
	});

	function initializePanels(minSizeList: number[], initialSizeList: number[]) {
		const splitPanelsList = containerRef.value!.children;

		const splitPanels: HTMLElement[] = Array.from(splitPanelsList).map(
			(element: Element) => element as HTMLElement
		);

		splitPanels.forEach((panel: HTMLElement, index: number) => {
			if (index > 0) {
				panels.value.push({ type: SplitViewDataType.GUTTER });
				const gutter = document.createElement("div");

				gutter.classList.add(
					"before:absolute",
					"before:bg-color-bg-50",
					"before:hover:bg-color-primary",
					"before:cursor-pointer",
					"before:duration-150",
					"before:hover:z-10",
					vertical ? "h-0" : "w-0",
					vertical ? "w-full" : "h-full",
					vertical ? "before:h-1" : "before:w-1",
					vertical ? "before:w-full" : "before:h-full",
					vertical ? "before:hover:h-2" : "before:hover:w-2",
					vertical ? "before:-translate-y-1/2" : "before:-translate-x-1/2"
				);

				gutter.addEventListener("mousedown", (event: MouseEvent) =>
					onMouseDown(event, index * 2 - 2, index * 2)
				);

				containerRef.value?.insertBefore(gutter, panel);
			}

			let panelData = {
				type: SplitViewDataType.PANEL,
				ref: panel,
				size: {
					min: minSizeList[index],
					current: initialSizeList[index],
				},
			};

			panels.value.push(panelData);
		});
	}

	function onMouseDown(
		event: MouseEvent,
		indexPanelBefore: number,
		indexPanelAfter: number
	) {
		activeGutter.value = event.target as HTMLElement;
		activeGutter.value.classList.replace(
			"before:bg-color-bg-50",
			"before:bg-color-primary"
		);

		clickPositionStart.value.x = event.pageX;
		clickPositionStart.value.y = event.pageY;

		activePanelBefore.value = panels.value[indexPanelBefore] as PanelData;
		activePanelAfter.value = panels.value[indexPanelAfter] as PanelData;
		activePanelBeforeInitialSize.value = activePanelBefore.value.size.current;
		activePanelAfterInitialSize.value = activePanelAfter.value.size.current;

		activePanelPairTotalSize.value =
			activePanelBefore.value.size.current +
			activePanelAfter.value.size.current;

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	}

	function onMouseMove(event: MouseEvent) {
		const newPositionX = event.pageX;
		const newPositionY = event.pageY;

		const moveByX =
			((newPositionX - clickPositionStart.value.x) /
				activePanelsPairWidth.value) *
			activePanelPairTotalSize.value;
		const moveByY =
			((newPositionY - clickPositionStart.value.y) /
				activePanelsPairHeight.value) *
			activePanelPairTotalSize.value;

		const moveBy = vertical ? moveByY : moveByX;

		if (activePanelBefore.value && activePanelAfter.value) {
			activePanelBefore.value.size.current = clamp(
				activePanelBeforeInitialSize.value + moveBy,
				activePanelBefore.value.size.min,
				activePanelPairTotalSize.value - activePanelAfter.value.size.min
			);

			activePanelAfter.value.size.current =
				activePanelPairTotalSize.value - activePanelBefore.value.size.current;
		}

		document.addEventListener("mousemove", onMouseMove);
	}

	function onMouseUp() {
		activeGutter.value?.classList.replace(
			"before:bg-color-primary",
			"before:bg-color-bg-50"
		);
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	}

	const activePanelsPairWidth = computed(() =>
		activePanelBefore.value && activePanelAfter.value
			? activePanelBefore.value.ref.clientWidth +
			  activePanelAfter.value.ref.clientWidth
			: 0
	);

	const activePanelsPairHeight = computed(() =>
		activePanelBefore.value && activePanelAfter.value
			? activePanelBefore.value.ref.clientHeight +
			  activePanelAfter.value.ref.clientHeight
			: 0
	);

	const splitViewStyle = computed(() =>
		panels.value
			.map((value: SplitViewData) =>
				value.type === SplitViewDataType.GUTTER ? "0" : value.size.current + "%"
			)
			.join(" ")
	);

	return {
		splitViewStyle,
	};
}
