<template>
	<input
		type="number"
		v-model.number="model"
		class="text-right"
		:class="elementClass"
		:id="id"
		:min="min"
		:max="max"
		ref="input"
	/>
</template>

<script setup lang="ts">
import { inputBaseClass } from "@/constants/index";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

const props = defineProps<{
	id: string;
	modelValue?: any;
	customClass?: string;
	autoFocus?: boolean;
	min?: number;
	max?: number;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
		  }
);

const input = ref<HTMLElement | null>(null);

const elementClass = computed(() =>
	props.customClass ? props.customClass : inputBaseClass
);

onMounted(() => {
	if (props.autoFocus && input.value) {
		input.value.focus();
	}
});
</script>
