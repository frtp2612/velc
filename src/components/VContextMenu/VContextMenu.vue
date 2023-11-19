<template>
  <Teleport to="body" :disabled="!isOpen">
    <div
      class="absolute bg-color-bg rounded-lg border border-color-border-100 overflow-hidden min-w-[10rem]"
      :style="[
        {
          top: position.top,
          left: position.left,
        },
      ]"
      ref="contextMenu"
      v-show="isOpen"
    >
      <VContextMenuItem
        v-for="item in items"
        :formatter="formatter"
        :item="item"
        :callback="close"
        >item!</VContextMenuItem
      >
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { VInteractiveItem } from "@/enums/index";
import { useVModel, onClickOutside } from "@vueuse/core";
import { ref, watch, ComponentPublicInstance } from "vue";
import VContextMenuItem from "./VContextMenuItem.vue";

const props = defineProps<{
  items: VInteractiveItem[];
  formatter?: Function;
  modelValue?: boolean;
  attachTo: ComponentPublicInstance | null;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = useVModel(
  props,
  "modelValue",
  emit,
  props.modelValue
    ? {}
    : {
        passive: true,
        defaultValue: false,
      }
);

const contextMenu = ref<HTMLElement>();

const position = ref<{
  top: string;
  left: string;
}>({
  top: "0",
  left: "0",
});

onClickOutside(contextMenu, () => (isOpen.value = false));

function close() {
  isOpen.value = false;
}

watch(
  () => props.attachTo,
  (currentValue) => {
    if (currentValue !== null) {
      props.attachTo?.$el.addEventListener("contextmenu", appendTo);
    }
  }
);

function appendTo(e: MouseEvent) {
  e.preventDefault();

  if (contextMenu.value) {
    position.value.top = e.clientY + "px";
    position.value.left = e.clientX + "px";
  }
  isOpen.value = true;
}

// onUnmounted(() => {
//   props.attachTo?.$el.removeEventListener("contextmenu", appendTo);
// });
</script>
