<template>
  <div :class="[dividerClass, color]"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    vertical?: boolean;
    width?: string | number;
    height?: string | number;
    color?: string;
  }>(),
  {
    vertical: false,
    height: "h-[1px]",
    color: "bg-color-bg-100",
  }
);

const dividerClass = computed(() => {
  let value = "w-full ";

  if (props.vertical) {
    value = "h-full ";
    if (props.width) {
      if (typeof props.width === "string") {
        value += props.width;
      } else if (typeof props.width === "number") {
        value += "w-[" + props.width + "px]";
      }
    }
  }

  if (props.height) {
    if (typeof props.height === "string") {
      value += props.height;
    } else if (typeof props.height === "number") {
      value += "h-[" + props.height + "px]";
    }

    return value;
  }

  return value + " h-[1px]";
});
</script>
