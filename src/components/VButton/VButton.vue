<template>
	<button
		class="bg-theme-primary px-4 py-2 cursor-pointer rounded-lg"
		@click="onClick()"
	>
		<slot />
	</button>
</template>
<script lang="ts" setup>
defineProps<{
	onClick: Function;
}>();
</script>
