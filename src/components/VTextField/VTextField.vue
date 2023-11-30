<template>
	<div class="flex flex-col gap-2">
		<VLabel v-if="label">{{ label }}</VLabel>
		<div class="relative">
			<slot name="left" v-if="$slots.left" />
			<slot>
				<input
					v-model="model"
					class="w-full disabled:disabled-input"
					:class="elementClass"
					:type="fieldType"
					:id="id"
					:autocomplete="autocomplete"
					:disabled="disabled"
					:placeholder="placeholder"
					ref="input"
				/>
			</slot>
			<slot name="right">
				<font-awesome-icon
					:icon="icon"
					class="cursor-pointer absolute right-0 m-2 h-5 w-5 text-color-text/50 hover:text-color-text"
					@click="showPassword = !showPassword"
					v-if="isPassword"
				/>
			</slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import { inputBaseClass } from "@/constants/index";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

const props = withDefaults(
	defineProps<{
		id: string;
		modelValue: any;
		customClass?: string;
		autoFocus?: boolean;
		isPassword?: boolean;
		autocomplete?: string;
		label?: string;
		disabled?: boolean;
		placeholder?: string;
	}>(),
	{
		disabled: false,
	}
);

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);

const input = ref<HTMLElement | null>(null);

const elementClass = computed(() =>
	props.customClass ? props.customClass : inputBaseClass
);

const showPassword = ref(false);

const icon = computed(() => (showPassword.value ? "fa-eye" : "fa-eye-slash"));

const fieldType = computed(() =>
	!props.isPassword || showPassword.value ? "text" : "password"
);

onMounted(() => {
	if (props.autoFocus && input.value) {
		input.value.focus();
	}
});
</script>
