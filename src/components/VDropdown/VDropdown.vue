<template>
	<div class="relative inline-block max-w-full">
		<div ref="dropdown" @click="toggle">
			<slot>
				<VButton icon-right="fa-angle-down" :type="VButtonTypes.PRIMARY">
					<VLabel class="text-color-text">{{ label }}</VLabel>
				</VButton>
			</slot>
		</div>

		<Teleport to="body" :disabled="!appendTo">
			<div
				class="absolute z-50 left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 min-w-[16rem] w-max max-w-max bg-color-bg overflow-auto"
				v-show="open"
				ref="dropdownPopup"
			>
				<div
					v-for="item in filteredItems"
					class="px-2 hover:bg-color-bg-100 overflow-ellipsis whitespace-nowrap h-full cursor-pointer flex items-center"
				>
					<ItemTest :item="item" :formatter="formatter"></ItemTest>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { useAutoPopDirection } from "@/composables/UseAutoPopDirection";
import { VButtonTypes } from "@/enums/index";
import { onClickOutside } from "@vueuse/core";
import { RendererElement, computed, onMounted, ref } from "vue";
import { PopAlignment } from "../../composables/UseAutoPopDirection";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
	values: any[];
	modelValue?: any;
	label?: string;
	formatter?: Function;
	appendTo?: string | RendererElement;
	autoFocus?: boolean;
	component?: RendererElement;
	align?: PopAlignment;
}>();

const emit = defineEmits(["update:modelValue"]);

const searchTerm = ref("");
const filter = ref("");
const open = ref(false);
const timer = ref();

const dropdown = ref(null);
const dropdownPopup = ref<HTMLElement | null>(null);

onClickOutside(dropdown, () => {
	open.value = false;
});

function startTimer() {
	timer.value = setTimeout(() => {
		searchTerm.value = "";
	}, 2000);
}

function toggle() {
	open.value = !open.value;

	if (open.value) {
		startTimer();
		requestAnimationFrame(() => {
			if (dropdownPopup.value && dropdown.value && props.appendTo) {
				useAutoPopDirection(dropdown.value, dropdownPopup.value, undefined, {
					align: props.align,
				});
			}
		});
	} else {
		reset();
	}
}

function reset() {
	searchTerm.value = "";
	filter.value = "";
}

const filteredItems = computed(() =>
	props.values.filter((value: any) =>
		props.formatter
			? props.formatter(value).includes(filter.value)
			: value.includes(filter.value)
	)
);

onMounted(() => {
	if (props.autoFocus) {
		toggle();
	}
});
</script>
