<template>
  <div
    ref="gridBlock"
    class="bg-color-bg-50 rounded-lg w-full h-full select-none overflow-hidden relative group"
  >
    <div
      class="absolute right-0 top-0 rounded-lg text-transparent group-hover:text-color-text-500 group-hover:hover:text-color-primary cursor-pointer"
    >
      <VDropdown
        :values="dropDownValues"
        :formatter="(value: any) => value ? value.label : ''"
        append-to="body"
      >
        <div class="p-4">
          <font-awesome-icon
            :icon="['fas', 'ellipsis-vertical']"
            class="w-5 h-5"
          />
        </div>
      </VDropdown>
    </div>

    <slot :componentPath="data.componentPath"
      ><VWidget :component-path="data.componentPath" :name="data.name"></VWidget
    ></slot>

    <font-awesome-icon
      class="text-transparent group-hover:text-color-text-500 group-hover:hover:text-color-primary w-5 h-5 absolute right-0 bottom-0 p-4 cursor-pointer rotate-90"
      icon="down-left-and-up-right-to-center"
      ref="resizeHandle"
      @mousedown="onMouseClickStart"
    ></font-awesome-icon>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TranslationType,
  VInteractiveItem,
  VDynamicBentoGridRegionData,
} from "../../enums/index";
import VDropdown from "../VDropdown/index";
import VWidget from "@/components/VWidget/VWidget.vue";

const emit = defineEmits(["onSelect", "onResize", "clearData"]);
const props = defineProps<{
  id: string;
  data: VDynamicBentoGridRegionData;
  active: boolean;
}>();

const gridBlock = ref<HTMLElement | null>(null);
const resizeHandle = ref<HTMLElement | null>(null);
const rect = ref<DOMRect>();
const mouseData = ref<{
  start: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
}>({
  start: {
    x: 0,
    y: 0,
  },
  end: {
    x: 0,
    y: 0,
  },
  width: 0,
  height: 0,
});

const dropDownValues: VInteractiveItem[] = [
  {
    label: {
      type: TranslationType.RAW,
      value: "remove",
    },
    callback: () => emit("clearData"),
  },
];

function onMouseClickStart(event: MouseEvent) {
  mouseData.value.start.x = event.pageX;
  mouseData.value.start.y = event.pageY;
  mouseData.value.end.x = event.pageX;
  mouseData.value.end.y = event.pageY;

  if (gridBlock.value) {
    rect.value = gridBlock.value.getBoundingClientRect();

    document.addEventListener("mouseup", onMouseClickEnd);
    document.addEventListener("mousemove", onMouseClickMove);
  }
}

function onMouseClickMove(event: MouseEvent) {
  if (rect.value) {
    mouseData.value.end.x =
      rect.value.right + (event.pageX - mouseData.value.start.x);
    mouseData.value.end.y =
      rect.value.bottom + (event.pageY - mouseData.value.start.y);
  }

  emit(
    "onResize",
    props.id,
    { x: rect.value?.left, y: rect.value?.top },
    mouseData.value.end
  );
}

function onMouseClickEnd(_event: MouseEvent) {
  if (gridBlock.value) {
    document.removeEventListener("mouseup", onMouseClickEnd);
    document.removeEventListener("mousemove", onMouseClickMove);
  }
}
</script>
