<template>
  <div class="flex flex-col min-h-0 h-full gap-4">
    <div>Done: {{ done }}</div>
    <div class="flex flex-col min-h-0 h-full overflow-auto gap-2">
      <div v-for="todo in todos" class="flex justify-between gap-4">
        {{ todo.label }} <VCheckBox v-model="todo.done" :id="todo.label" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VCheckBox from "@/components/VCheckBox/index";
const todos = ref<
  {
    label: string;
    done: boolean;
  }[]
>(
  Array.from(Array(5)).map((_, i) => {
    return {
      done: false,
      label: "Item " + i,
    };
  })
);

const done = computed(
  () =>
    todos.value.filter(
      (todo: { label: string; done: boolean }) => todo.done === true
    ).length
);
</script>

<style scoped></style>
