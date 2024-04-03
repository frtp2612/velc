<template>
  <div class="relative inline-block max-w-full">
    <div ref="dropdown" class="h-full flex items-center" @click="openPopover">
      <slot :selection="formattedSelectedItem">
        <component :is="rawComponent" v-if="rawComponent" />
        <VTextField :id="id" class="w-full cursor-pointer group" v-else>
          <div
            :data-value="filter"
            class="inline-grid grid-cols-[0,_1fr] overlap-grid-after w-full disabled:disabled-input input-base !pr-9 after:content-[attr(data-value)] after:hidden after:whitespace-pre-wrap"
          >
            <input
              v-model="filter"
              class="min-w-[2px] outline-0 overlap-grid overflow-hidden"
              :id="id"
              autocomplete="off"
              :disabled="disabled"
              :placeholder="placeholder"
              @keyup.prevent.up="updateSelectedItemIndex(-1)"
              @keyup.prevent.down="updateSelectedItemIndex(1)"
              @keydown.prevent.space="selectItemAtIndex"
              @keydown.prevent.enter="selectItemAtIndex"
              @keydown="openPopoverIfClosed"
              ref="input"
            />
            <VLabel
              v-if="filter.length === 0"
              class="w-full grow overlap-grid overflow-hidden text-ellipsis text-nowrap"
            >
              {{ formattedSelectedItem }}
            </VLabel>
          </div>

          <template #right>
            <div class="flex absolute top-1/2 -translate-y-1/2 right-1">
              <font-awesome-icon
                icon="fa-xmark"
                class="cursor-pointer w-4 h-4 aspect-square px-1 text-color-text-500 hover:text-color-text"
                @click.capture.stop="resetSelection"
                v-if="selectedItem"
              />
              <font-awesome-icon
                icon="fa-angle-down"
                class="cursor-pointer w-5 aspect-square px-1 text-color-text-500 group-hover:text-color-text"
              />
            </div>
          </template>
        </VTextField>
      </slot>
    </div>

    <Teleport to="body" :disabled="!open || preventAppend">
      <slot :items="filteredItems" name="items">
        <div
          class="absolute z-[10000] left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 w-max bg-color-bg"
          :class="[
            preventAppend
              ? 'min-w-full top-full left-0'
              : 'top-[var(--top)] left-[var(--left)]',
          ]"
          v-show="open"
          ref="dropdownPopup"
        >
          <div class="h-full relative overflow-auto" ref="dropdownContainer">
            <template v-if="dropdownContainer">
              <VirtualScroller
                :items="filteredItems"
                :item-height="30"
                :scrollable-container="dropdownContainer"
                :id="id"
                ref="virtualScroller"
              >
                <template v-slot="{ item, styleBinding, index }">
                  <div
                    class="px-2 overflow-ellipsis whitespace-nowrap h-full cursor-pointer flex items-center"
                    :class="[
                      selectedItem &&
                      (selectedItem === item ||
                        (typeof selectedItem === 'object' &&
                          deepEqual(item, selectedItem)))
                        ? 'bg-color-primary text-color-text-50 '
                        : index === selectedItemIndex
                        ? 'bg-color-primary/50'
                        : 'hover:bg-color-bg-50',
                    ]"
                    :style="styleBinding"
                    @click.prevent.capture="changeSelection(item)"
                  >
                    <ItemTest :item="item" :formatter="formatter"></ItemTest>
                  </div>
                </template>
              </VirtualScroller>
            </template>
          </div>
        </div>
      </slot>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";

import VTextField from "@/components/VTextField/VTextField.vue";
import { clamp, onClickOutside, onKeyStroke, useVModel } from "@vueuse/core";
import {
  RendererElement,
  computed,
  markRaw,
  onMounted,
  ref,
  ComponentInstance,
  nextTick,
} from "vue";
import { useAutoPopDirection } from "../../composables/UseAutoPopDirection";
import { deepEqual } from "../../utilities/index";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
  id: string;
  values: any[];
  modelValue?: any;
  formatter?: Function;
  autoFocus?: boolean;
  component?: RendererElement;
  preventAppend?: boolean;
  disabled?: boolean;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedItem = useVModel(
  props,
  "modelValue",
  emit,
  props.modelValue
    ? {}
    : {
        passive: true,
        defaultValue: null,
      }
);

const rawComponent = props.component ? markRaw(props.component) : undefined;

const filter = ref("");
const open = ref(false);
const selectedItemIndex = ref(0);

const dropdown = ref<HTMLElement | null>(null);
const dropdownPopup = ref<HTMLElement | null>(null);
const dropdownContainer = ref<HTMLElement | null>(null);
const input = ref<HTMLInputElement | null>(null);
const virtualScroller = ref<ComponentInstance<typeof VirtualScroller> | null>(
  null
);
onClickOutside(dropdown, () => {
  closePopup();
});

function closePopup() {
  open.value = false;
  reset();
}

function changeSelection(item: any) {
  selectedItem.value = item;
  reset();
}

function selectItemAtIndex() {
  if (open.value) {
    selectedItem.value = filteredItems.value[selectedItemIndex.value];
    closePopup();
  } else {
    openPopover();
  }
}

function openPopover() {
  open.value = true;

  selectedItemIndex.value = filteredItems.value.findIndex(
    (value: any) => formatValue(value) === formattedSelectedItem.value
  );

  input.value?.focus();

  nextTick(() => {
    if (selectedItemIndex.value >= 0) {
      virtualScroller.value?.scrollToIndex(selectedItemIndex.value);
    }
  });

  if (!props.preventAppend && dropdownPopup.value && dropdown.value) {
    useAutoPopDirection(dropdownPopup.value, dropdown.value);
    dropdownPopup.value.style.width =
      dropdown.value.getBoundingClientRect().width + "px";
  }
}

function reset() {
  filter.value = "";
}

const filteredItems = computed(() =>
  props.values.filter((value: any) =>
    props.formatter
      ? props.formatter(value).includes(filter.value)
      : value.includes(filter.value)
  )
);

const formattedSelectedItem = computed(() => formatValue(selectedItem.value));

function formatValue(value: any) {
  return props.formatter ? props.formatter(value) : value;
}

function resetSelection() {
  selectedItem.value = null;
}

function updateSelectedItemIndex(direction: number) {
  selectedItemIndex.value = clamp(
    selectedItemIndex.value + direction,
    0,
    filteredItems.value.length - 1
  );

  // console.log(selectedItemIndex.value);

  if (selectedItemIndex.value >= 0) {
    virtualScroller.value?.scrollToIndex(selectedItemIndex.value);
  }
}

function openPopoverIfClosed() {
  if (!open.value) {
    openPopover();
  }
}

onMounted(() => {
  if (props.autoFocus) {
    openPopover();
  }
});
</script>

<style scoped>
.overlap-grid,
.overlap-grid-after::after {
  grid-area: 1 / 2;
}
</style>
