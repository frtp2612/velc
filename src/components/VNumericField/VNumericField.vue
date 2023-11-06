<template>
	<input type="number" v-model.number.lazy="model" :class="elementClass" />
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
				defaultValue: 0,
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
