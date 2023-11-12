<template>
  <div
    ref="column"
    class="flex flex-col relative border-r-color-border-100 border-r py-2 gap-2"
    :class="[data.locked ? 'bg-inherit z-[1]' : ' ']"
    :style="data.locked ? lockedStyle : ''"
  >
    <div class="flex items-center gap-2 cursor-pointer" @click="sort(data.id)">
      <font-awesome-icon
        icon="fa-lock"
        class="w-4 h-4 text-color-text-400"
        v-if="data.locked"
      />
      <VLabel class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{
        formattedLabel
      }}</VLabel>
      <div v-show="data.id === sortKey">
        <font-awesome-icon :icon="sortIcon" class="w-4 h-4 text-color-accent" />
      </div>
    </div>
    <VDataEditor
      :id="data.id"
      :model-value="filters.get(data.id)"
      :formatter="data.valueFormatter"
      :values="data.editor?.values"
      :type="data.dataType"
      :auto-focus="false"
      @update:model-value="(value: any) => setFilter(data.id, value)"
    />

    <template
      v-if="data.dataType && data.dataType === VDataType.EDITABLE_BOOLEAN"
    >
      <VDivider color="bg-color-border-100" />
      <VCheckBox
        :id="data.id"
        :model-value="selectAllMap.get(data.id)?.value"
        @update:model-value="selectAll"
      />
    </template>

    <div
      ref="gutter"
      class="absolute -right-[1px] top-0 w-2 group h-full"
      v-show="allowResize"
    >
      <font-awesome-icon
        icon="fa-left-right"
        class="absolute w-4 h-4 top-1/2 right-0 -translate-y-2.5 text-color-text-400 bg-color-bg-200 group-hover:bg-color-primary group-hover:text-color-text-50 p-1 rounded-l-md cursor-col-resize transition-all ease-in-out duration-150"
      />

      <div
        class="absolute h-full w-[2px] left-1.5 transition-all ease-in-out duration-150 bg-color-bg-200 group-hover:bg-color-primary"
        :style="[{ height: state ? tableHeight + 'px' : '100%' }]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { useElementResizer } from "@/composables/UseElementResizer";
import {
  ExplicitTranslationValue,
  KeyTranslationValue,
  RawTranslationValue,
  TranslationType,
  VDataColumn,
  VDataGridStateType,
  VDataType,
} from "@/enums";
import { computed, inject, onMounted, onUnmounted, ref } from "vue";
import VCheckBox from "@/components/VCheckBox/index";
import VDivider from "@/components/VDivider/index";
import VDataEditor from "./VDataEditor.vue";

const props = defineProps<{
  data: VDataColumn;
  index: number;
  formatter: (
    value: {
      type: TranslationType;
      value:
        | ExplicitTranslationValue
        | KeyTranslationValue
        | RawTranslationValue;
    },
    translator: any
  ) => string;
  translator: any;
}>();

const gutter = ref<HTMLElement | null>(null);
const column = ref<HTMLElement | null>(null);

const state: VDataGridStateType | undefined = inject("state");

const {
  tableHeight,
  selectAllMap,
  lockedColumnsMap,
  sortKey,
  sortOrder,
  sort,
  toggleAllValues,
  filters,
  setFilter,
} = state!;

const allowResize = ref(false);

if (state) {
  useElementResizer(column, gutter, (width: number) =>
    state.updateColumnSize(props.data.id, width)
  );
}

const lockedStyle = computed(
  () => `position: sticky; left:${lockedColumnsMap.value.get(props.data.id)}px;`
);

const sortIcon = computed(() =>
  sortOrder.value === "asc"
    ? "fa-arrow-up-short-wide"
    : "fa-arrow-down-wide-short"
);

const formattedLabel = computed(() =>
  props.formatter(props.data.label, props.translator)
);

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

function selectAll(value: boolean) {
  toggleAllValues(value, props.data.id);
}
</script>
