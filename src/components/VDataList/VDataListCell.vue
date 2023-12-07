<template>
	<div
		class="flex border-r-color-border-50 border-r relative max-w-full h-full"
		:class="[cellClass]"
		tabindex="-1"
	>
		<VDataEditor
			:type="column.dataType"
			:values="column.editor?.values"
			:formatter="column.valueFormatter"
			:id="cellId"
			v-model="data[column.id]"
			v-if="editable && editMode"
			auto-focus
			tabindex="0"
			ref="editor"
		/>
		<div
			class="grid w-full items-center justify-items-center"
			v-else-if="isBoolean"
			@click="selectCell"
		>
			<font-awesome-icon
				:icon="formattedValue"
				class="w-4 h-4"
				v-if="formattedValue"
			/>
		</div>
		<VLabel
			class="px-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-inherit"
			:class="[editable ? '' : '', { 'text-right': isNumber }]"
			v-else
			@click="selectCell"
			@contextmenu="selectCell"
		>
			{{ formattedValue }}
		</VLabel>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/VLabel.vue";
import { VDataColumn, VDataGridStateType, VDataRow, VDataType } from "@/enums";
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import VDataEditor from "../VDataEditor/VDataEditor.vue";

const props = defineProps<{
	data: VDataRow;
	column: VDataColumn;
	editable: boolean;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { n, d } = useI18n();

const { changeSelectedCell, selectedCellId, editMode } = state!;

const editor = ref<HTMLElement | null>(null);

const cellId = computed(() => `${props.data.id}-${props.column.id}`);

const cellClass = computed(() => {
	let value = `cell-${cellId.value} `;

	if (selectedCellId.value === cellId.value) {
		value += "bg-color-secondary-200 ";
	}

	if (props.data.options) {
		if (props.data.options.lighten) {
			value += "lighten-text ";
		}
	}

	return value;
});

const isBoolean =
	props.column.dataType !== undefined &&
	(props.column.dataType as VDataType) === VDataType.BOOLEAN;

const isNumber =
	props.column.dataType !== undefined &&
	(props.column.dataType as VDataType) === VDataType.NUMBER;

const isDate =
	props.column.dataType !== undefined &&
	(props.column.dataType as VDataType) === VDataType.DATE;

const formattedValue = computed(() => {
	if (props.data.options?.filler) {
		return "";
	}

	if (props.column.valueFormatter) {
		return props.column.valueFormatter(props.data[props.column.id]);
	}

	if (props.column.dataType !== undefined) {
		if (isBoolean) return props.data[props.column.id] ? "fa-check" : undefined;
		if (isNumber) return n(props.data[props.column.id]);
		if (isDate)
			return props.data[props.column.id] && props.data[props.column.id] !== null
				? d(props.data[props.column.id])
				: null;
	}

	return props.data[props.column.id];
});

function selectCell() {
	changeSelectedCell(props.data.id, props.column.id, cellId.value);
}
</script>

<style scoped></style>
