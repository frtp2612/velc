<template>
  <div
    class="cursor-pointer flex items-center justify-center"
    @click="model = !model"
  >
    <div
      class="focus:ring-0 focus:ring-offset-0 outline-none border border-color-border-50 hover:border-color-border-100 focus:border-color-primary bg-color-bg hover:bg-color-bg-50 rounded-md !p-0 !h-[1.25rem] !w-[1.25rem] flex items-center justify-center aspect-square"
      :class="[
        model === true
          ? '!bg-color-primary !text-color-text-50 !focus:bg-color-primary !focus:text-color-text-50'
          : 'text-color-text',
      ]"
      tabindex="0"
    >
      <font-awesome-icon
        icon="fa-check"
        class="aspect-square w-2.5"
        v-show="model"
      />
    </div>
    <!-- <input
      type="checkbox"
      v-model="model"
      :id="id"
      class="w-full h-full opacity-0 cursor-pointer"
    /> -->
  </div>
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { onMounted, ref } from "vue";

const props = defineProps<{
  id: string;
  modelValue?: any;
  customClass?: string;
  autoFocus?: boolean;
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
        defaultValue: false,
      }
);

const input = ref<HTMLElement | null>(null);

onMounted(() => {
  if (props.autoFocus && input.value) {
    input.value.focus();
  }
});
</script>
