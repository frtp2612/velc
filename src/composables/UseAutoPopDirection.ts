import { PopAlignment } from "../enums/index";

export type AutoPopOptions = {
	align?: PopAlignment;
};

const SAFE_MARGIN = 8;

export const useAutoPopDirection = (
	container: HTMLElement,
	target: HTMLElement,
	content?: HTMLElement,
	arrow?: HTMLElement,
	options?: AutoPopOptions
) => {
	function calculatePosition() {
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;
		// console.log("CONTAINER RECT", containerRect);

		const targetRect = target.getBoundingClientRect();
		const targetWidth = targetRect.width;
		const targetHeight = targetRect.height;
		// console.log("TARGET RECT", targetRect);
		// let overflowX = 0;
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
			// overflowX = containerRect.right + adjustedPositionX;
			// console.log(overflowX);

			adjustedPositionX = window.innerWidth - targetWidth - SAFE_MARGIN;
			// console.log(adjustedPositionX);
		} else if (overflowsLeft) {
			// overflowX = adjustedPositionX - containerRect.left;
			adjustedPositionX = containerRect.left;
		}

		if (overflowsTop) {
			adjustedPositionY =
				window.innerHeight - (targetHeight + containerRect.bottom);
		} else if (overflowsBottom) {
			adjustedPositionY = containerRect.top - targetHeight;
		}

		// console.log("ADJUSTED POSITION", adjustedPositionX);

		target.style.left = adjustedPositionX + "px";
		target.style.top = adjustedPositionY + "px";

		if (arrow && content) {
			const contentRect = content.getBoundingClientRect();

			const arrowRect = arrow.getBoundingClientRect();
			let arrowX = "";

			if (overflowsLeft || overflowsRight) {
				arrowX =
					containerRect.left - adjustedPositionX + arrowRect.width + "px";
			} else {
				arrowX = (targetWidth - arrowRect.width) * 0.5 + "px";
			}

			arrow.style.setProperty("--arrow-x", arrowX + "");

			if (overflowsBottom) {
				arrow.style.setProperty("--arrow-y", contentRect.height + "px");

				if (arrow.classList.contains("arrow-top")) {
					arrow.classList.replace("arrow-top", "arrow-bottom");
				} else {
					arrow.classList.add("arrow-bottom");
				}
			} else {
				arrow.style.setProperty("--arrow-y", "1px");
				if (arrow.classList.contains("arrow-bottom")) {
					arrow.classList.replace("arrow-bottom", "arrow-top");
				} else {
					arrow.classList.add("arrow-top");
				}
			}
		}
	}

	requestAnimationFrame(() => calculatePosition());

	return {};
};
