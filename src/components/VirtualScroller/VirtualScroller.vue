<template>
  <div
    :class="[
      containerClass ? containerClass : 'overflow-auto min-h-0 h-full relative',
    ]"
    ref="container"
  >
    <slot name="prepend"></slot>
    <div
      class="will-change-transform"
      :class="[wrapperClass ? wrapperClass : 'w-full']"
      :style="{ height: `${totalContentHeight}px` }"
      ref="itemsWrapper"
    >
      <div
        v-for="(item, index) in list"
        class="will-change-transform"
        :style="[
          { transform: `translateY(${offsetY}px)` },
          itemHeight ? { height: `${itemHeight}px` } : {},
        ]"
        :key="currentIndex + index"
      >
        <slot
          :item="item"
          :index="currentIndex + index"
          :height="itemHeight"
          :wrapper="itemsWrapper"
        >
          <span>{{ item }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import VirtualScroll from "./VirtualScroller";

type Props = {
  itemHeight: number;
  items: any[];
  containerClass?: string;
  wrapperClass?: string;
  itemClass?: string;
  renderAhead?: number;
};

const props = withDefaults(defineProps<Props>(), {
  renderAhead: 6,
});

const container = ref<HTMLElement | null>(null);
const itemsWrapper = ref<HTMLElement>();

const { list, totalContentHeight, offsetY, currentIndex, scrollToIndex } =
  VirtualScroll({
    container,
    items: computed(() => props.items),
    itemHeight: props.itemHeight,
    renderAhead: props.renderAhead,
  });

defineExpose({ container, itemsWrapper, scrollToIndex });
</script>
