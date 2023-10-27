<template>
	<VButton ref="dropdown" class="relative" :on-click="toggle">
		<VLabel class="text-theme-text">{{ formattedSelectedItem }}</VLabel>
		<Teleport to="body" :disabled="true">
			<slot :items="filteredItems">
				<div
					class="absolute z-50 left-0 top-full border border-slate-100 shadow-sm flex flex-col max-h-32 min-w-[16rem] w-max max-w-max bg-white"
					v-show="open"
				>
					<VirtualScroller :items="filteredItems" :item-height="30">
						<template v-slot="{ item }">
							<div
								class="px-2 hover:bg-blue-200 overflow-ellipsis whitespace-nowrap h-full"
								@click.capture="selectedItem = item"
							>
								<KeepAlive>
									<ItemTest :item="item"></ItemTest>
								</KeepAlive>
							</div>
						</template>
					</VirtualScroller>
				</div>
			</slot>
		</Teleport>
	</VButton>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { onClickOutside, useVModel } from "@vueuse/core";
import { RendererElement, computed, onMounted, ref } from "vue";
import VirtualScroller from "../VirtualScroller/VirtualScroller.vue";
import ItemTest from "./ItemTest.vue";

const props = defineProps<{
	values: any[];
	modelValue?: any;
	formatter?: Function;
	appendTo?: string | RendererElement;
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

selectedItem.value = props.modelValue;

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
	} else {
		document.removeEventListener("keyup", inputListener);
		searchTerm.value = "";
		filter.value = "";
	}
}

function inputListener(event: KeyboardEvent) {
	const name = event.key;
	const code = event.code;

	if (name === "Control") {
		return;
	}

	if (event.ctrlKey) {
		console.log(`Combination of ctrlKey + ${name} \n Key code Value: ${code}`);
	} else {
		console.log(`Key pressed ${name} \n Key code Value: ${code}`);

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
	props.values.filter((value: String) => value.includes(filter.value))
);

const formattedSelectedItem = computed(() =>
	props.formatter ? props.formatter(selectedItem.value) : selectedItem.value
);

onMounted(() => {});
</script>
