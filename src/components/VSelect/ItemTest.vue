<template>
  <div class="flex flex-col">
    <div class="flex gap-4">
      <span>{{ formattedItem }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  item: any;
  formatter?: Function;
}>();

const formattedItem = computed(() =>
  props.formatter ? props.formatter(props.item) : props.item
);
</script>

<style scoped></style>
