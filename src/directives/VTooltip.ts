import type { Directive } from "vue";

export enum TooltipDirection {
	TOP = "top",
	BOTTOM = "bottom",
	LEFT = "left",
	RIGHT = "right",
	ADAPTIVE = "adaptive",
}

type Tooltip = {
	text: string;
	arrowClasses?: string[];
	boxClasses?: string[];
};

type TooltipDirective = {
	value: Tooltip;
	arg: string;
};

type TooltipElements = {
	tooltipShell: HTMLElement;
	tooltipElement: HTMLElement;
	tooltipArrow: HTMLElement;
	tooltipContent: HTMLElement;
};

const tooltipDirective = (app: any) => {
	app.directive("tooltip", <Directive<HTMLElement, Tooltip>>{
		mounted(el: HTMLElement, { value, arg }: TooltipDirective) {
			init(el, value, arg);
		},
		unmounted(el: HTMLElement, { arg }: TooltipDirective) {
			const tooltipElements = getTooltipElements(el);

			el.removeEventListener("mouseenter", () =>
				tooltipElements ? showTooltip(tooltipElements, arg) : {}
			);
			el.removeEventListener("mouseleave", () =>
				tooltipElements ? hideTooltip(tooltipElements.tooltipElement) : {}
			);
		},
		updated(el: HTMLElement, { value }: TooltipDirective) {
			const tooltipElements = getTooltipElements(el);

			if (tooltipElements) {
				updateTooltip(tooltipElements.tooltipContent, value.text);
			}
		},
	});

	function getTooltipElements(el: HTMLElement): TooltipElements | undefined {
		let tooltipShell: HTMLElement | null = el.parentElement;
		let tooltipElement: HTMLElement | null = null;
		let tooltipArrow: HTMLElement | null = null;
		let tooltipContent: HTMLElement | null = null;

		if (tooltipShell !== null) {
			tooltipElement = tooltipShell.querySelector("[data-tooltip]");

			if (tooltipElement !== null) {
				tooltipArrow = tooltipElement.querySelector("[data-tooltip-arrow]");
				tooltipContent = tooltipElement.querySelector("[data-tooltip-content]");
			}
		}

		if (
			tooltipShell !== null &&
			tooltipArrow !== null &&
			tooltipElement !== null &&
			tooltipContent !== null
		) {
			return { tooltipShell, tooltipElement, tooltipArrow, tooltipContent };
		}
		return undefined;
	}

	function init(el: HTMLElement, properties: Tooltip, direction: string) {
		// create the tooltip
		const tooltipElements = createTooltip(el, properties, direction);

		el.addEventListener("mouseenter", () =>
			showTooltip(tooltipElements, direction)
		);

		el.addEventListener("mouseleave", () =>
			hideTooltip(tooltipElements.tooltipElement)
		);
	}

	function showTooltip(tooltipElements: TooltipElements, direction: string) {
		tooltipElements.tooltipElement.classList.remove("hidden");

		calculateTooltipPosition(
			tooltipElements.tooltipShell,
			tooltipElements.tooltipElement,
			tooltipElements.tooltipArrow,
			direction
		);
	}

	function hideTooltip(tooltipElement: HTMLElement) {
		tooltipElement.classList.add("hidden");
	}

	function updateTooltip(tooltipContent: HTMLElement, newText: string) {
		tooltipContent.innerHTML = newText;
	}

	function createTooltip(
		element: HTMLElement,
		properties: Tooltip,
		direction: string
	): TooltipElements {
		// outer shell of tooltip and actual component
		const tooltipShell = document.createElement("div");

		// effective tooltip
		const tooltipElement = document.createElement("div");
		tooltipElement.setAttribute("data-tooltip", "");

		// wrapper of the arrow and content divs
		const tooltipContentWrapper = document.createElement("div");

		// arrow to point the tooltip parent
		const tooltipArrow = document.createElement("div");
		tooltipArrow.setAttribute("data-tooltip-arrow", "");

		// content div that holds the actual content
		const tooltipContent = document.createElement("div");
		tooltipContent.setAttribute("data-tooltip-content", "");

		tooltipShell.classList.add("relative");
		tooltipElement.classList.add(
			"p-2",
			"absolute",
			"w-max",
			"z-[999]",
			"hidden"
		);
		const defaultContainerStyle = [
			"border",
			"border-slate-300",
			"bg-white",
			"px-2",
			"py-1",
			"rounded-lg",
			"shadow-slate-500/10",
			"shadow-md",
		];
		const containerClasses = properties.boxClasses
			? properties.boxClasses.concat(defaultContainerStyle)
			: defaultContainerStyle;
		tooltipContentWrapper.classList.add(...containerClasses);

		const defaultArrowStyle = ["w-3", "h-3", "bg-color-bg", "border-inherit"];

		const arrowClasses = properties.arrowClasses
			? properties.arrowClasses.concat(defaultArrowStyle)
			: defaultArrowStyle;
		tooltipArrow.classList.add(...arrowClasses, "absolute", "rotate-45");

		wrap(element, tooltipShell);

		tooltipContent.innerHTML = properties.text;

		tooltipContentWrapper.appendChild(tooltipArrow);
		tooltipContentWrapper.appendChild(tooltipContent);

		tooltipElement.appendChild(tooltipContentWrapper);

		tooltipShell.appendChild(tooltipElement);

		requestAnimationFrame(() => {
			calculateArrowMargins(tooltipArrow, direction);
			calculateTooltipPosition(
				tooltipShell,
				tooltipElement,
				tooltipArrow,
				direction
			);
		});

		return { tooltipShell, tooltipElement, tooltipArrow, tooltipContent };
	}

	const wrap = function (
		toWrap: HTMLElement,
		wrapper: HTMLElement | undefined = undefined
	) {
		wrapper = wrapper || document.createElement("div");
		toWrap.parentNode!.insertBefore(wrapper, toWrap);
		return wrapper.appendChild(toWrap);
	};

	function calculateArrowMargins(arrowElement: HTMLElement, direction: string) {
		switch (direction) {
			case TooltipDirection.TOP:
				arrowElement.classList.add(
					"top-full",
					"left-0",
					"border-r",
					"border-b",
					"border-l-transparent",
					"-translate-y-full",
					"-my-[2px]"
				);
				break;
			default:
				arrowElement.classList.add(
					"top-0",
					"left-0",
					"border-l",
					"border-t",
					"my-[2px]"
				);
				break;
		}
	}

	function calculateTooltipPosition(
		elementShell: HTMLElement,
		tooltipElement: HTMLElement,
		arrowElement: HTMLElement,
		direction: string
	) {
		switch (direction) {
			case TooltipDirection.TOP:
				tooltipElement.classList.add("bottom-full");
				break;
			default:
				tooltipElement.classList.add("top-full");
				break;
		}

		const elementRect = elementShell.getBoundingClientRect();
		const elementLeftOffset = elementShell.offsetLeft;
		const elementWidth = elementRect.width;

		// console.log("ELEMENT WIDTH ", elementWidth);

		const contentRect = tooltipElement.getBoundingClientRect();

		const contentWidth = contentRect.width;
		// console.log("content width: ", contentWidth);
		// const contentHeight = contentRect.height;

		let tooltipAdjustedPosition = (elementWidth - contentWidth) * 0.5;

		// check if overflowing on the right side
		if (
			elementLeftOffset + tooltipAdjustedPosition + contentWidth >
			window.innerWidth
		) {
			tooltipAdjustedPosition -=
				elementLeftOffset +
				tooltipAdjustedPosition +
				contentWidth -
				window.innerWidth;
		}

		// check if overflowing on the left side
		if (elementLeftOffset + tooltipAdjustedPosition < 0) {
			// console.log("content overflowing to the left");
			tooltipAdjustedPosition -= tooltipAdjustedPosition + elementLeftOffset;
		}

		// console.log(tooltipAdjustedPosition);
		calculateTooltipArrowPosition(
			arrowElement,
			elementWidth * 0.5,
			-tooltipAdjustedPosition
		);

		tooltipElement.style.left = tooltipAdjustedPosition + "px";
	}

	function calculateTooltipArrowPosition(
		arrowElement: HTMLElement,
		elementHalfWidth: number,
		leftOffset: number
	) {
		if (arrowElement) {
			arrowElement.style.left =
				leftOffset + elementHalfWidth - arrowElement.clientWidth * 0.5 + "px";
		}
	}
};

export default tooltipDirective;
