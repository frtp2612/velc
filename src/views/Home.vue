<template>
  <ComponentExampleTemplate component-name="Home">
    <template #usage>
      <VButton :on-click="() => (drawerOpen = true)">Add Widgets</VButton>
      <VDynamicBentoGrid ref="dynamicGrid"> </VDynamicBentoGrid>
      <VDrawer v-model="drawerOpen"><Widgets /></VDrawer>
    </template>
  </ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VDynamicBentoGrid from "@/components/VDynamicBentoGrid/VDynamicBentoGrid.vue";
import { ref } from "vue";
import Widgets from "./Widgets.vue";
import ComponentExampleTemplate from "./templates/ComponentExampleTemplate.vue";
import VDrawer from "@/components/VDrawer/VDrawer.vue";
import VButton from "@/components/VButton/index";

const dynamicGrid = ref<InstanceType<typeof VDynamicBentoGrid> | null>(null);
const drawerOpen = ref(false);
// function assignGridBlockContent(componentPath: string) {
//   if (dynamicGrid.value !== null) {
//     dynamicGrid.value.assignData("componentPath", componentPath);
//   }
// }
</script>
