<template>
  <ComponentExampleTemplate component-name="VNavigation">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VNavigation :root="navItems">
          <template #bottomNav>
            <VLabel class="text-color-text-300 font-bold text-sm"
              >Account</VLabel
            >
            <div class="flex flex-col gap-4">
              <div
                class="flex gap-2 items-center px-2 py-1 cursor-pointer font-medium selectable-node"
              >
                <font-awesome-icon icon="fa-gear" class="w-5 aspect-square" />
                <VLabel class="text-lg">Settings</VLabel>
              </div>
              <div
                class="flex gap-2 items-center px-2 py-1 cursor-pointer font-medium selectable-node"
              >
                <font-awesome-icon
                  icon="fa-right-from-bracket"
                  class="w-5 aspect-square"
                />
                <VLabel class="text-lg">Logout</VLabel>
              </div>
            </div>
            <div
              class="flex gap-4 items-center border border-color-border hover:border-color-primary hover:text-color-primary rounded-lg p-2 group cursor-pointer"
            >
              <div
                class="w-12 aspect-square bg-color-bg-50 border border-color-border-50 group-hover:border-color-primary rounded-full"
              ></div>
              <VLabel class="font-semibold">Fictional Name</VLabel>
            </div>
            <VDivider />
            <VLabel class="text-color-text-300 font-bold text-sm self-center"
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
import VDivider from "@/components/VDivider/index";

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
