<template>
	<div class="relative outline-inherit">
		<input
			v-model="model"
			class="w-full"
			:class="elementClass"
			:type="fieldType"
			:id="id"
			ref="input"
		/>
		<font-awesome-icon
			:icon="icon"
			class="cursor-pointer absolute right-0 m-2 h-5 w-5 text-color-text/50 hover:text-color-text"
			@click="showPassword = !showPassword"
			v-if="isPassword"
		/>
	</div>
</template>

<script lang="ts" setup>
import { inputBaseClass } from "@/constants/index";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
	id: string;
	modelValue: any;
	customClass?: string;
	autoFocus?: boolean;
	isPassword?: boolean;
}>();

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
