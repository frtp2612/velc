<template>
	<div class="grid grid-cols-2 gap-8 p-8 h-96">
		<VDataList :items="firstList" :item-height="30" v-show="firstListVisible">
		</VDataList>
		<VDataList :items="list2" :item-height="30"> </VDataList>
	</div>
	<VButton :on-click="toggleFirstList">toggleFirstList</VButton>
	<VButton :on-click="filterList">Filter elements</VButton>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import VDataList from "@/components/VDataList/VDataList.vue";
import { computed, ref } from "vue";

const list1: string[] = Array.from(Array(100)).map((_, i) => "Item " + i);
const list2: string[] = Array.from(Array(40)).map((_, i) => "Item " + i);

const filter = ref(false);

const firstListVisible = ref(true);

function toggleFirstList() {
	firstListVisible.value = !firstListVisible.value;
}

const firstList = computed(() =>
	filter.value ? list1.filter((_, i: number) => i % 2 === 0) : list1
);

function filterList() {
	filter.value = !filter.value;
}
</script>
