<template>
  <div class="flex flex-col gap-2">
    <div v-if="maxChars > 0" class="flex">
      <span class="text-xs bg-color-bg-50 rounded p-1 ml-auto">
        {{ characters }}
      </span>
    </div>
    <textarea
      :id="id"
      :class="[elementClass]"
      v-model="model"
      :maxlength="maxChars > 0 ? maxChars : 50000"
      ref="input"
    />
  </div>
</template>

<script lang="ts" setup>
import { inputBaseClass } from "@/constants/index";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

const props = withDefaults(
  defineProps<{
    id: string;
    modelValue?: string;
    customClass?: string;
    autoFocus?: boolean;
    maxChars?: number;
    formatter?: Function;
    resizable?: boolean;
  }>(),
  {
    maxChars: 0,
  }
);

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

const input = ref<HTMLElement | null>(null);

const elementClass = computed(() => {
  let finalClass = props.resizable ? "resize-y " : "resize-none ";
  finalClass += props.customClass ? props.customClass : inputBaseClass;

  return finalClass;
});

const characters = computed(() => {
  if (props.formatter) {
    return props.formatter(model.value);
  }
  return `${model.value!.length}/${props.maxChars}`;
});

onMounted(() => {
  if (props.autoFocus && input.value) {
    input.value.focus();
  }
});
</script>
