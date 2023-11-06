<template>
	<input
		type="text"
		v-model="model"
		:class="elementClass"
		:id="id"
		ref="input"
	/>
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
}>();

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);

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
