<template>
  <ComponentExampleTemplate component-name="VNavigation">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VNavigation :root="navItems">
          <template #bottomNav="{ isExpanded }">
            <VLabel
              class="text-color-text-300 font-bold text-sm self-center"
              v-show="isExpanded"
              >v-{{ version }}</VLabel
            >
          </template>
        </VNavigation>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import VNavigation from "@/components/VNavigation/index";
import { TranslationType, VNavItem } from "@/enums/index";
import VLabel from "@/components/VLabel/index";

const example1 = "";

const version = import.meta.env.VITE_APP_VERSION;

const navItems: VNavItem = {
  label: {
    type: TranslationType.RAW,
    value: "Root",
  },
  children: [
    {
      label: { type: TranslationType.RAW, value: "Child 1" },
      icon: "fa-house",
      to: "child-1",
    },
    {
      label: { type: TranslationType.RAW, value: "Child 2" },
      icon: "fa-house",
      children: [
        {
          label: { type: TranslationType.RAW, value: "Child 5" },
          icon: "fa-house",
          to: "child-5",
        },
        {
          label: { type: TranslationType.RAW, value: "Child 6" },
          icon: "fa-house",
          to: "child-6",
        },
      ],
    },
    {
      label: { type: TranslationType.RAW, value: "Child 3" },
      icon: "fa-house",
      to: "child-3",
    },
    {
      label: { type: TranslationType.RAW, value: "Child 4" },
      icon: "fa-house",
      to: "child-4",
    },
  ],
};
</script>
