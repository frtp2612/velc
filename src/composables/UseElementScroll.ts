import { onMounted, onUnmounted, ref, type Ref } from "vue";

// Generic hook for detecting scroll:
export const useElementScroll = (containerRef: Ref<HTMLElement | null>) => {
	const scrollTop = ref(0);

	const container = ref<HTMLElement | null>(null);

	const onScroll = (e: Event) => {
		scrollTop.value = (e.target as HTMLElement).scrollTop;
	};

	const scrollTo = (scrollValue: { top: number; left: number }) => {
		scrollTop.value = scrollValue.top;
		container.value!.scrollTop = scrollTop.value;
	};

	onUnmounted(() => {
		container.value?.removeEventListener("scroll", onScroll);
	});

	onMounted(() => {
		container.value = containerRef.value;

		container.value!.addEventListener("scroll", onScroll);
		scrollTop.value = container.value!.scrollTop;
	});

	return { scrollTop, container, scrollTo };
};
