<template>
  <div>
    <VDropdown :values="values" v-model="dropDownSelection"></VDropdown>
    <!-- <VirtualScroller :item-height="30" :items="values">
      <template v-slot="{ item, index }">
        <div>{{ item }} -- {{ index }}</div>
      </template>
    </VirtualScroller> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VDropdown from "../components/Dropdown/VDropdown.vue";

const values = Array.from(Array(1000)).map((_, i) => "item-" + i);
const dropDownSelection = ref("three");
</script>

<style scoped></style>
