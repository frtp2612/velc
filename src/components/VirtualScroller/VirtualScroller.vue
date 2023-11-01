<template>
  <div
    :class="[
      containerClass ? containerClass : 'overflow-auto min-h-0 h-full relative',
    ]"
    ref="container"
  >
    <slot name="prepend"></slot>
    <div
      class="will-change-transform overflow-clip"
      :class="[wrapperClass ? wrapperClass : 'w-full']"
      :style="{ height: `${totalContentHeight}px` }"
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
        <slot :item="item" :index="currentIndex + index">
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

const { list, totalContentHeight, offsetY, currentIndex } = VirtualScroll({
  container,
  items: computed(() => props.items),
  itemHeight: props.itemHeight,
  renderAhead: props.renderAhead,
});

defineExpose({ container });
</script>
