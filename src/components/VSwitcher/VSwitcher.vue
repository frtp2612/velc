<template>
  <div
    class="rounded-lg bg-color-bg-50 flex justify-evenly relative border border-color-border-50"
    ref="switcherContainer"
  >
    <div
      class="bg-white rounded-lg h-full w-[var(--switcher-width)] absolute top-0 left-0 translate-x-[var(--switcher-offset)] transition-transform"
      ref="switcher"
    ></div>
    <div
      v-for="(value, index) in values"
      class="w-[var(--switcher-width)] z-10 font-semibold text-center px-4 py-1 cursor-pointer flex justify-center"
      :class="[
        selectedValue === index
          ? 'text-color-primary'
          : 'text-color-secondary-400 hover:text-color-primary',
      ]"
      @click="switchTo(index, value.callback)"
    >
      <VSwitcherItem
        :formatter="formatter"
        :label="value.label"
        :icon="value.icon"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useVModel } from "@vueuse/core";
import { VCallableItem } from "@/enums/index";
import VSwitcherItem from "./VSwitcherItem.vue";

const props = defineProps<{
  modelValue?: number;
  label?: string;
  values: VCallableItem[];
  formatter?: () => string;
}>();

const emit = defineEmits(["update:modelValue"]);

const switcher = ref<HTMLElement>();
const switcherContainer = ref<HTMLElement>();

const width = 100 / props.values.length;

const selectedValue = useVModel(
  props,
  "modelValue",
  emit,
  props.modelValue
    ? {}
    : {
        passive: true,
        defaultValue: 0,
      }
);

function switchTo(index: number, callback: Function) {
  switcherContainer.value?.style.setProperty(
    "--switcher-offset",
    index * 100 + "%"
  );
  selectedValue.value = index;
  callback();
}

onMounted(() => {
  switcherContainer.value?.style.setProperty("--switcher-width", width + "%");
});
</script>
