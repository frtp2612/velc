<template>
  <div
    class="flex gap-4 py-2 px-2 hover:bg-color-bg-100 overflow-ellipsis whitespace-nowrap h-full cursor-pointer"
    @click="onItemClick"
  >
    <font-awesome-icon :icon="item.icon" v-if="item.icon" class="w-5 h-5" />
    <span>{{ formattedItem }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { textFormatter } from "../../formatters/index";
import { VInteractiveItem } from "../../enums/index";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  item: VInteractiveItem;
  formatter?: Function;
}>();

const i18n = useI18n();

const formattedItem = computed(() =>
  props.formatter
    ? props.formatter(props.item)
    : textFormatter(props.item.label, i18n)
);

function onItemClick() {
  if (props.item.enabling) {
    props.item.enabling() ? props.item.callback() : {};
  } else {
    props.item.callback();
  }
}
</script>
