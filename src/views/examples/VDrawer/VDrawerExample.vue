<template>
  <ComponentExampleTemplate component-name="VDrawer">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VButton :on-click="() => (drawerOpen = true)">Open Drawer</VButton>
        <VDrawer v-model="drawerOpen"> </VDrawer>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDrawer from "@/components/VDrawer/VDrawer.vue";
import VButton from "@/components/VButton/index";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";

const drawerOpen = ref(false);

const example1 = "";
</script>
