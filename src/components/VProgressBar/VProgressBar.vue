<template>
  <div class="flex flex-col items-center w-full">
    <div class="rounded-full overflow-hidden bg-color-bg-50 w-full h-2">
      <div
        class="w-[var(--preloaded-progress)] h-full rounded-full"
        ref="preloadProgress"
        v-if="displayPreload"
      ></div>
      <div
        class="w-[var(--progress)] h-full bg-color-primary rounded-full"
        :class="[progressClass]"
        ref="progressRef"
      ></div>
    </div>
    <VLabel v-if="!hideProgress">{{ progress }}%</VLabel>
  </div>
</template>

<script lang="ts" setup>
import { useVModel, clamp } from "@vueuse/core";
import VLabel from "@/components/VLabel/VLabel.vue";
import { ref, computed, watchEffect } from "vue";

const props = defineProps<{
  modelValue: number;
  displayPreload?: boolean;
  hideProgress?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "fullyLoaded"]);

const progressRef = ref<HTMLElement>();

const progress = useVModel(
  props,
  "modelValue",
  emit,
  props.modelValue
    ? {}
    : {
        passive: true,
      }
);

const progressClass = computed(() =>
  progressRef.value?.style.setProperty("--progress", `${progress.value}%`)
);

watchEffect(() => {
  progress.value = clamp(progress.value, 0, 100);
  if (progress.value === 100) {
    emit("fullyLoaded");
  }
});
</script>
