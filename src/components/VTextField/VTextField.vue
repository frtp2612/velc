<template>
	<input type="text" v-model="model" :class="elementClass" ref="input" />
</template>

<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { Input } from "postcss";
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
	props.customClass
		? props.customClass
		: "outline outline-1 outline-theme-bg-200 rounded hover:outline-theme-bg-400 focus:outline-1 focus:outline-theme-primary focus:border-theme-primary px-2"
);

onMounted(() => {
	if (props.autoFocus && input.value) {
		input.value.focus();
	}
});
</script>
