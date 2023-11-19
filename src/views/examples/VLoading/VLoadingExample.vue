<template>
  <ComponentExampleTemplate component-name="VLoading">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VLoading> </VLoading>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VLoading from "@/components/VLoading/VLoading.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = "";
</script>
