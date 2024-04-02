<template>
  <div
    ref="column"
    class="flex flex-col relative px-2 py-2 gap-2 bg-inherit group/column"
    :class="[data.descriptor.isLocked ? 'z-[1]' : ' ']"
    :style="data.descriptor.isLocked ? lockedStyle : ''"
  >
    <div class="flex items-center gap-2 cursor-pointer justify-center">
      <font-awesome-icon
        icon="fa-lock"
        class="w-4 h-4 text-color-text-500"
        v-if="data.descriptor.isLocked"
      />
      <VLabel class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{
        formattedLabel
      }}</VLabel>
    </div>

    <div
      ref="gutter"
      class="absolute right-0 top-0 h-full z-10 invisible group-hover/column:visible"
    >
      <div
        class="absolute h-full w-0 left-0 before:hover:cursor-ew-resize before:absolute before:right-0 before:bg-color-bg-200 before:hover:bg-color-primary before:transition-[colors,_transform] before:duration-150 before:hover:z-10 before:w-1 before:h-full before:hover:scale-x-[2]"
        :style="[{ height: state ? height + 'px' : '100%' }]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="RowType extends VDataRow">
import VLabel from "@/components/VLabel/index";
import { computed, ref } from "vue";
import { VDataColumn, VDataGridStateType, VDataRow } from "./types";
import { textFormatter } from "@/formatters";
import { useI18n } from "vue-i18n";
import { useElementResizer } from "@/composables/UseElementResizer";

const props = defineProps<{
  data: VDataColumn;
  index: number;
  state: VDataGridStateType<RowType>;
}>();

const gutter = ref<HTMLElement | null>(null);
const column = ref<HTMLElement | null>(null);

const { height } = props.state;

const i18n = useI18n();

useElementResizer(column, gutter, (width: number) =>
  props.state.updateColumnSize(props.data.id, width)
);

const formattedLabel = computed(() => textFormatter(props.data.label, i18n));

const lockedStyle = computed(
  () =>
    `position: sticky; left:${props.state.getLockedColumnPosition(
      props.data.id
    )}px;`
);
</script>
