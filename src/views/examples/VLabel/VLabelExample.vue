<template>
  <ComponentExampleTemplate component-name="VLabel">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VLabel>Label content</VLabel>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/VLabel.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = "";
</script>
