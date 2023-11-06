import {
	ComputedRef,
	Ref,
	onMounted,
	onUnmounted,
	ref,
	watchEffect,
} from "vue";

// Generic hook for detecting scroll:
export const useElementScroll = (
	container: Ref<HTMLElement | null>,
	containerScrollHeight: ComputedRef<number> | undefined = undefined
) => {
	const scrollTop = ref(0);

	let scrollContainer = container.value;

	const onScroll = (e: Event) =>
		requestAnimationFrame(() => {
			scrollTop.value = (e.target as HTMLElement).scrollTop;
			// console.log("SCROLL TOP REQUESTED: ", scrollTop.value);
		});

	const scrollTo = (scrollValue: { top: number; left: number }) => {
		scrollTop.value = scrollValue.top;
		if (scrollContainer) {
			scrollContainer.scrollTop = scrollTop.value;
		}
	};

	onUnmounted(() => {
		if (scrollContainer) {
			scrollContainer.removeEventListener("scroll", onScroll);
		}
	});

	onMounted(() => {
		if (container.value) {
			scrollContainer = container.value;
			scrollContainer.addEventListener("scroll", onScroll);
			scrollTop.value = scrollContainer.scrollTop;
		}
	});

	watchEffect(() => {
		if (container.value && containerScrollHeight) {
			container.value.scrollTop = Math.min(
				containerScrollHeight.value,
				container.value.scrollTop
			);
			scrollTop.value = container.value.scrollTop;
		}
	});

	return { scrollTop, container, scrollTo };
};
