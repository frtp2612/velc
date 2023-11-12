<template>
  <Teleport to="body" :disabled="!isOpen">
    <div
      class="fixed top-0 left-0 z-[9999] w-full h-full flex items-center justify-center bg-color-bg-900/10"
      v-if="isOpen"
    >
      <div
        class="border border-color-border-100 bg-color-bg rounded-lg flex flex-col"
        :style="windowSize"
        ref="window"
      >
        <section
          v-if="title || $slots.header"
          class="border-b border-color-border p-4 flex items-center gap-4"
        >
          <slot name="header">
            <VLabel class="text-xl font-semibold">
              {{ title }}
            </VLabel>
          </slot>
          <VButton
            icon-left="fa-xmark"
            :on-click="close"
            class="ml-auto rounded-md interactive-text interactive-bg"
          />
        </section>

        <section class="p-4 h-full flex flex-col gap-4">
          <slot><component :is="rawComponent" v-if="contentComponent" /></slot>

          <slot name="footer"></slot>
        </section>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
// import { onClickOutside } from "@vueuse/core";
import { markRaw, ref, computed } from "vue";
import VLabel from "@/components/VLabel/index";
import VButton from "@/components/VButton/index";

const props = defineProps<{
  contentComponent?: Object;
  title?: string;
  width?: number | string;
  height?: number | string;
}>();

const window = ref<HTMLElement | null>(null);
const isOpen = ref(false);

// onClickOutside(window, () => (isOpen.value = false));

defineExpose<{
  open: () => void;
}>({ open });

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

const windowSize = computed(() => {
  let finalStyle = "";
  if (props.width) {
    finalStyle +=
      "width: " + (typeof props.width === "string" ? props.width : `${props.width}px`);
  }
  finalStyle += "; ";
  if (props.height) {
    finalStyle +=
      "height:" + (typeof props.height === "string" ? props.height : `${props.height}px`);
  }
  finalStyle += "; ";
  return finalStyle;
});

const rawComponent = props.contentComponent ? markRaw(props.contentComponent) : undefined;
</script>
