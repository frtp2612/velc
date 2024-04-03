import { nextTick } from "vue";
import { PopAlignment } from "../enums/index";

export type AutoPopOptions = {
  align?: PopAlignment;
};

const SAFE_MARGIN = 8;

export const useAutoPopDirection = (
  popover: HTMLElement,
  target: HTMLElement,
  content?: HTMLElement,
  arrow?: HTMLElement,
  options?: AutoPopOptions
) => {
  function calculatePosition() {
    popover.style.setProperty("--left", `0px`);
    popover.style.setProperty("--top", `0px`);

    const popoverRect = popover.getBoundingClientRect();
    const popoverWidth = popoverRect.width;
    const popoverHeight = popoverRect.height;
    // console.log("popover RECT", popoverRect);

    const targetRect = target.getBoundingClientRect();
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;
    const targetLeft = targetRect.left;
    const targetRight = targetRect.right;
    const targetTop = targetRect.top;
    const targetBottom = targetRect.bottom;
    // console.log("TARGET RECT", targetRect);
    // let overflowX = 0;
    // let overflowY = 0;

    let centeredPosition = {
      left: targetLeft + (targetWidth - popoverWidth) * 0.5,
      top: targetTop + (targetHeight - popoverHeight) * 0.5,
    };

    // console.log("centered position", centeredPosition);

    if (options) {
      if (options.align && options.align === PopAlignment.LEFT) {
        centeredPosition.left = popoverRect.left;
      } else if (options.align && options.align === PopAlignment.RIGHT) {
        centeredPosition.left = popoverRect.right - targetWidth;
      }
    } else {
      centeredPosition.top = targetTop;
    }

    let finalPosition: {
      top: number;
      left: number;
    } = {
      top: 0,
      left: 0,
    };

    let overflow = {
      left: centeredPosition.left < SAFE_MARGIN,
      right:
        centeredPosition.left + popoverWidth > window.innerWidth - SAFE_MARGIN,
      top: centeredPosition.top < SAFE_MARGIN,
      bottom:
        centeredPosition.top + targetHeight + popoverHeight + SAFE_MARGIN >
        window.innerHeight - SAFE_MARGIN,
    };

    // console.log("Overflow", overflow);

    // centeredPosition.top += targetHeight + SAFE_MARGIN;

    if (overflow.left) {
      finalPosition.left = SAFE_MARGIN;
    } else if (overflow.right) {
      finalPosition.left = window.innerWidth - popoverWidth - SAFE_MARGIN;
    } else {
      finalPosition.left = centeredPosition.left;
    }

    if (overflow.top) {
      finalPosition.top = SAFE_MARGIN;
    } else if (overflow.bottom) {
      finalPosition.top = window.innerHeight - popoverHeight - SAFE_MARGIN;
    } else {
      finalPosition.top = targetHeight + SAFE_MARGIN + centeredPosition.top;
    }

    // console.log("finalPosition", finalPosition);

    popover.style.setProperty("--left", `${finalPosition.left}px`);
    popover.style.setProperty("--top", `${finalPosition.top}px`);

    if (arrow && content) {
      arrow.style.setProperty("--arrow-x", 0 + "px");
      arrow.style.setProperty("--arrow-y", 0 + "px");

      const contentRect = content.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();

      let arrowX = "";

      if (overflow.left || overflow.right) {
        arrowX =
          targetLeft +
          SAFE_MARGIN -
          finalPosition.left +
          arrowRect.width +
          "px";
      } else {
        arrowX = (popoverWidth - arrowRect.width) * 0.5 + "px";
      }

      arrow.style.setProperty("--arrow-x", arrowX + "");

      if (overflow.bottom) {
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

  nextTick(() => calculatePosition());

  return {};
};
