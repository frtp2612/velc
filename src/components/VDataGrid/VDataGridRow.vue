<template>
	<div class="grid h-full relative bg-theme-bg hover:bg-theme-bg-50">
		<template v-for="(column, index) in columns">
			<VDataGridCell
				:column="column"
				:index="index"
				:data="data"
				:class="[column.locked ? 'bg-inherit' : ' ']"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import {
	VDataGridStateType,
	VDataRow,
} from "@/components/VDataGrid/VDataGridTypes";
import { inject } from "vue";
import VDataGridCell from "./VDataGridCell.vue";

defineProps<{
	data: VDataRow;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { columns } = state!;
</script>
