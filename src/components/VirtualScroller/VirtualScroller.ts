import { clamp } from "@vueuse/core";
import { ComputedRef, Ref, computed } from "vue";
import { useElementScroll } from "../../composables/UseElementScroll";

const VirtualScroll = ({
	container,
	items,
	itemHeight,
	renderAhead,
}: {
	container: Ref<HTMLElement | null>;
	items: ComputedRef<any[]>;
	itemHeight: number;
	renderAhead: number;
}) => {
	const itemCount = computed(() => items.value.length);

	const totalContentHeight = computed(() => itemCount.value * itemHeight);

	const { scrollTop, scrollTo } = useElementScroll(
		container,
		totalContentHeight
	);

	const startNode = computed(() =>
		Math.max(0, Math.floor(scrollTop.value / itemHeight) - renderAhead)
	);

	const visibleNodesCount = computed<number>(() => {
		const count = container.value
			? Math.ceil(container.value.clientHeight / itemHeight) + 2 * renderAhead
			: 0;
		return Math.min(itemCount.value - startNode.value, count);
	});

	const offsetY = computed(() => startNode.value * itemHeight);

	const visibleChildren = computed(() =>
		items.value.slice(
			startNode.value,
			startNode.value + visibleNodesCount.value
		)
	);

	const scrollToIndex = (nodeIndex: number) => {
		scrollTo({
			top: clamp(nodeIndex, 0, itemCount.value) * itemHeight,
			left: 0,
		});
	};

	return {
		list: visibleChildren,
		offsetY,
		totalContentHeight,
		currentIndex: startNode,
		scrollToIndex,
	};
};

export default VirtualScroll;
