import type { Directive } from "vue";
import { useAutoPopDirection } from "../composables/UseAutoPopDirection";

type Tooltip = {
	text: string;
	arrowClasses?: string[];
	boxClasses?: string[];
};

type TooltipDirectiveType = {
	value: Tooltip;
};

const tooltipDirective = (app: any) => {
	app.directive("tooltip", <Directive<HTMLElement, Tooltip>>{
		mounted(el: HTMLElement, { value }: TooltipDirectiveType) {
			init(el, value);
		},
		unmounted(el: HTMLElement) {
			const tooltipElement = getTooltipElement(el);

			if (tooltipElement !== null) {
				el.removeEventListener("mouseenter", () =>
					showTooltip(el, tooltipElement)
				);
				el.removeEventListener("mouseleave", () =>
					hideTooltip(el, tooltipElement)
				);

				hideTooltip(el, tooltipElement);
			}
		},
		updated(el: HTMLElement, { value }: TooltipDirectiveType) {
			const tooltipContent = getTooltipElement(el);

			if (tooltipContent !== null) {
				updateTooltip(tooltipContent, value.text);
			}
		},
	});

	function getTooltipElement(el: HTMLElement): HTMLElement | null {
		const tooltipElement = el.querySelector("[data-tooltip]");
		if (tooltipElement) {
			return tooltipElement.querySelector("[data-tooltip-content]");
		}
		return null;
	}

	function init(el: HTMLElement, properties: Tooltip) {
		// create the tooltip
		const tooltipElement = createTooltip(el, properties);
		el.classList.remove("relative");

		el.addEventListener("mouseenter", () => showTooltip(el, tooltipElement));

		el.addEventListener("mouseleave", () => hideTooltip(el, tooltipElement));
	}

	function showTooltip(target: HTMLElement, tooltipElement: HTMLElement) {
		// target.appendChild(tooltipElement);
		tooltipElement.classList.remove("hidden");

		const tooltipArrow: HTMLElement | null = tooltipElement.querySelector(
			"[data-tooltip-arrow]"
		);
		useAutoPopDirection(
			target,
			tooltipElement,
			tooltipArrow !== null ? tooltipArrow : undefined
		);
	}

	function hideTooltip(_el: HTMLElement, tooltipElement: HTMLElement) {
		tooltipElement.classList.add("hidden");
		// el.removeChild(tooltipElement);
	}

	function updateTooltip(tooltipContent: HTMLElement, newText: string) {
		tooltipContent.innerHTML = newText;
	}

	function createTooltip(el: HTMLElement, properties: Tooltip): HTMLElement {
		// effective tooltip
		const tooltipElement = document.createElement("div");
		el.setAttribute("data-tooltip", properties.text);

		// arrow to point the tooltip target
		const tooltipArrow = document.createElement("div");
		tooltipArrow.setAttribute("data-tooltip-arrow", "");

		// content div that holds the actual content
		const tooltipContent = document.createElement("div");
		tooltipContent.setAttribute("data-tooltip-content", "");

		const tooltipStyle = [
			"absolute",
			"p-1",
			"z-[999]",
			"after:content-[data-tooltip]",
			"after:absolute",
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
		];
		tooltipElement.classList.add(...tooltipStyle);

		const defaultArrowStyle = [
			"w-3",
			"h-3",
			"bg-color-bg",
			"border-color-border-100",
			"-top-0.5",
			"bg-color-bg",
			"-mx-1.5",
			"z-30",
			"border-t",
			"border-l",
		];

		const arrowClasses = properties.arrowClasses
			? properties.arrowClasses.concat(defaultArrowStyle)
			: defaultArrowStyle;
		tooltipArrow.classList.add(...arrowClasses, "absolute", "rotate-45");

		const defaultContentStyle = [
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
		];
		tooltipContent.classList.add(...defaultContentStyle);
		tooltipContent.innerHTML = properties.text;

		tooltipElement.appendChild(tooltipArrow);
		tooltipElement.appendChild(tooltipContent);

		return tooltipElement;
	}
};

export default tooltipDirective;
