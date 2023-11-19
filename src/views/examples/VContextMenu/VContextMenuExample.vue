<template>
  <ComponentExampleTemplate component-name="VContextMenu">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VButton :type="VButtonTypes.PRIMARY" ref="target"
          >Testing context menu</VButton
        >
        <VContextMenu :items="items" :attach-to="target"> </VContextMenu>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VContextMenu from "@/components/VContextMenu/VContextMenu.vue";
import { VInteractiveItem, TranslationType, VButtonTypes } from "@/enums/index";
import VButton from "@/components/VButton/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";
import { ComponentPublicInstance } from "vue";

const target = ref<ComponentPublicInstance | null>(null);

const items: VInteractiveItem[] = Array.from(Array(5)).map((_, i) => {
  return {
    callback: () => console.log("Item " + i + " was clicked"),
    label: {
      type: TranslationType.RAW,
      value: "Item " + i,
    },
  };
});

const example1 = "";
</script>
