<template>
  <div
    ref="gridBlock"
    class="bg-slate-100 rounded-md w-full h-full select-none overflow-hidden grid items-center justify-items-center relative border p-2"
    :class="[active ? 'border-blue-200' : 'border-transparent']"
  >
    <div
      class="absolute right-0 top-0 bg-slate-100 rounded-md text-slate-500 hover:text-slate-900 cursor-pointer"
      v-if="data"
    >
      <VDropdown
        :values="dropDownValues"
        :formatter="(value: any) => value.label"
        @update:model-value="onDropdownItemSelected"
      >
        <div class="px-2 py-1">
          <font-awesome-icon
            :icon="['fas', 'ellipsis-vertical']"
            class="w-4 h-4"
          />
        </div>
      </VDropdown>
    </div>

    <slot
      ><div
        class="h-full w-full flex group flex-col cursor-pointer justify-center text-transparent hover:text-slate-300"
        @click="emit('onSelect')"
      >
        <span class="text-3xl w-full text-center">+</span>
      </div></slot
    >

    <div
      class="bg-black w-3 h-3 absolute right-1 bottom-1 cursor-all-scroll"
      ref="resizeHandle"
      @mousedown="onMouseClickStart"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VDropdown from "../VDropdown/index";

const emit = defineEmits(["onSelect", "onResize", "clearData"]);
const props = defineProps<{
  id: string;
  data?: Object;
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

const dropDownValues = [
  {
    id: "remove",
    label: "remove",
    callBack: () => emit("clearData"),
  },
];

function onDropdownItemSelected(item: any) {
  const match = dropDownValues.find((value: any) => item.id === value.id);
  if (match) {
    match.callBack();
  }
}

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
