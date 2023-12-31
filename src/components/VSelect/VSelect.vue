<template>
	<div class="relative inline-block max-w-full">
		<div ref="dropdown" class="h-full flex items-center" @click="toggle">
			<slot :selection="formattedSelectedItem">
				<component :is="rawComponent" v-if="rawComponent" />
				<VTextField
					:id="id"
					:model-value="formattedSelectedItem"
					custom-class="input-base !pl-9"
					class="w-full group"
					autocomplete="off"
					v-else
				>
					<template #right>
						<font-awesome-icon
							icon="fa-xmark"
							class="cursor-pointer w-5 aspect-square absolute top-1/2 -translate-y-1/2 right-0 px-2 text-color-text-500 hover:text-color-text"
							@click.capture.stop="resetSelection"
							v-if="selectedItem"
						/>
						<font-awesome-icon
							icon="fa-angle-down"
							class="cursor-pointer w-5 aspect-square absolute top-1/2 -translate-y-1/2 left-0 px-2 text-color-text-500 group-hover:text-color-text"
						/>
					</template>
				</VTextField>
			</slot>
		</div>

		<Teleport to="body" :disabled="!open || preventAppend">
			<slot :items="filteredItems" name="items">
				<div
					class="absolute z-[10000] left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 w-max bg-color-bg"
					:class="{ 'min-w-full': preventAppend }"
					v-show="open"
					ref="dropdownPopup"
				>
					<VirtualScroller :items="filteredItems" :item-height="30" :id="id">
						<template v-slot="{ item }">
							<div
								class="px-2 overflow-ellipsis whitespace-nowrap h-full cursor-pointer flex items-center"
								:class="[
									selectedItem &&
									(selectedItem === item ||
										(typeof selectedItem === 'object' &&
											deepEqual(item, selectedItem)))
										? 'bg-color-primary text-color-text-50 '
										: 'hover:bg-color-bg-50',
								]"
								@click.prevent.capture="changeSelection(item)"
							>
								<ItemTest :item="item" :formatter="formatter"></ItemTest>
							</div>
						</template>
					</VirtualScroller>
				</div>
			</slot>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import VTextField from "@/components/VTextField/VTextField.vue";
import { onClickOutside, useVModel } from "@vueuse/core";
import {
	RendererElement,
	computed,
	markRaw,
	onMounted,
	onUnmounted,
	ref,
} from "vue";
import { useAutoPopDirection } from "../../composables/UseAutoPopDirection";
import { deepEqual } from "../../utilities/index";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
	id: string;
	values: any[];
	modelValue?: any;
	formatter?: Function;
	autoFocus?: boolean;
	component?: RendererElement;
	preventAppend?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedItem = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: null,
		  }
);

const rawComponent = props.component ? markRaw(props.component) : undefined;

const searchTerm = ref("");
const filter = ref("");
const open = ref(false);
const timer = ref();

const dropdown = ref<HTMLElement | null>(null);
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
		document.addEventListener("keyup", inputListener);
		if (!props.preventAppend && dropdownPopup.value && dropdown.value) {
			useAutoPopDirection(dropdown.value, dropdownPopup.value);
			dropdownPopup.value.style.width =
				dropdown.value.getBoundingClientRect().width + "px";
		}
	} else {
		reset();
	}
}

function reset() {
	document.removeEventListener("keyup", inputListener);
	searchTerm.value = "";
	filter.value = "";
}

function changeSelection(item: any) {
	selectedItem.value = item;
	reset();
}

function inputListener(event: KeyboardEvent) {
	const name = event.key;
	const code = event.code;

	if (event.shiftKey || name === "Control" || name === "Tab") {
		return;
	}

	if (event.ctrlKey) {
		console.log(`Combination of ctrlKey + ${name} \n Key code Value: ${code}`);
	} else {
		if (code === "Backspace") {
			searchTerm.value = searchTerm.value.slice(0, -1);
		} else {
			searchTerm.value += event.key;
		}

		filter.value = searchTerm.value;
	}

	clearTimeout(timer.value);
	startTimer();
}

const filteredItems = computed(() =>
	props.values.filter((value: any) =>
		props.formatter
			? props.formatter(value).includes(filter.value)
			: value.includes(filter.value)
	)
);

const formattedSelectedItem = computed(() =>
	props.formatter ? props.formatter(selectedItem.value) : selectedItem.value
);

function resetSelection() {
	selectedItem.value = null;
}

onMounted(() => {
	if (props.autoFocus) {
		toggle();
	}
});

onUnmounted(() => {
	document.removeEventListener("keyup", inputListener);
});

// watch(
// 	() => props.modelValue,
// 	() => {
// 		console.log("model value changed in", props.id);
// 	}
// );

// watch(
// 	() => props.formatter,
// 	() => {
// 		console.log("formatter value changed in", props.id);
// 	}
// );

// watch(
// 	() => props.id,
// 	() => {
// 		console.log("id value changed in", props.id);
// 	}
// );

// watch(props, (current: any, old: any) => {
// 	console.log("current", current);
// 	console.log("old", old);

// 	console.log("value changed in ", props.id);
// });
</script>
