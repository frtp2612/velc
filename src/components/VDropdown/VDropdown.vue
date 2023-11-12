<template>
  <div class="relative inline-block max-w-full">
    <div ref="dropdown" @click="toggle">
      <slot>
        <VButton icon-right="fa-angle-down" :type="VButtonTypes.PRIMARY">
          <VLabel class="text-color-text">{{ label }}</VLabel>
        </VButton>
      </slot>
    </div>

    <Teleport :to="appendTo" :disabled="!appendTo">
      <div
        class="absolute z-50 left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 min-w-[16rem] w-max max-w-max bg-color-bg overflow-auto"
        v-show="open"
        ref="dropdownPopup"
      >
        <VDropdownItem
          v-for="item in values"
          :item="item"
          :formatter="formatter"
        />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { useAutoPopDirection } from "@/composables/UseAutoPopDirection";
import { VButtonTypes } from "@/enums/index";
import { onClickOutside } from "@vueuse/core";
import { RendererElement, ref } from "vue";
import { PopAlignment } from "@/composables/UseAutoPopDirection";
import { VInteractiveItem } from "@/enums/index";
import VDropdownItem from "./VDropdownItem.vue";

const props = withDefaults(
  defineProps<{
    values: VInteractiveItem[];
    label?: string;
    formatter?: Function;
    appendTo?: string | RendererElement;
    align?: PopAlignment;
  }>(),
  {
    appendTo: "body",
  }
);

const emit = defineEmits(["update:modelValue"]);

const open = ref(false);
const dropdown = ref(null);
const dropdownPopup = ref<HTMLElement | null>(null);

onClickOutside(
  dropdownPopup,
  () => {
    open.value = false;
  },
  {
    ignore: [dropdown],
  }
);

function toggle() {
  open.value = !open.value;

  if (open.value) {
    requestAnimationFrame(() => {
      if (dropdownPopup.value && dropdown.value && props.appendTo) {
        useAutoPopDirection(dropdown.value, dropdownPopup.value, undefined, {
          align: props.align,
        });
      }
    });
  }
}
</script>
