<template>
	<div
		:style="column.locked ? lockedStyle : ''"
		class="px-3 leading-[31px] border-b border-r-theme-bg-100 border-r"
	>
		<VLabel class="overflow-hidden overflow-ellipsis whitespace-nowrap">
			{{ data[column.id] }}
		</VLabel>
	</div>
</template>

<script setup lang="ts">
import {
	VDataColumn,
	VDataGridStateType,
	VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import VLabel from "@/components/VLabel/VLabel.vue";
import { computed, inject } from "vue";

const props = defineProps<{
	data: VDataRow;
	column: VDataColumn;
	index: number;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { lockedColumnsMap } = state!;

const lockedStyle = computed(
	() =>
		`position: sticky; left:${lockedColumnsMap.value.get(props.column.id)}px`
);
</script>

<style scoped></style>
