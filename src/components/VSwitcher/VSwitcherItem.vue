<template>
  <div class="flex gap-4">
    <font-awesome-icon :icon="icon" v-if="icon" />
    <span>{{ formattedItem }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Translatable } from "@/enums/index";
import { textFormatter } from "@/formatters/index";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps<{
  label: Translatable;
  icon?: string;
  formatter?: Function;
}>();

const formattedItem = computed(() =>
  props.formatter
    ? props.formatter(props.label)
    : textFormatter(props.label, i18n)
);
</script>

<style scoped></style>
