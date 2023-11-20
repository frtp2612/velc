<template>
	<div class="flex gap-4">
		<span
			class="w-5 h-5 animate-pulse rounded-full"
			:class="[isOnline ? 'bg-color-success' : 'bg-color-error']"
		></span
		><VLabel>{{ isOnline ? "Connected" : "Network is offline" }}</VLabel>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import { useNetwork } from "@vueuse/core";

const { isOnline } = useNetwork();
</script>
