<template>
  <ComponentExampleTemplate component-name="Home">
    <template #usage>
      <input type="number" v-model="columns" />
      <input type="number" v-model="rows" />
      <VDynamicGrid :columns="columns" :rows="rows" ref="dynamicGrid">
        <template v-slot="{ data }">
          <VWidget v-bind="(data as Widget)" />
        </template>
      </VDynamicGrid>
      <Widgets @on-widget-clicked="assignGridBlockContent" />
    </template>
  </ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VDynamicGrid from "@/components/VDynamicGrid/VDynamicGrid.vue";
import ComponentExampleTemplate from "./templates/ComponentExampleTemplate.vue";
import { ref } from "vue";
import VWidget from "@/components/VWidget/VWidget.vue";
import Widgets from "./Widgets.vue";
const columns = ref(1);
const rows = ref(1);

const dynamicGrid = ref<InstanceType<typeof VDynamicGrid> | null>(null);

type Widget = {
  componentPath: string;
};

function assignGridBlockContent(componentPath: string) {
  if (dynamicGrid.value !== null) {
    dynamicGrid.value.assignData("componentPath", componentPath);
  }
}
</script>
