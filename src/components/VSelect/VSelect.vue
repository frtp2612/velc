<template>
  <div class="relative inline-block max-w-full">
    <div ref="dropdown" class="h-full flex items-center" @click="toggle">
      <slot :selection="formattedSelectedItem">
        <component :is="rawComponent" v-if="rawComponent" />
        <VButton icon-right="fa-angle-down h-full" v-else>
          <VLabel class="text-color-text">{{ formattedSelectedItem }}</VLabel>
        </VButton>
      </slot>
    </div>

    <Teleport to="body" :disabled="!appendTo">
      <slot :items="filteredItems" name="item">
        <div
          class="absolute z-[9999] left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 min-w-[16rem] w-max max-w-max bg-color-bg divide-y"
          v-show="open"
          ref="dropdownPopup"
        >
          <div class="flex gap-2 bg-color-bg-50 rounded-md m-2 px-2 py-1">
            <font-awesome-icon icon="fa-filter" class="w-4 h-4" />
            <span>{{ filter }}</span>
          </div>
          <VirtualScroller :items="filteredItems" :item-height="30">
            <template v-slot="{ item }">
              <div
                class="px-2 overflow-ellipsis whitespace-nowrap h-full cursor-pointer flex items-center"
                :class="[
                  selectedItem &&
                  (selectedItem === item ||
                    (typeof selectedItem === 'object' &&
                      item !== null &&
                      selectedItem.id === item.id))
                    ? 'bg-color-primary text-color-text-50 '
                    : 'hover:bg-color-bg-50',
                ]"
                @click.prevent.capture="changeSelection(item)"
              >
                <ItemTest :item="item" :formatter="formatter"></ItemTest>
              </div>
            </template>
          </VirtualScroller>
        </div>
      </slot>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { onClickOutside, useVModel } from "@vueuse/core";
import {
  RendererElement,
  computed,
  markRaw,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import { useAutoPopDirection } from "../../composables/UseAutoPopDirection";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
  values: any[];
  modelValue?: any;
  formatter?: Function;
  appendTo?: string | RendererElement;
  autoFocus?: boolean;
  component?: RendererElement;
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
      }
);

const rawComponent = props.component ? markRaw(props.component) : undefined;

const searchTerm = ref("");
const filter = ref("");
const open = ref(false);
const timer = ref();

const dropdown = ref(null);
const dropdownPopup = ref<HTMLElement | null>(null);

onClickOutside(dropdown, () => {
  open.value = false;
});

function startTimer() {
  timer.value = setTimeout(() => {
    searchTerm.value = "";
  }, 2000);
}

function toggle() {
  open.value = !open.value;

  if (open.value) {
    startTimer();
    document.addEventListener("keyup", inputListener);
    requestAnimationFrame(() => {
      if (dropdownPopup.value && dropdown.value && props.appendTo) {
        useAutoPopDirection(dropdown.value, dropdownPopup.value);
      }
    });
  } else {
    reset();
  }
}

function reset() {
  document.removeEventListener("keyup", inputListener);
  searchTerm.value = "";
  filter.value = "";
}

function changeSelection(item: any) {
  selectedItem.value = item;
  reset();
}

function inputListener(event: KeyboardEvent) {
  const name = event.key;
  const code = event.code;

  if (event.shiftKey || name === "Control" || name === "Tab") {
    return;
  }

  if (event.ctrlKey) {
    console.log(`Combination of ctrlKey + ${name} \n Key code Value: ${code}`);
  } else {
    if (code === "Backspace") {
      searchTerm.value = searchTerm.value.slice(0, -1);
    } else {
      searchTerm.value += event.key;
    }

    filter.value = searchTerm.value;
  }

  clearTimeout(timer.value);
  startTimer();
}

const filteredItems = computed(() =>
  props.values.filter((value: any) =>
    props.formatter
      ? props.formatter(value).includes(filter.value)
      : value.includes(filter.value)
  )
);

const formattedSelectedItem = computed(() =>
  props.formatter ? props.formatter(selectedItem.value) : selectedItem.value
);

onMounted(() => {
  if (props.autoFocus) {
    toggle();
  }
});

onUnmounted(() => {
  document.removeEventListener("keyup", inputListener);
});
</script>
