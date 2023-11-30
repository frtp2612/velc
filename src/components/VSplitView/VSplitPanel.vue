<template>
	<div
		class="grid min-h-0 h-full overflow-auto"
		:class="[noPadding ? '' : 'p-6']"
	>
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	noPadding?: boolean;
	minSize?: number;
	maxSize?: number;
	initialSize?: number;
}>();
</script>
