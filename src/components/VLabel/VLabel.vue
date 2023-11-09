<template>
	<component :is="component" class="text-inherit">
		<slot></slot>
	</component>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		component?: string;
	}>(),
	{
		component: "p",
	}
);
</script>
