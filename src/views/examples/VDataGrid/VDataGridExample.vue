<template>
	<ComponentExampleTemplate title="VDataGrid" component-name="VDataGrid">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" example="">
				<VDataGrid
					:columns="columns"
					:rows="rows"
					default-sort-direction="desc"
					default-sort-key="col1"
				>
				</VDataGrid>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDataGrid from "@/components/VDataGrid/VDataGrid.vue";
import { VDataColumn, VDataRow } from "@/components/VDataGrid/VDataGridTypes";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { VDataType } from "../../../components/VDataGrid/VDataGridTypes";

const columnsAmount = 17;
const values = Array.from(Array(8)).map((_, i) => ({
	id: "user" + i,
	name: "user" + Math.floor(Math.random() * Date.now()).toString(36),
}));

const getType = (index: number): VDataType | undefined => {
	if (
		index % columnsAmount === columnsAmount - 2 ||
		index % columnsAmount === columnsAmount - 1
	) {
		return VDataType.BOOLEAN;
	} else if (index % columnsAmount === columnsAmount - 6) {
		return VDataType.EDITABLE_BOOLEAN;
	} else if (index % columnsAmount === columnsAmount - 8) {
		return VDataType.DROPDOWN;
	}
	return undefined;
};

const columns: VDataColumn[] = Array.from(Array(columnsAmount)).map((_, i) => ({
	id: "col" + i,
	label: "col-" + i,
	formatter:
		i === columnsAmount - 8
			? (value: any) => value.name
			: (value: any) => value,
	size:
		Math.round(Math.random() * 10) >= 0
			? {
					min: 100,
					max: 400,
					initial: 200 - Math.round(Math.random() * 200),
			  }
			: undefined,
	locked: i === 0 || i === 1,
	type: getType(i),
	editable: Math.round(Math.random() * 10) >= 4 || i === columnsAmount - 8,
	editor:
		i === columnsAmount - 8
			? {
					type: VDataType.DROPDOWN,
					values: values,
			  }
			: undefined,
}));

const rows = Array.from(Array(30)).map((_, i) => {
	let row: VDataRow = {
		id: "row-" + i,
	};

	columns.forEach((column: VDataColumn) => {
		if (column.type !== undefined) {
			if (column.type === VDataType.DROPDOWN) {
				row[column.id] = values[Math.floor(Math.random() * values.length)];
			} else {
				row[column.id] = Math.round(Math.random()) === 0 ? true : false;
			}
		} else {
			row[column.id] = Math.floor(Math.random() * Date.now()).toString(36);
		}
	});

	return row;
});
</script>
