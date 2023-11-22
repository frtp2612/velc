<template>
  <VPopover class="relative" ref="popover">
    <template v-slot="{ events }">
      <slot :toggle="events.toggle"
        ><VButton :on-click="events.toggle" icon-left="fa-palette"
      /></slot>
    </template>
    <template #content>
      <div class="flex flex-col gap-4 w-min">
        <div class="flex gap-4 col-span-2">
          <div
            class="w-[256px] aspect-square border border-color-border-100 rounded-md overflow-hidden"
            id="picker"
          >
            <div
              class="m-[4px] w-8 h-8 bg-color-bg border-color-border-50 border-2 rounded-full absolute top-[var(--y)] left-[var(--x)] translate-x-1/2 translate-y-1/2"
              :style="{
                backgroundColor: color,
              }"
              ref="picker"
            ></div>
            <canvas width="255" height="255" ref="canvas" />
          </div>
          <div id="hue-picker" class="relative">
            <div
              class="w-6 h-6 bg-color-bg border-color-border-50 border-2 rounded-full absolute top-[var(--offset)] left-1/2 -translate-x-1/2 -translate-y-1/2"
              :style="{
                backgroundColor: hueColor,
              }"
              ref="huePicker"
            ></div>
            <canvas
              width="12"
              height="256"
              ref="hueCanvas"
              class="w-3 h-full border border-color-border-100 rounded-md overflow-hidden"
            />
          </div>
        </div>

        <div class="flex gap-4 col-span-2 items-center">
          <div
            class="w-8 h-8 bg-color-bg border-color-border-100 border rounded-md"
            :style="{
              backgroundColor: color,
            }"
          ></div>
        </div>
        <div class="flex gap-4 col-span-2 items-center">
          <VLabel class="text-lg font-semibold text-color-text-400">R</VLabel>
          <VNumericField
            id="r"
            :min="0"
            :max="255"
            v-model="colorBreakdown.r"
            @update:model-value="updateColorFromRGB"
          />
          <VLabel class="text-lg font-semibold text-color-text-400">G</VLabel>
          <VNumericField
            id="g"
            :min="0"
            :max="255"
            v-model="colorBreakdown.g"
            @update:model-value="updateColorFromRGB"
          />
          <VLabel class="text-lg font-semibold text-color-text-400">B</VLabel>
          <VNumericField
            id="b"
            :min="0"
            :max="255"
            v-model="colorBreakdown.b"
            @update:model-value="updateColorFromRGB"
          />
        </div>
      </div>
    </template>
  </VPopover>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/VButton.vue";
import VLabel from "@/components/VLabel/index";
import VNumericField from "@/components/VNumericField/VNumericField.vue";
import VPopover from "@/components/VPopover/index";
import { useVModel } from "@vueuse/core";
import { onMounted, ref, watchEffect } from "vue";
import { VColorPickerState } from "./VColorPickerState";

const canvas = ref<HTMLCanvasElement>();
const hueCanvas = ref<HTMLCanvasElement>();
const picker = ref<HTMLElement>();
const huePicker = ref<HTMLElement>();

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(
  props,
  "modelValue",
  emit,
  props.modelValue
    ? {}
    : {
        passive: true,
      }
);

const popover = ref<InstanceType<typeof VPopover> | null>(null);

const state = VColorPickerState(model.value);
const { color, hueColor, colorBreakdown, updateColorFromRGB } = state;

watchEffect(() => {
  model.value = color.value;
});

onMounted(() => {
  if (canvas.value && hueCanvas.value && picker.value && huePicker.value) {
    state.init(canvas.value, hueCanvas.value, picker.value, huePicker.value);
  }
});
</script>

<style>
.color-picker-grid {
  grid-template-areas: "picker hue-picker";
}

#picker {
  grid-area: "picker";
}

#hue-picker {
  grid-area: "hue-picker";
}
</style>
