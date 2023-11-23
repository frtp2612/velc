import { clamp } from "@vueuse/core";
import {
	computed,
	onMounted,
	ref,
	watch,
	type ComputedRef,
	type Ref,
} from "vue";
import { useElementScroll } from "../../composables/UseElementScroll";

export default function useVirtualList(
	items: ComputedRef<any[]>,
	itemHeight: number,
	containerRef: Ref<HTMLElement | null>,
	renderAhead: number
) {
	const container = ref<HTMLElement | null>(null);

	const { scrollTop, scrollTo } = useElementScroll(containerRef);

	const itemCount = computed(() => items.value.length);

	const totalHeight = computed(() => itemCount.value * itemHeight);

	const startIndex = computed(() => {
		return Math.max(0, Math.floor(scrollTop.value / itemHeight) - renderAhead);
	});

	const visibleItemsCount = computed<number>(() => {
		const count = container.value
			? Math.ceil(container.value.clientHeight / itemHeight) + 2 * renderAhead
			: 0;
		// console.log("UPDATED VISIBLE ITEMS COUNT IN: ", [id, startIndex.value]);

		return Math.min(itemCount.value - startIndex.value, count);
	});

	const offsetY = computed(() => startIndex.value * itemHeight);

	const visibleItems = computed(() =>
		items.value.slice(
			startIndex.value,
			startIndex.value + visibleItemsCount.value
		)
	);

	const scrollToIndex = (nodeIndex: number) => {
		scrollTo({
			top: clamp(nodeIndex, 0, itemCount.value) * itemHeight,
			left: 0,
		});
	};

	watch(
		() => items.value.length,
		() => {
			if (container.value && scrollTop.value > container.value.clientHeight) {
				// console.log("SCROLLING TO NEW VALUE IN LIST: ", id);
				// console.log(totalHeight.value);

				scrollTo({
					top: Math.min(totalHeight.value, scrollTop.value),
					left: container.value?.scrollLeft || 0,
				});
			}
		}
	);

	onMounted(() => {
		container.value = containerRef.value;
	});

	return {
		totalHeight,
		offsetY,
		visibleItems,
		startIndex,
		scrollTo,
		scrollToIndex,
	};
}
