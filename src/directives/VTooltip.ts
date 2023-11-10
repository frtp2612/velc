type Tooltip = {
	text: string;
	arrowClasses?: string[];
	boxClasses?: string[];
};

type TooltipDirectiveType = {
	value: Tooltip;
	arg?: TooltipArg;
};

type TooltipArg = "top" | "right" | "bottom" | "left";

const SAFE_MARGIN = 8;

const tooltipDirective = (app: any) => {
	app.directive("tooltip", {
		mounted(el: HTMLElement, { value, arg }: TooltipDirectiveType) {
			updateTooltip(el, value.text);
			init(el);
			updateTooltipPosition(el, arg);
		},
		updated(el: HTMLElement, { value, arg }: TooltipDirectiveType) {
			updateTooltip(el, value.text);

			if (!el.classList.contains("after:invisible")) {
				init(el);
			}

			updateTooltipPosition(el, arg);
		},
	});

	function init(el: HTMLElement) {
		// create the tooltip
		if (!el.classList.contains("relative")) {
			el.classList.add("relative");
		}

		createTooltip(el);
	}

	function updateTooltip(el: HTMLElement, newText: string) {
		el.setAttribute("data-tooltip", newText);
	}

	function createTooltip(el: HTMLElement) {
		// effective tooltip
		const tooltipStyle = [
			"after:content-[attr(data-tooltip)]",
			"after:absolute",
			"after:top-[var(--tooltip-top)]",
			"after:left-[var(--tooltip-left)]",
			"after:bottom-[var(--tooltip-bottom)]",
			"after:right-[var(--tooltip-right)]",
			"after:z-[999]",
			"after:px-2",
			"after:py-1",
			"after:shadow-md",
			"after:shadow-color-bg-100",
			"after:bg-color-bg",
			"after:border",
			"after:border-color-border-100",
			"after:rounded-lg",
			"after:w-max",
			"after:max-w-max",
			"after:text-center",
			"after:font-normal",
			"after:text-color-text",
			"hover:after:visible",
			"after:invisible",
		];
		el.classList.add(...tooltipStyle);

		// el.classList.add("after:hidden");
		// const defaultArrowStyle = [
		// 	"w-3",
		// 	"h-3",
		// 	"bg-color-bg",
		// 	"border-color-border-100",
		// 	"-top-0.5",
		// 	"bg-color-bg",
		// 	"-mx-1.5",
		// 	"z-30",
		// 	"border-t",
		// 	"border-l",
		// ];
		// tooltipArrow.classList.add(...defaultArrowStyle, "absolute", "rotate-45");
	}

	function updateTooltipPosition(
		el: HTMLElement,
		direction: TooltipArg | undefined
	) {
		const tooltipData: CSSStyleDeclaration = window.getComputedStyle(
			el,
			":after"
		);
		const element = el.getBoundingClientRect();

		const tooltipWidth = parseInt(tooltipData.width.replace("px", ""));
		const tooltipHeight = parseInt(tooltipData.height.replace("px", ""));

		// positions calculated to center the div vertically and horizontally
		const position = {
			left: (element.width - tooltipWidth) * 0.5,
			right: (element.width + tooltipWidth) * 0.5,
			top: (element.height - tooltipHeight) * 0.5,
			bottom: -(element.height - tooltipHeight) * 0.5,
		};
		// console.log(position);

		const overflow = {
			left: position.left - element.left + element.width * 0.5,
			right:
				position.right -
				(window.innerWidth - element.right) -
				element.width * 0.5,
		};
		// console.log(overflow);

		if (direction) {
			if (direction === "bottom") {
				el.style.setProperty(
					"--tooltip-top",
					`${element.height + SAFE_MARGIN}px`
				);
			} else if (direction === "left") {
				el.style.setProperty("--tooltip-top", `${position.top}px`);
				el.style.setProperty(
					"--tooltip-right",
					`${element.width + SAFE_MARGIN}px`
				);
			} else if (direction === "top") {
				el.style.setProperty(
					"--tooltip-bottom",
					`${element.height + SAFE_MARGIN}px`
				);
			} else if (direction === "right") {
				el.style.setProperty("--tooltip-top", `${position.top}px`);
				el.style.setProperty(
					"--tooltip-left",
					`${element.width + SAFE_MARGIN}px`
				);
			}
		} else {
			el.style.setProperty(
				"--tooltip-top",
				`${element.height + SAFE_MARGIN}px`
			);
			el.style.setProperty("--tooltip-left", `0px`);
		}

		if (direction === "top" || direction === "bottom") {
			if (overflow.left < SAFE_MARGIN) {
				// console.log("overflowing left");
				// values have to be subtracted since they are both negative
				el.style.setProperty(
					"--tooltip-left",
					`${position.left - overflow.left + SAFE_MARGIN}px`
				);
			} else {
				// console.log("NOT overflowing left");
				el.style.setProperty("--tooltip-left", `${position.left}px`);
			}
		}
	}
};

export default tooltipDirective;
