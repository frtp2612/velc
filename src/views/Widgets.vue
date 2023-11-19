<template>
  <div class="grid grid-cols-2 gap-2">
    <VWidgetPreview
      v-for="widget in widgets"
      :componentPath="widget.componentPath"
      :name="widget.name"
      :size="widget.size"
    >
    </VWidgetPreview>
  </div>
</template>

<script setup lang="ts">
import * as components from "./widgets/index";
import { ref } from "vue";
import { Widget } from "@/enums";
import VWidgetPreview from "./widgets/VWidgetPreview.vue";

const componentsList: Widget[] = components?.widgets;
const widgets = ref<
  {
    name: string;
    componentPath: string;
    size: {
      x: number;
      y: number;
    };
  }[]
>([]);

componentsList.forEach((widget: Widget) => {
  widgets.value.push({
    componentPath: "/src" + widget.widget["__file"].split("/src")[1],
    name: widget.name,
    size: widget.size,
  });
});

const emit = defineEmits(["onWidgetClicked"]);
</script>

<style scoped></style>
