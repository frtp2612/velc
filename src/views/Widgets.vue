<template>
  <div>
    <VWidget
      v-for="widget in widgets"
      :component-path="widget"
      @click="emit('onWidgetClicked', widget)"
    />
  </div>
</template>

<script setup lang="ts">
import * as components from "./widgets/index";
import VWidget from "@/components/VWidget/VWidget.vue";
import { ref } from "vue";

const componentsList: { [key: string]: any } = components?.default;
const widgets = ref<string[]>([]);

Object.keys(componentsList).forEach((name) => {
  widgets.value.push("/src" + componentsList[name]["__file"].split("/src")[1]);
});

const emit = defineEmits(["onWidgetClicked"]);
</script>

<style scoped></style>
