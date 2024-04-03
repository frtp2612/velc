<template>
  <div
    :class="[wrapperClass ? wrapperClass : 'w-full']"
    :style="{ height: `${totalHeight}px` }"
    ref="wrapper"
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
  </div>
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
  scrollableContainer: HTMLElement;
};

const props = withDefaults(defineProps<Props>(), {
  renderAhead: 10,
  id: "",
});

const wrapper = ref<HTMLElement | null>(null);

const { visibleItems, totalHeight, offsetY, startIndex, scrollToIndex } =
  useVirtualList(
    computed(() => props.items),
    props.itemHeight,
    props.scrollableContainer,
    props.renderAhead
  );

defineExpose({ virtualScroller: wrapper, scrollToIndex });
</script>
