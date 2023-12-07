<template>
	<div class="grid relative border-b border-color-border-50" :class="rowClass">
		<div
			class="flex border-r-color-border-50 border-r relative max-w-full h-full"
			tabindex="-1"
		>
			<VCheckBox
				type="checkbox"
				:model-value="selectedRowsMap.get(data.id)"
				class="w-full h-full self-center"
				@update:model-value="(newValue: boolean) => onRowSelectionChanged(data.id, newValue)"
				:id="`${data.id}-select`"
				tabindex="0"
			/>
		</div>
		<template v-for="column in columns" :key="`${data.id}-${column.id}`">
			<VDataListCell
				:column="column"
				:data="data"
				:editable="column.editable || false"
				:style="{
					lineHeight: cellHeight,
				}"
			/>
		</template>
	</div>
</template>

<script setup lang="ts">
import VCheckBox from "@/components/VCheckBox/index";
import { VDataListStateType, VDataRow } from "@/enums";
import { computed, inject } from "vue";
import VDataListCell from "./VDataListCell.vue";

const props = defineProps<{
	data: VDataRow;
	index: number;
	cellHeight: string;
}>();

const state: VDataListStateType | undefined = inject("state");

const { columns, selectedRowId, selectedRowsMap, onRowSelectionChanged } =
	state!;

const rowClass = computed(() =>
	selectedRowId.value === props.data.id
		? "bg-color-bg-50 hover:bg-color-bg-100"
		: "bg-color-bg hover:bg-color-bg-50"
);
</script>
