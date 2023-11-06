// Generic hook for detecting resize:
export const useAutoPopDirection = (
	container: HTMLElement,
	target: HTMLElement,
	arrow?: HTMLElement
) => {
	function calculatePosition() {
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;

		const targetRect = target.getBoundingClientRect();
		const targetWidth = targetRect.width;
		const targetHeight = targetRect.height;

		let adjustedPositionX =
			containerRect.left + (containerWidth - targetWidth) * 0.5;
		let adjustedPositionY = containerRect.top + containerHeight;

		// check if overflowing on the right side

		const overflowsLeft = containerRect.left + adjustedPositionX < 0;
		const overflowsRight = adjustedPositionX + targetWidth > window.innerWidth;
		const overflowsTop = containerRect.top < 0;
		const overflowsBottom =
			adjustedPositionY + targetHeight > window.innerHeight;

		if (overflowsRight) {
			adjustedPositionX =
				window.innerWidth -
				targetWidth +
				(containerRect.right - window.innerWidth);
		} else if (overflowsLeft) {
			adjustedPositionX =
				window.innerWidth - (targetWidth + containerRect.right);
		}

		if (overflowsTop) {
			adjustedPositionY =
				window.innerHeight - (targetHeight + containerRect.bottom);
		} else if (overflowsBottom) {
			adjustedPositionY = containerRect.top - targetHeight;
		}

		target.style.left = adjustedPositionX + "px";
		target.style.top = adjustedPositionY + "px";

		if (arrow) {
			arrow.style.left = containerRect.left + containerWidth * 0.5 + "px";

			if (overflowsBottom) {
				arrow.classList.replace("border-t", "border-b");
				arrow.classList.replace("border-l", "border-r");
				arrow.classList.replace("mt-0", "-mt-1.5");
				target.classList.replace("mt-1.5", "mb-1.5");
				arrow.style.top = containerRect.top + "px";
			} else {
				arrow.classList.replace("border-b", "border-t");
				arrow.classList.replace("border-r", "border-l");
				arrow.classList.replace("-mt-1.5", "mt-0");
				target.classList.replace("mb-1.5", "mt-1.5");
				arrow.style.top = containerRect.top + containerHeight + "px";
			}
		}
	}

	calculatePosition();

	return {};
};
