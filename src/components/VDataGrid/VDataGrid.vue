<template>
	<div
		class="flex flex-col border bg-color-bg border-color-border-200 min-h-0 min-w-0 h-full w-full overflow-auto"
	>
		<div class="relative min-h-0 flex flex-col h-full" ref="tableContainer">
			<!--GRID LEADING CONTENT-->

			<!-- GRID CONTENT -->
			<VirtualScroller
				:item-height="34"
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
import { computed, onMounted, provide, ref } from "vue";
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
	computed(() => props.rows),
	props.columns,
	props.defaultSortKey,
	props.defaultSortDirection,
	emit
);

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
