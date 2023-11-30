<template>
	<div class="relative inline-block max-w-full">
		<div ref="dropdown" @click="toggle">
			<slot>
				<VButton icon-right="fa-angle-down" :type="VButtonTypes.PRIMARY">
					<VLabel class="text-color-text-50 font-medium">{{ label }}</VLabel>
				</VButton>
			</slot>
		</div>

		<Teleport to="body" :disabled="!open || preventAppend">
			<div
				class="absolute z-50 left-0 top-full border border-color-border-100 shadow-md shadow-color-bg-100 flex flex-col max-h-64 min-w-[16rem] w-max max-w-max bg-color-bg overflow-auto"
				v-show="open"
				ref="dropdownPopup"
			>
				<VDropdownItem
					v-for="item in values"
					:item="item"
					:formatter="formatter"
					@item-clicked="close"
				/>
			</div>
		</Teleport>
	</div>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VLabel from "@/components/VLabel/index";
import { useAutoPopDirection } from "@/composables/UseAutoPopDirection";
import { PopAlignment, VButtonTypes, VInteractiveItem } from "@/enums/index";
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import VDropdownItem from "./VDropdownItem.vue";

const props = withDefaults(
	defineProps<{
		values: VInteractiveItem[];
		label?: string;
		formatter?: Function;
		preventAppend?: boolean;
		align?: PopAlignment;
	}>(),
	{
		preventAppend: false,
	}
);

const open = ref(false);
const dropdown = ref(null);
const dropdownPopup = ref<HTMLElement | null>(null);

onClickOutside(
	dropdownPopup,
	() => {
		open.value = false;
	},
	{
		ignore: [dropdown],
	}
);

function toggle() {
	open.value = !open.value;

	if (open.value) {
		requestAnimationFrame(() => {
			if (!props.preventAppend && dropdownPopup.value && dropdown.value) {
				useAutoPopDirection(
					dropdown.value,
					dropdownPopup.value,
					undefined,
					undefined,
					{
						align: props.align,
					}
				);
			}
		});
	}
}

function close() {
	open.value = false;
}
</script>
