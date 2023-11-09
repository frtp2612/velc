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
	<VSelect
		v-model="model"
		:values="values!"
		:formatter="formatter"
		append-to="body"
		class="w-full"
		auto-focus
		@update:model-value="(newValue) => (model = newValue)"
		v-else-if="isSelect"
	>
		<template v-slot="{ selection }">
			<VLabel
				class="text-color-text w-full h-full outline outline-2 -outline-offset-1 outline-color-bg-300 hover:outline-color-bg-500 focus:outline-color-secondary-500 px-2 overflow-hidden overflow-ellipsis whitespace-nowrap"
				>{{ selection }}</VLabel
			>
		</template>
	</VSelect>
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
import { VDataType } from "@/enums";
import { useVModel } from "@vueuse/core";
import VCheckBox from "../VCheckBox/index";
import VSelect from "../VSelect/index";

const props = withDefaults(
	defineProps<{
		id: string;
		type?: VDataType;
		values?: any[];
		modelValue: any;
		formatter?: Function;
	}>(),
	{
		formatter: (value: any) => value,
	}
);

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);

const isBoolean =
	props.type !== undefined && (props.type as VDataType) === VDataType.BOOLEAN;
const isDate =
	props.type !== undefined && (props.type as VDataType) === VDataType.DATE;
const isSelect =
	props.type !== undefined && (props.type as VDataType) === VDataType.SELECT;
</script>
