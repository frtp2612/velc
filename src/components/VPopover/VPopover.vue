<template>
  <div ref="popover" class="inline-block">
    <slot :events="{ toggle, open, close }" :attributes="{ isOpen }"
      ><p @mouseenter="open" @mouseleave="close">Popover</p></slot
    >
    <Teleport to="body" :disabled="!isOpen">
      <div v-show="isOpen" ref="container" class="absolute p-1 z-[10000]">
        <div
          class="w-3 h-3 absolute -top-0.5 bg-color-bg rotate-45 border-t border-l border-color-border-100 -mx-1.5 z-30"
          ref="arrow"
        ></div>
        <div
          class="z-20 p-4 shadow-md shadow-color-bg-100 bg-color-bg border border-color-border-100 rounded-lg w-max max-w-max text-center"
          ref="content"
        >
          <slot name="content"><span>Default popover content</span></slot>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { useAutoPopDirection } from "@/composables/UseAutoPopDirection";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";

const isOpen = ref(false);

const popover = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const arrow = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);

onClickOutside(
  container,
  () => {
    isOpen.value = false;
  },
  {
    ignore: [popover],
  }
);

function open() {
  isOpen.value = true;
  if (
    popover.value !== null &&
    container.value !== null &&
    arrow.value !== null
  ) {
    requestAnimationFrame(() =>
      useAutoPopDirection(popover.value!, container.value!, arrow.value!)
    );
  }
}

function close() {
  isOpen.value = false;
}

function toggle() {
  if (isOpen.value) {
    close();
  } else {
    open();
  }
}

defineExpose({ open, close });
// TODO to improve customization, pass arrow styles as props
</script>
