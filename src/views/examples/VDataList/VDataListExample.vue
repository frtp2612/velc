<template>
	<div class="grid grid-cols-2 gap-6 p-6 h-96">
		<VDataList :items="firstList" :columns="columns" :item-height="30">
		</VDataList>
	</div>
	<VButton :on-click="filterList">Filter elements</VButton>
</template>

<script lang="ts" setup>
import VButton from "@/components/VButton/index";
import VDataList from "@/components/VDataList/VDataList.vue";
import { computed, ref } from "vue";
import {
	TranslationType,
	VDataColumn,
	VDataRow,
	VDataType,
} from "../../../enums/index";

const columnsAmount = 3;

const getType = (index: number): VDataType | undefined => {
	if (index === columnsAmount - 1) {
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
			: i === columnsAmount - 1
			? (value: any) => (value ? "fa-check" : undefined)
			: (value: any) => value,
	size:
		Math.round(Math.random() * 10) >= 0
			? {
					min: 100,
					initial: 200 - Math.round(Math.random() * 200),
			  }
			: undefined,
	dataType: getType(i),
	editable:
		Math.round(Math.random() * 10) >= 4 ||
		i === columnsAmount - 8 ||
		i === columnsAmount - 9 ||
		i === columnsAmount - 6,
	editor:
		i === columnsAmount - 9
			? {
					type: VDataType.DATE,
			  }
			: undefined,
}));

const list1 = ref<VDataRow[]>(
	Array.from(Array(5)).map((_, i) => {
		let row: VDataRow = {
			id: i,
		};

		columns.forEach((column: VDataColumn) => {
			if (column.dataType !== undefined) {
				if (column.dataType === VDataType.DATE) {
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

const filter = ref(false);

const firstList = computed<VDataRow[]>(() =>
	filter.value ? list1.value.filter((_, i: number) => i % 2 === 0) : list1.value
);

function filterList() {
	filter.value = !filter.value;
}
</script>
