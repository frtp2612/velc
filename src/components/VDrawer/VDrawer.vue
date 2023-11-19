<template>
  <div
    class="h-screen fixed top-0 w-96 p-4 overflow-auto bg-white border-color-border-50 transition-transform"
    :class="drawerClass"
    ref="drawer"
  >
    <div class="flex justify-between gap-4">
      <slot name="title"
        ><VLabel v-if="title">{{ title }}</VLabel></slot
      >
      <VButton icon-left="fa-xmark" class="ml-auto" :on-click="close"></VButton>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { onClickOutside, useVModel } from "@vueuse/core";
import { HorizontalDirections } from "../../enums/index";
import VButton from "../VButton/index";
import VLabel from "@/components/VLabel/VLabel.vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    direction?: HorizontalDirections;
    modelValue: boolean;
  }>(),
  {
    direction: HorizontalDirections.RIGHT,
  }
);

const drawer = ref<HTMLElement | null>(null);

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

onClickOutside(drawer, close);

function close() {
  isOpen.value = false;
}

const drawerClass = computed(() => {
  let finalClass = "";
  switch (props.direction) {
    case HorizontalDirections.RIGHT:
      finalClass += "right-0 border-l ";
      finalClass += isOpen.value ? "" : "translate-x-full";
      break;
    default:
      finalClass += "left-0 border-r ";
      finalClass += isOpen.value ? "" : "-translate-x-full";
      break;
  }
  return finalClass;
});
</script>
