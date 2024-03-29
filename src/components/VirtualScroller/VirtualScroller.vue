<template>
  <component
    :is="wrapperTag"
    :class="[wrapperClass ? wrapperClass : 'w-full']"
    :style="{ height: `${totalHeight}px` }"
    ref="container"
  >
    <template v-for="(item, index) in visibleItems" :key="item">
      <slot
        :item="item"
        :index="startIndex + index"
        :height="itemHeight"
        :styleBinding="[
          { transform: `translateY(${offsetY}px)` },
          itemHeight ? { height: `${itemHeight}px` } : {},
        ]"
      >
        <span>{{ item }}</span>
      </slot>
    </template>
    <div
      :style="[
        {
          transform: `translateY(${offsetY}px)`,
        },
      ]"
    ></div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import useVirtualList from "./useVirtualList";

type Props = {
  itemHeight: number;
  items: any[];
  containerClass?: string;
  wrapperClass?: string;
  renderAhead?: number;
  wrapperTag?: string;
  rowWrapperTag?: string;
};

const props = withDefaults(defineProps<Props>(), {
  renderAhead: 6,
  id: "",
  wrapperTag: "div",
  rowWrapperTag: "div",
});

const container = ref<HTMLElement | null>(null);

const { visibleItems, totalHeight, offsetY, startIndex, scrollToIndex } =
  useVirtualList(
    computed(() => props.items),
    props.itemHeight,
    container,
    props.renderAhead
  );

defineExpose({ container, scrollToIndex });
</script>
