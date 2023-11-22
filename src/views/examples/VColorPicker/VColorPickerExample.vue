<template>
	<VColorPicker v-model="model"> </VColorPicker>
</template>

<script lang="ts" setup>
import VColorPicker from "@/components/VColorPicker/VColorPicker.vue";

const model = "rgb(230,20,250)";
</script>
