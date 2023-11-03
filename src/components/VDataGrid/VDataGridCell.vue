<template>
	<div
		:style="column.locked ? lockedStyle : ''"
		class="flex leading-[31px] border-b border-r-theme-bg-100 border-r outline-0 p-[1px] relative max-w-full"
		:class="[cellClass, { 'z-[1]': column.locked }]"
		@click="selectCell"
		@dblclick="startEdit"
		tabindex="-1"
	>
		<input
			type="checkbox"
			v-model="data[column.id]"
			v-if="isEditableBoolean"
			class="w-full py-2 px-2 h-3.5 self-center"
			:id="cellId"
			tabindex="-1"
		/>
		<VDataEditor
			:type="column.type"
			:values="column.editor?.values"
			:formatter="column.formatter"
			:id="cellId"
			v-model="data[column.id]"
			:value-getter="() => data[column.id]"
			v-else-if="editable && editingCell"
			tabindex="0"
			ref="editor"
		/>
		<div
			class="grid w-full items-center justify-items-center"
			v-else-if="isBoolean"
		>
			<font-awesome-icon
				:icon="formattedValue"
				class="w-4 h-4"
				v-if="formattedValue"
			/>
		</div>
		<VLabel
			class="px-2 w-full overflow-hidden overflow-ellipsis whitespace-nowrap"
			:class="[
				editable ? 'hover:outline outline-theme-secondary-500 outline-1' : '',
			]"
			v-else
		>
			{{ formattedValue }}
		</VLabel>
	</div>
</template>

<script setup lang="ts">
import {
	VDataColumn,
	VDataGridStateType,
	VDataRow,
	VDataType,
} from "@/components/VDataGrid/VDataGridTypes";
import VLabel from "@/components/VLabel/VLabel.vue";
import { onClickOutside } from "@vueuse/core";
import { computed, inject, ref } from "vue";
import VDataEditor from "./VDataEditor.vue";

const props = defineProps<{
	data: VDataRow;
	column: VDataColumn;
	editable: boolean;
}>();

const state: VDataGridStateType | undefined = inject("state");

const { lockedColumnsMap, changeSelectedCell, selectedCellId, editMode } =
	state!;

const editor = ref<HTMLElement | null>(null);

onClickOutside(editor, () =>
	requestAnimationFrame(() => (editMode.value = false))
);

const cellId = computed(() => `${props.data.id}-${props.column.id}`);

const lockedStyle = computed(
	() =>
		`position: sticky; left:${lockedColumnsMap.value.get(props.column.id)}px`
);

const cellClass = computed(() => {
	let value = `cell-${cellId.value} `;

	if (props.column.locked && selectedCellId.value !== cellId.value) {
		value += "bg-inherit";
	} else if (selectedCellId.value === cellId.value) {
		value += "bg-theme-primary-300";
	}

	return value;
});

const editingCell = computed(
	() => editMode.value && selectedCellId.value === cellId.value
);

const isBoolean =
	props.column.type !== undefined &&
	(props.column.type as VDataType) === VDataType.BOOLEAN;
const isEditableBoolean =
	props.column.type !== undefined &&
	(props.column.type as VDataType) === VDataType.EDITABLE_BOOLEAN;

const formattedValue = computed(() => {
	if (props.column.type !== undefined) {
		if (isBoolean) return props.data[props.column.id] ? "fa-check" : undefined;
	}

	return props.column.formatter
		? props.column.formatter(props.data[props.column.id])
		: props.data[props.column.id];
});

function selectCell() {
	changeSelectedCell(props.data.id, props.column.id, cellId.value);
}

function startEdit() {
	selectCell();
	if (!isEditableBoolean && !isBoolean) {
		editMode.value = true;
	}
}
</script>

<style scoped></style>
