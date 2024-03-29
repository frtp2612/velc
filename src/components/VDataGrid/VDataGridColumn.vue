<template>
  <th
    ref="column"
    class="flex flex-col relative px-2 py-2 gap-2 border border-inherit"
  >
    <div class="flex items-center gap-2 cursor-pointer justify-center">
      <font-awesome-icon
        icon="fa-lock"
        class="w-4 h-4 text-color-text-500"
        v-if="data.locked"
      />
      <VLabel class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{
        formattedLabel
      }}</VLabel>
    </div>

    <div
      ref="gutter"
      class="absolute -right-[1px] top-0 w-2 group h-full z-10"
      v-show="allowResize"
    >
      <font-awesome-icon
        icon="fa-left-right"
        class="absolute w-4 h-4 top-1/2 right-0 -translate-y-2.5 text-color-text-700 bg-color-bg-200 group-hover:bg-color-primary group-hover:text-color-text-50 p-1 rounded-l-md cursor-col-resize transition-all ease-in-out duration-150"
      />

      <div
        class="absolute h-full w-[2px] left-1.5 transition-all ease-in-out duration-150 bg-color-bg-200 group-hover:bg-color-primary"
        :style="[{ height: state ? height + 'px' : '100%' }]"
      ></div>
    </div>
  </th>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VLabel from "@/components/VLabel/index";
// import { useElementResizer } from "@/composables/UseElementResizer";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { VDataColumn, VDataGridStateType, VDataRow } from "./types";
import { textFormatter } from "@/formatters";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  data: VDataColumn<RowType>;
  index: number;
  state: VDataGridStateType<RowType>;
}>();

const gutter = ref<HTMLElement | null>(null);
const column = ref<HTMLElement | null>(null);

const { height } = props.state;

const allowResize = ref(false);

const i18n = useI18n();

// if (props.state) {
// 	useElementResizer(column, gutter, (width: number) =>
// 		props.state.updateColumnSize(props.data.id, width)
// 	);
// }

const formattedLabel = computed(() => textFormatter(props.data.label, i18n));

onMounted(() => {
  if (column.value) {
    column.value.addEventListener("mouseenter", toggleResize);
    column.value.addEventListener("mouseleave", toggleResize);
  }
});

onUnmounted(() => {
  if (column.value) {
    column.value.removeEventListener("mouseenter", toggleResize);
    column.value.removeEventListener("mouseleave", toggleResize);
  }
});

function toggleResize(event: MouseEvent) {
  if (event.type === "mouseenter") {
    allowResize.value = true;
  } else {
    allowResize.value = false;
  }
}
</script>
