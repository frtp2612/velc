<template>
  <VButton :on-click="increaseCounter">{{ counter }}</VButton>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/VButton.vue";
import { ref } from "vue";

const counter = ref(0);

function increaseCounter() {
  counter.value += 1;
}
</script>

<style scoped></style>
