<template>
	<VCheckBox
		v-model="model"
		v-if="isBoolean"
		class="w-full px-2"
		:id="id"
		auto-focus
	/>
	<input
		type="date"
		v-model="model"
		v-else-if="isDate"
		class="w-full px-2"
		:id="id"
	/>
	<VDropdown
		v-model="model"
		:values="values!"
		:formatter="formatter"
		append-to="body"
		class="w-full"
		auto-focus
		@update:model-value="(newValue) => (model = newValue)"
		v-else-if="isDropdown"
	>
		<template v-slot="{ selection }">
			<VLabel
				class="text-color-text w-full h-full outline outline-2 -outline-offset-1 outline-color-bg-300 hover:outline-color-bg-500 focus:outline-color-secondary-500 px-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
				>{{ selection }}</VLabel
			>
		</template>
	</VDropdown>
	<VTextField
		v-model="model"
		v-else
		custom-class="w-full h-full outline outline-2 -outline-offset-1 outline-color-bg-300 hover:outline-color-bg-500 focus:outline-color-secondary-500 px-2"
		:id="id"
		auto-focus
	/>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { useVModel } from "@vueuse/core";
import VCheckBox from "../VCheckBox/index";
import VDropdown from "../VDropdown/index";
import { VDataType } from "./VDataGridTypes";

const props = defineProps<{
	id: string;
	type?: VDataType;
	values?: any[];
	modelValue: any;
	formatter?: Function;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);

const isBoolean =
	props.type !== undefined && (props.type as VDataType) === VDataType.BOOLEAN;
const isDate =
	props.type !== undefined && (props.type as VDataType) === VDataType.DATE;
const isDropdown =
	props.type !== undefined && (props.type as VDataType) === VDataType.DROPDOWN;
</script>
