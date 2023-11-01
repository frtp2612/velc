import { onMounted, onUnmounted, ref, Ref } from "vue";

// Generic hook for detecting resize:
export const useElementResizer = (
	target: Ref<HTMLElement | null>,
	resizeGutter: Ref<HTMLElement | null>,
	callBack: Function | undefined = undefined
) => {
	const width = ref(0);
	const updatedWidth = ref(0);

	const mouseX = ref(0);

	onUnmounted(() => {
		if (resizeGutter.value) {
			resizeGutter.value.removeEventListener("mousedown", resizeStart);
		}
	});

	onMounted(() => {
		// initialize width value to target width
		if (target.value) {
			width.value = target.value.getBoundingClientRect().width;
		}

		// add mouse down listener to gutter
		if (resizeGutter.value) {
			resizeGutter.value.addEventListener("mousedown", resizeStart);
		}
	});

	function resizeStart(event: MouseEvent) {
		if (target.value) {
			width.value = target.value.getBoundingClientRect().width;
		}

		const { clientX } = event;
		mouseX.value = clientX;

		document.addEventListener("mousemove", resizeUpdate);
		document.addEventListener("mouseup", resizeEnd);
	}

	function resizeUpdate(event: MouseEvent) {
		event.preventDefault();
		updatedWidth.value = width.value + event.clientX - mouseX.value;

		if (callBack) {
			callBack(updatedWidth.value);
		}
	}

	function resizeEnd() {
		document.removeEventListener("mousemove", resizeUpdate);
		document.removeEventListener("mouseup", resizeEnd);
	}

	return { updatedWidth };
};
