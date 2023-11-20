<template>
  <VSwitcher :values="values"> </VSwitcher>
</template>

<script lang="ts" setup>
import VSwitcher from "@/components/VSwitcher/VSwitcher.vue";
import { VCallableItem } from "@/enums/index";
import { TranslationType } from "../../../enums/index";

const values: VCallableItem[] = Array.from(Array(3)).map((_, i) => {
  return {
    label: {
      type: TranslationType.RAW,
      value: "item" + i,
    },
    callback: () => {
      console.log("item %d was clicked", [i]);
    },
  };
});
</script>
