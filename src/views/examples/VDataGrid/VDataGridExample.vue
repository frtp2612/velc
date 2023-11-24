<template>
	<ComponentExampleTemplate title="VDataGrid" component-name="VDataGrid">
		<template #usage>
			<ComponentExampleBlockTemplate title="Example 1" example="">
				<div class="flex flex-col min-w-0 h-full gap-2">
					<div class="flex gap-4">
						<VButton :on-click="addRow" :type="VButtonTypes.PRIMARY"
							>Add</VButton
						>
						<VButton :on-click="() => (filterOdd = !filterOdd)"
							>Filter odd</VButton
						>
						<VNumericField
							id="jump-to"
							@update:model-value="(value: number) => table!.scrollTo(value)"
						/>
					</div>
					<VTabbedView>
						<VTabPanel title="Tab 1"> </VTabPanel>
						<VTabPanel title="Data grid">
							<VDataGrid :columns="columns" :rows="filteredRows" ref="table">
							</VDataGrid>
						</VTabPanel>
					</VTabbedView>
				</div>
			</ComponentExampleBlockTemplate>
		</template>
	</ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDataGrid from "@/components/VDataGrid/VDataGrid.vue";
import VNumericField from "@/components/VNumericField/VNumericField.vue";
import VTabbedView, { VTabPanel } from "@/components/VTabbedView/index";
import { VButtonTypes, VDataColumn, VDataRow, VDataType } from "@/enums";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { computed, ref } from "vue";
import VButton from "../../../components/VButton/index";
import { TranslationType } from "../../../enums/index";

const table = ref<InstanceType<typeof VDataGrid> | null>(null);
const filterOdd = ref(false);

const columnsAmount = 20;
const values = Array.from(Array(8)).map((_, i) => ({
	id: "user" + i,
	name: "user" + Math.floor(Math.random() * Date.now()).toString(36),
}));

const getType = (index: number): VDataType | undefined => {
	if (index === columnsAmount - 2 || index === columnsAmount - 1) {
		return VDataType.BOOLEAN;
	} else if (index === columnsAmount - 6) {
		return VDataType.EDITABLE_BOOLEAN;
	} else if (index === columnsAmount - 8) {
		return VDataType.SELECT;
	} else if (index === columnsAmount - 9) {
		return VDataType.DATE;
	}
	return undefined;
};

const columns: VDataColumn[] = Array.from(Array(columnsAmount)).map((_, i) => ({
	id: "col" + i,
	label: {
		type: TranslationType.RAW,
		value: "col-" + i,
	},
	valueFormatter:
		i === columnsAmount - 8
			? (value: any) => (value ? value.name : "")
			: i === columnsAmount - 2 || i === columnsAmount - 1
			? (value: any) => (value ? "fa-check" : undefined)
			: (value: any) => value,
	size:
		Math.round(Math.random() * 10) >= 0
			? {
					min: 100,
					initial: 200 - Math.round(Math.random() * 200),
			  }
			: undefined,
	locked: i === 0 || i === 1,
	dataType: getType(i),
	editable:
		Math.round(Math.random() * 10) >= 4 ||
		i === columnsAmount - 8 ||
		i === columnsAmount - 9 ||
		i === columnsAmount - 6,
	editor:
		i === columnsAmount - 8
			? {
					type: VDataType.SELECT,
					values: values,
			  }
			: i === columnsAmount - 9
			? {
					type: VDataType.DATE,
			  }
			: undefined,
}));

const rows = ref(
	Array.from(Array(100)).map((_, i) => {
		let row: VDataRow = {
			id: i,
		};

		columns.forEach((column: VDataColumn) => {
			if (column.dataType !== undefined) {
				if (column.dataType === VDataType.SELECT) {
					row[column.id] = values[Math.floor(Math.random() * values.length)];
				} else if (column.dataType === VDataType.DATE) {
					row[column.id] =
						Math.round(Math.random()) === 0 ? new Date() : undefined;
				} else {
					row[column.id] = Math.round(Math.random()) === 0 ? true : false;
				}
			} else {
				row[column.id] =
					i !== 0 ? Math.floor(Math.random() * Date.now()).toString(36) : "";
			}
		});

		return row;
	})
);

function addRow() {
	rows.value.push(rowToAdd[0]);
}

const rowToAdd = Array.from(Array(1)).map((_, i) => {
	let row: VDataRow = {
		id: i + rows.value.length,
	};

	columns.forEach((column: VDataColumn) => {
		if (column.dataType !== undefined) {
			if (column.dataType === VDataType.SELECT) {
				row[column.id] = values[Math.floor(Math.random() * values.length)];
			} else if (column.dataType === VDataType.DATE) {
				row[column.id] =
					Math.round(Math.random()) === 0 ? new Date() : undefined;
			} else {
				row[column.id] = Math.round(Math.random()) === 0 ? true : false;
			}
		} else {
			row[column.id] = Math.floor(Math.random() * Date.now()).toString(36);
		}
	});

	return row;
});

const filteredRows = computed(() => {
	const filter = rows.value.filter((_row: VDataRow, index: number) =>
		filterOdd.value ? index % 2 === 0 : true
	);
	return filter;
});

// const rowsFromTable = computed(() => table.value?.rows);
</script>
