<template>
	<VCheckBox
		v-model="model"
		v-if="isBoolean"
		class="w-full px-2"
		:id="id"
		auto-focus
	/>
	<VDatePicker
		v-model="model"
		v-else-if="isDate"
		:id="id"
		class="w-full"
		auto-focus
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
				class="input-like overflow-hidden overflow-ellipsis whitespace-nowrap w-full"
				tabindex="-1"
				>{{ selection }}</VLabel
			>
		</template>
	</VSelect>
	<VNumericField
		:id="id"
		v-model="model"
		v-else-if="isNumber"
		auto-focus
		class="w-full"
	/>
	<VTextField v-model="model" v-else :id="id" auto-focus class="w-full" />
</template>

<script setup lang="ts">
import VCheckBox from "@/components/VCheckBox/index";
import VDatePicker from "@/components/VDatePicker/index";
import VLabel from "@/components/VLabel/index";
import VSelect from "@/components/VSelect/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { VDataType } from "@/enums";
import { useVModel } from "@vueuse/core";
import VNumericField from "../VNumericField/index";

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
const isNumber =
	props.type !== undefined && (props.type as VDataType) === VDataType.NUMBER;
</script>
