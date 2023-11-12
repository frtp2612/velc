<template>
  <ComponentExampleTemplate component-name="VTabbedView - VTabPanel">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VTabbedView>
          <VTabPanel title="Tab 1">
            <VLabel>Tab content</VLabel>
          </VTabPanel>
          <VTabPanel title="Tab 2">
            <VLabel>Tab content 2</VLabel>
          </VTabPanel>
          <VTabPanel title="Tab 3">
            <VLabel>Tab content 3</VLabel>
          </VTabPanel>
        </VTabbedView>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { VTabbedView, VTabPanel } from "@/components/VTabbedView/index";
import VLabel from "@/components/VLabel/index";

const example1 = "";
</script>
