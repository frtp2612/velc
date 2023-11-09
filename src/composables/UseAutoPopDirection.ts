export enum PopAlignment {
	LEFT = "LEFT",
	RIGHT = "RIGHT",
}

export type AutoPopOptions = {
	align?: PopAlignment;
};

const SAFE_MARGIN = 8;

export const useAutoPopDirection = (
	container: HTMLElement,
	target: HTMLElement,
	arrow?: HTMLElement,
	options?: AutoPopOptions
) => {
	function calculatePosition() {
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;

		const targetRect = target.getBoundingClientRect();
		const targetWidth = targetRect.width;
		const targetHeight = targetRect.height;

		let overflowX = 0;
		// let overflowY = 0;

		let adjustedPositionX =
			containerRect.left + (containerWidth - targetWidth) * 0.5;
		let adjustedPositionY = containerRect.top + containerHeight;

		if (options) {
			if (options.align && options.align === PopAlignment.LEFT) {
				adjustedPositionX = containerRect.left;
			} else if (options.align && options.align === PopAlignment.RIGHT) {
				adjustedPositionX = containerRect.right - targetWidth;
			}
		}

		// check if overflowing on the right side
		const overflowsLeft = containerRect.left + adjustedPositionX <= SAFE_MARGIN;

		const overflowsRight =
			adjustedPositionX + targetWidth > window.innerWidth - SAFE_MARGIN;
		const overflowsTop = containerRect.top + adjustedPositionY <= SAFE_MARGIN;
		const overflowsBottom =
			adjustedPositionY + targetHeight > window.innerHeight - SAFE_MARGIN;

		if (overflowsRight) {
			overflowX = containerRect.right + adjustedPositionX;
			adjustedPositionX =
				window.innerWidth -
				targetWidth +
				(containerRect.right - window.innerWidth);
		} else if (overflowsLeft) {
			overflowX = adjustedPositionX - containerRect.left;
			adjustedPositionX = containerRect.left;
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
			arrow.style.left = overflowX + targetWidth * 0.5 + "px";

			if (overflowsBottom) {
				arrow.classList.replace("border-t", "border-b");
				arrow.classList.replace("border-l", "border-r");
				arrow.classList.replace("-top-0.5", "-bottom-0.5");
			} else {
				arrow.classList.replace("border-b", "border-t");
				arrow.classList.replace("border-r", "border-l");
				arrow.classList.replace("-bottom-0.5", "-top-0.5");
			}
		}
	}

	calculatePosition();

	return {};
};
