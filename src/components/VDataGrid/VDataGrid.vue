<template>
	<div class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full">
		<!--GRID LEADING CONTENT-->
		<div v-if="$slots.header">
			<slot name="header" />
		</div>
		<div
			class="relative min-h-0 flex flex-col h-full bg-color-bg border border-color-border-200"
			ref="tableContainer"
			tabindex="-1"
		>
			<!-- GRID CONTENT -->
			<VirtualScroller
				:item-height="32"
				:items="data"
				:wrapper-class="initialized ? 'w-fit' : ''"
				ref="content"
				v-if="gridInitialized || parentVisible"
			>
				<template #prepend>
					<!-- GRID HEADER -->
					<div
						class="sticky grid top-0 bg-color-bg-50 z-10 border-b border-color-border-200"
						:class="{ 'w-fit': initialized }"
						:style="{
							gridTemplateColumns: columnsLayout || columnsGridLayout,
						}"
						ref="columnsContainer"
					>
						<VDataGridColumn
							v-for="(column, index) in columns"
							:data="column"
							:index="index"
							:formatter="columnFormatter || textFormatter"
							:translator="translator || i18n"
							class="px-3 leading-[32px]"
						/>
					</div>
				</template>
				<!-- GRID ROWS -->
				<template v-slot="{ item, index, height }">
					<VDataGridRow
						:data="item"
						:index="index"
						:cellHeight="`${height - 1}px`"
						:style="[
							{
								height: `${height}px`,
								gridTemplateColumns: columnsLayout || columnsGridLayout,
							},
						]"
						@dblclick="emit('rowDoubleClick', item)"
					/>
				</template>
			</VirtualScroller>
			<!--GRID TRAILING CONTENT-->
		</div>
	</div>
</template>

<script lang="ts" setup>
import VirtualScroller from "@/components/VirtualScroller/VirtualScroller.vue";
import { VDataColumn, VDataGridEmits, VDataRow } from "@/enums";
import { textFormatter } from "@/formatters/index";
import { clamp, watchOnce } from "@vueuse/core";
import { computed, inject, onMounted, provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Translatable } from "../../enums/index";
import VDataGridColumn from "./VDataGridColumn.vue";
import VDataGridRow from "./VDataGridRow.vue";
import VDataGridState from "./VDataGridState";

const props = withDefaults(
	defineProps<{
		columns: VDataColumn[];
		rows?: VDataRow[];
		defaultSortKey?: string;
		defaultSortDirection?: string;
		columnFormatter?: (value: Translatable, translator: any) => string;
		translator?: any;
	}>(),
	{
		rows: Array,
	}
);

const emit = defineEmits<VDataGridEmits>();

const gridInitialized = ref(false);

const i18n = useI18n();

const tableContainer = ref<HTMLElement | null>(null);
const columnsContainer = ref<HTMLElement | null>(null);
const content = ref<InstanceType<typeof VirtualScroller> | null>(null);

const columnsGridLayout = computed(() =>
	props.columns ? `repeat(${props.columns.length}, 1fr)` : ""
);

const state = VDataGridState(
	computed(() => props.rows),
	props.columns,
	props.defaultSortKey,
	props.defaultSortDirection,
	emit
);

const {
	initialized,
	columnsLayout,
	data,
	resetSelection,
	selectedRowId,
	changeSelectedCell,
	toggleEdit,
} = state;

provide("state", state);
const parentVisible = inject("parentVisible", ref(true));

defineExpose({
	rows: data,
	rowsWrapper: content.value?.itemsWrapper,
	scrollTo: (value: number) => {
		value = clamp(value, 0, data.value.length - 1);

		content.value?.scrollToIndex(value);
		changeSelectedCell(data.value[value].id, props.columns[0].id);
	},
	resetSelection,
	changeSelectedCell,
	toggleEdit,
	selectedRowId,
});

watch(
	() => props.rows.length,
	() => {
		state.updateRows(props.rows);
	}
);

watchOnce(
	() => parentVisible.value,
	() => {
		if (parentVisible.value && !gridInitialized.value) {
			requestAnimationFrame(() => {
				if (tableContainer.value !== null && columnsContainer.value !== null) {
					state.init(tableContainer.value!, columnsContainer.value!);
					gridInitialized.value = true;
				}
			});
		}
	}
);

onMounted(() => {
	if (parentVisible.value) {
		requestAnimationFrame(() => {
			if (tableContainer.value !== null && columnsContainer.value !== null) {
				state.init(tableContainer.value!, columnsContainer.value!);
				gridInitialized.value = true;
			}
		});
	}
});
</script>
