<template>
	<ComponentExampleTemplate title="VDataGrid" component-name="VDataGrid">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" example="">
				<VDataGrid :columns="columns" :rows="rows"> </VDataGrid>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDataGrid from "@/components/VDataGrid/VDataGrid.vue";
import { VDataColumn, VDataRow } from "@/components/VDataGrid/VDataGridTypes";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const columns: VDataColumn[] = Array.from(Array(17)).map((_, i) => ({
	id: "col" + i,
	label: "col-" + i,
	formatter: (value: VDataRow) => value.id,
	size:
		Math.round(Math.random() * 10) >= 0
			? {
					min: 100,
					max: 400,
					initial: 200 - Math.round(Math.random() * 200),
			  }
			: undefined,
	locked: i === 0 || i === 1,
}));
const rows = Array.from(Array(1000)).map((_, i) => {
	let row: VDataRow = {
		id: "row-" + i,
	};

	columns.forEach(
		(column: VDataColumn) =>
			(row[column.id] = Math.floor(Math.random() * Date.now()).toString(36))
	);

	return row;
});
</script>
