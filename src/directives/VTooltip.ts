import { type ComputedRef } from "vue";
type Tooltip = {
	text: ComputedRef<string | undefined> | string;
	arrowClasses?: string[];
	boxClasses?: string[];
};

type TooltipDirectiveType = {
	value: Tooltip;
	arg?: TooltipArg;
};

type TooltipArg = "top" | "right" | "bottom" | "left";

const SAFE_MARGIN = 8;

let tooltip: HTMLElement | null = null;

const tooltipStyle = [
	"absolute",
	"top-[var(--tooltip-top)]",
	"left-[var(--tooltip-left)]",
	"bottom-[var(--tooltip-bottom)]",
	"right-[var(--tooltip-right)]",
	"z-[999999]",
	"px-4",
	"py-2",
	"overlay-element",
	"w-max",
	"max-w-max",
	"text-center",
	"font-normal",
	"invisible",
	"v-tooltip",
];

const tooltipDirective = (app: any) => {
	app.directive("tooltip", {
		mounted(el: HTMLElement, { arg, value }: TooltipDirectiveType) {
			if (tooltip === null) {
				tooltip = document.createElement("div");
				tooltip.classList.add(...tooltipStyle);
			}

			el.addEventListener("mouseleave", hideTooltip);
			el.addEventListener("mouseenter", () => {
				if (typeof value.text === "string") {
					updateTooltipText(value.text);
					updateTooltipPosition(el, arg);
				} else if (value.text.value !== undefined) {
					updateTooltipText(value.text.value);
					updateTooltipPosition(el, arg);
				}
			});
		},
	});

	function updateTooltipText(newText: string) {
		if (tooltip !== null) tooltip.innerText = newText;
	}

	function hideTooltip() {
		if (tooltip !== null && tooltip.classList.contains("visible")) {
			tooltip.classList.replace("visible", "invisible");
			document.body.removeChild(tooltip);
		}
	}

	function updateTooltipPosition(
		el: HTMLElement,
		direction: TooltipArg | undefined
	) {
		if (tooltip === null) return;

		document.body.appendChild(tooltip);
		requestAnimationFrame(() => {
			if (tooltip === null) return;

			const tooltipData: DOMRect = tooltip.getBoundingClientRect();
			const element: DOMRect = el.getBoundingClientRect();

			const tooltipWidth = tooltipData.width;
			const tooltipHeight = tooltipData.height;

			// positions calculated to center the div vertically and horizontally
			const position = {
				left: (element.width - tooltipWidth) * 0.5,
				right: (element.width + tooltipWidth) * 0.5,
				top: (element.height - tooltipHeight) * 0.5,
				bottom: -(element.height - tooltipHeight) * 0.5,
			};

			// console.log("POSITION: ", position);

			const overflow = {
				left: element.left + position.left,
				right:
					position.right -
					(window.innerWidth - element.right) -
					element.width * 0.5,
			};

			// console.log("OVERFLOW: ", overflow);

			if (direction) {
				if (direction === "bottom") {
					tooltip.style.setProperty(
						"--tooltip-top",
						`${element.bottom + SAFE_MARGIN}px`
					);
				} else if (direction === "left") {
					tooltip.style.setProperty("--tooltip-top", `${position.top}px`);
					tooltip.style.setProperty(
						"--tooltip-right",
						`${element.right + SAFE_MARGIN}px`
					);
				} else if (direction === "top") {
					tooltip.style.setProperty(
						"--tooltip-top",
						`${element.top - tooltipHeight - SAFE_MARGIN}px`
					);
				} else if (direction === "right") {
					tooltip.style.setProperty(
						"--tooltip-top",
						`${element.top + position.top}px`
					);
					tooltip.style.setProperty(
						"--tooltip-left",
						`${element.right + SAFE_MARGIN}px`
					);
				}
			} else {
				tooltip.style.setProperty(
					"--tooltip-top",
					`${element.bottom + SAFE_MARGIN}px`
				);
				if (overflow.left < SAFE_MARGIN) {
					// console.log("overflowing left");
					// values have to be subtracted since they are both negative
					tooltip.style.setProperty(
						"--tooltip-left",
						`${element.left + position.left - overflow.left + SAFE_MARGIN}px`
					);
				} else {
					tooltip.style.setProperty(
						"--tooltip-left",
						`${element.left + position.left}px`
					);
				}
			}

			if (direction === "top" || direction === "bottom") {
				if (overflow.left < SAFE_MARGIN) {
					// console.log("overflowing left");
					// values have to be subtracted since they are both negative
					tooltip.style.setProperty(
						"--tooltip-left",
						`${element.left + position.left - overflow.left + SAFE_MARGIN}px`
					);
				} else {
					// console.log("NOT overflowing left");
					tooltip.style.setProperty(
						"--tooltip-left",
						`${element.left + position.left}px`
					);
				}
			}
			tooltip.classList.replace("invisible", "visible");
		});
	}
};

export default tooltipDirective;
