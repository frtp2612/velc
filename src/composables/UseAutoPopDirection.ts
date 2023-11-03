// Generic hook for detecting resize:
export const useAutoPopDirection = (
	container: HTMLElement,
	target: HTMLElement
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
			adjustedPositionX = window.innerWidth - targetWidth;
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
	}

	calculatePosition();

	return {};
};
