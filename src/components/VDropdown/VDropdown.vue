<template>
	<div class="relative max-w-full">
		<div ref="dropdown" @click="toggle">
			<slot :events="{ toggle }" :selection="formattedSelectedItem">
				<VButton
					><VLabel class="text-theme-text">{{ formattedSelectedItem }}</VLabel>
					<template #right>
						<font-awesome-icon
							icon="fa-angle-down"
							class="h-4 w-4 text-theme-text"
						/>
					</template>
				</VButton>
			</slot>
		</div>

		<Teleport to="body" :disabled="!appendTo">
			<slot :items="filteredItems" name="item">
				<div
					class="absolute z-50 left-0 top-full border border-slate-100 shadow-sm flex flex-col max-h-32 min-w-[16rem] w-max max-w-max bg-white"
					v-show="open"
					ref="dropdownPopup"
				>
					<VirtualScroller :items="filteredItems" :item-height="30">
						<template v-slot="{ item }">
							<div
								class="px-2 hover:bg-blue-200 overflow-ellipsis whitespace-nowrap h-full"
								:class="[
									selectedItem &&
									(selectedItem === item || selectedItem.id === item.id)
										? 'bg-blue-300'
										: '',
								]"
								@click.prevent.capture="changeSelection(item)"
							>
								<KeepAlive>
									<ItemTest :item="item" :formatter="formatter"></ItemTest>
								</KeepAlive>
							</div>
						</template>
					</VirtualScroller>
				</div>
			</slot>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { onClickOutside, useVModel } from "@vueuse/core";
import { RendererElement, computed, onMounted, onUnmounted, ref } from "vue";
import { useAutoPopDirection } from "../../composables/UseAutoPopDirection";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
	values: any[];
	modelValue?: any;
	formatter?: Function;
	appendTo?: string | RendererElement;
	autoFocus?: boolean;
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
		  }
);

const searchTerm = ref("");
const filter = ref("");
const open = ref(false);
const timer = ref();

const dropdown = ref(null);
const dropdownPopup = ref<HTMLElement | null>(null);

onClickOutside(dropdown, () => (open.value = false));

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
		requestAnimationFrame(() => {
			if (dropdownPopup.value && dropdown.value && props.appendTo) {
				useAutoPopDirection(dropdown.value, dropdownPopup.value);
			}
		});
	} else {
		document.removeEventListener("keyup", inputListener);
		searchTerm.value = "";
		filter.value = "";
	}
}

function changeSelection(item: any) {
	selectedItem.value = item;
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

onMounted(() => {
	if (props.autoFocus) {
		toggle();
	}
});

onUnmounted(() => {
	document.removeEventListener("keyup", inputListener);
});
</script>
