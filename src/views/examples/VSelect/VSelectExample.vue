<template>
	<div class="grid grid-cols-2 gap-8 p-8 h-96">
		<VSelect
			:values="list1"
			:id="id1"
			:formatter="formatter"
			v-model="selectedValue1"
			:key="selectedValue1"
			preventAppend
		/>

		<VSelect :values="list2" :id="id2" :key="selectedValue2" preventAppend />
	</div>
</template>

<script setup lang="ts">
import VSelect from "@/components/VSelect/index";
import { ref } from "vue";

const list1: string[] = Array.from(Array(100)).map((_, i) => "Item " + i);
const list2: string[] = Array.from(Array(40)).map((_, i) => "Item " + i);

const selectedValue1 = ref(list1[0]);
const selectedValue2 = ref(list2[0]);

const id1 = Math.floor(Math.random() * Date.now()).toString(36);
const id2 = Math.floor(Math.random() * Date.now()).toString(36);

const formatter = (value: string) => value;
</script>

<style scoped></style>
