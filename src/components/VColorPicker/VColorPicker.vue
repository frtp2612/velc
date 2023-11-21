<template>
  <div class="p-8">
    <div class="w-[256px] aspect-square border border-color-border-100">
      <div
        class="w-8 h-8 border-color-border-200 border-2 rounded-full absolute top-[var(--y)] left-[var(--x)] translate-x-1/2 translate-y-1/2"
        ref="picker"
      ></div>
      <canvas width="255" height="255" ref="canvas" />
    </div>
    <div>
      <canvas width="12" height="256" ref="hueCanvas" />
    </div>
    <div>
      {{ color }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { VColorPickerState } from "./VColorPickerState";

const canvas = ref<HTMLCanvasElement>();
const hueCanvas = ref<HTMLCanvasElement>();
const picker = ref<HTMLCanvasElement>();
defineProps<{}>();

const state = VColorPickerState();
const { color } = state;

onMounted(() => {
  if (canvas.value && hueCanvas.value && picker.value) {
    state.init(canvas.value, hueCanvas.value, picker.value);
  }
});
</script>
