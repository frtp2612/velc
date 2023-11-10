<template>
	<div
		class="flex flex-col p-2 gap-2 bg-color-bg min-h-0 min-w-0 h-full w-full rounded-lg overflow-hidden border border-color-border-100"
	>
		<!--GRID LEADING CONTENT-->
		<div v-if="$slots.header">
			<slot name="header" />
		</div>
		<div
			class="relative min-h-0 flex flex-col h-full border border-color-border-200"
			ref="tableContainer"
		>
			<!-- GRID CONTENT -->
			<VirtualScroller
				:item-height="35"
				:items="data"
				:wrapper-class="initialized ? 'w-fit' : ''"
				ref="content"
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
				<template v-slot="{ item, index }">
					<VDataGridRow
						:data="item"
						:index="index"
						:style="{
							gridTemplateColumns: columnsLayout || columnsGridLayout,
						}"
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
import {
	ExplicitTranslationValue,
	KeyTranslationValue,
	RawTranslationValue,
	TranslationType,
	VDataColumn,
	VDataGridEmits,
	VDataRow,
} from "@/enums";
import { textFormatter } from "@/formatters/index";
import { computed, onMounted, provide, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import VDataGridColumn from "./VDataGridColumn.vue";
import VDataGridRow from "./VDataGridRow.vue";
import VDataGridState from "./VDataGridState";

const i18n = useI18n();

const props = withDefaults(
	defineProps<{
		columns: Array<VDataColumn>;
		rows: Array<VDataRow>;
		defaultSortKey?: string;
		defaultSortDirection?: string;
		columnFormatter?: (
			value: {
				type: TranslationType;
				value:
					| ExplicitTranslationValue
					| KeyTranslationValue
					| RawTranslationValue;
			},
			translator: any
		) => string;
		translator?: any;
	}>(),
	{}
);

const emit = defineEmits<VDataGridEmits>();

const columnsGridLayout = computed(
	() => `repeat(${props.columns.length}, 1fr)`
);

const state = VDataGridState(
	props.rows,
	props.columns,
	props.defaultSortKey,
	props.defaultSortDirection,
	emit
);

watchEffect(() => {
	state.updateRows(props.rows);
});

const { initialized, columnsLayout, data } = state;

const tableContainer = ref<HTMLElement | null>(null);
const columnsContainer = ref<HTMLElement | null>(null);
const content = ref<InstanceType<typeof VirtualScroller> | null>(null);

provide("state", state);

defineExpose({
	rows: data,
	scrollTo: (value: number) => {
		content.value?.scrollToIndex(value);
	},
});

onMounted(() => {
	if (
		tableContainer.value !== null &&
		columnsContainer.value !== null &&
		content.value !== null
	) {
		requestAnimationFrame(() =>
			state.init(
				tableContainer.value!,
				columnsContainer.value!,
				content.value!.container!
			)
		);
	}
});
</script>
