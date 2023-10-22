import { useElementScroll } from "../../composables/UseElementScroll";
import { Ref, computed, ComputedRef } from "vue";

const VirtualScroll = ({
  container,
  items,
  itemHeight,
  renderAhead,
}: {
  container: Ref<HTMLElement | null>;
  items: ComputedRef<any[]>;
  itemHeight: number;
  renderAhead: number;
}) => {
  const itemCount = computed(() => items.value.length);

  const totalContentHeight = computed(() => itemCount.value * itemHeight);

  const { scrollTop } = useElementScroll(container, totalContentHeight);

  const startNode = computed(() =>
    Math.max(0, Math.floor(scrollTop.value / itemHeight) - renderAhead)
  );

  const visibleNodesCount = computed<number>(() => {
    const count = container.value
      ? Math.ceil(container.value.clientHeight / itemHeight) + 2 * renderAhead
      : 0;
    return Math.min(itemCount.value - startNode.value, count);
  });

  const offsetY = computed(() => startNode.value * itemHeight);

  const visibleChildren = computed(() =>
    items.value.slice(
      startNode.value,
      startNode.value + visibleNodesCount.value
    )
  );

  return {
    list: visibleChildren,
    offsetY,
    totalContentHeight,
    currentIndex: startNode,
  };
};

export default VirtualScroll;
