<template>
	<div class="flex flex-col gap-4 min-h-0 min-w-0 h-full w-full">
		<!--GRID LEADING CONTENT-->
		<div v-if="$slots.header">
			<slot name="header" />
		</div>
		<div
			class="relative min-h-0 flex flex-col h-full bg-color-bg border border-color-border-200"
			ref="listContainer"
			tabindex="-1"
		>
			<!-- GRID CONTENT -->
			<VirtualScroller
				:item-height="32"
				:items="data"
				:wrapper-class="initialized ? 'w-fit' : ''"
				ref="content"
				v-if="listInitialized || parentVisible"
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
						<VDataListColumn
							:data="{
								id: 'select-all',
								label: { type: TranslationType.RAW, value: '' },
								dataType: VDataType.EDITABLE_BOOLEAN,
							}"
							:formatter="columnFormatter || textFormatter"
							:translator="i18n"
							class="px-3 leading-[32px]"
						/>
						<VDataListColumn
							v-for="(column, index) in columns"
							:data="column"
							:index="index"
							:formatter="columnFormatter || textFormatter"
							:translator="i18n"
							class="px-3 leading-[32px]"
						/>
					</div>
				</template>
				<!-- GRID ROWS -->
				<template v-slot="{ item, index, height }">
					<VDataListRow
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
import { textFormatter } from "@/formatters";
import { watchOnce } from "@vueuse/core";
import { computed, inject, onMounted, provide, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
	Translatable,
	TranslationType,
	VDataColumn,
	VDataListEmits,
	VDataRow,
	VDataType,
} from "../../enums/index";
import VDataListColumn from "./VDataListColumn.vue";
import VDataListRow from "./VDataListRow.vue";
import { VDataListState } from "./VDataListState";

const props = withDefaults(
	defineProps<{
		items: VDataRow[];
		itemHeight: number;
		columns: VDataColumn[];
		defaultSortKey?: string;
		defaultSortDirection?: string;
		columnFormatter?: (value: Translatable, translator: any) => string;
	}>(),
	{
		items: Array,
	}
);

const emit = defineEmits<VDataListEmits>();

const listInitialized = ref(false);

const i18n = useI18n();

const listContainer = ref<HTMLElement | null>(null);
const columnsContainer = ref<HTMLElement | null>(null);
const content = ref<InstanceType<typeof VirtualScroller> | null>(null);

const columnsGridLayout = computed(() =>
	props.columns ? `auto repeat(${props.columns.length}, 1fr)` : ""
);

const state = VDataListState(
	computed(() => props.items),
	computed(() => props.columns),
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

function initList() {
	requestAnimationFrame(() => {
		if (listContainer.value !== null && columnsContainer.value !== null) {
			state.init(listContainer.value!, columnsContainer.value!);
			listInitialized.value = true;
		}
	});
}

watchOnce(
	() => parentVisible.value,
	() => {
		if (parentVisible.value && !listInitialized.value) {
			initList();
		}
	}
);

onMounted(() => {
	if (parentVisible.value) {
		initList();
	}
});
</script>
