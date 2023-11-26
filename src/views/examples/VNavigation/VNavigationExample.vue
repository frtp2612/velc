<template>
  <ComponentExampleTemplate component-name="VNavigation">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VNavigation :root="navItems">
          <template #bottomNav="{ isExpanded }">
            <VLabel
              class="text-color-text-500 font-bold text-sm self-center"
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
import VLabel from "@/components/VLabel/index";
import VNavigation from "@/components/VNavigation/index";
import { TranslationType, VNavItem } from "@/enums/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

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
          label: {
            type: TranslationType.RAW,
            value:
              "Child 6" + Math.floor(Math.random() * Date.now()).toString(36),
          },
          icon: "fa-house",
          children: [
            {
              label: { type: TranslationType.RAW, value: "Child 7" },
              icon: "fa-house",
              children: [
                {
                  label: { type: TranslationType.RAW, value: "Child 9" },
                  icon: "fa-house",
                  to: "child-9",
                },
                {
                  label: { type: TranslationType.RAW, value: "Child 10" },
                  icon: "fa-house",
                  children: [
                    {
                      label: {
                        type: TranslationType.RAW,
                        value:
                          "Child 11" +
                          Math.floor(Math.random() * Date.now()).toString(36),
                      },
                      icon: "fa-house",
                      to: "child-11",
                    },
                    {
                      label: { type: TranslationType.RAW, value: "Child 12" },
                      icon: "fa-house",
                      to: "child-12",
                    },
                  ],
                },
              ],
            },
            {
              label: { type: TranslationType.RAW, value: "Child 8" },
              icon: "fa-house",
              to: "child-8",
            },
          ],
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
