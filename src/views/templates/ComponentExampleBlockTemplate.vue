<template>
	<div
		class="rounded-xl flex flex-col min-h-0 bg-theme-bg-50 border border-transparent hover:border-theme-secondary-200 p-2 gap-4"
	>
		<div
			class="px-2 py-1 bg-theme-bg-100/50 self-start rounded-md border border-theme-secondary"
		>
			<VLabel class="font-semibold text-sm">{{ title }}</VLabel>
		</div>
		<div class="self-center min-h-0 min-w-0 w-full">
			<slot></slot>
		</div>

		<div class="flex flex-col gap-2">
			<div class="px-2 py-1"><VLabel class="font-semibold">Code</VLabel></div>
			<div
				class="grid grid-cols-[40px,_1fr] bg-theme-bg-100/50 rounded-lg divide-x divide-theme-bg-200 overflow-hidden"
			>
				<div>
					<ul>
						<li
							v-for="index in codeSnippet.length"
							class="h-[32px] select-none px-2 flex items-center"
						>
							{{ index }}
						</li>
					</ul>
				</div>
				<pre
					class="overflow-x-auto"
					v-code-highlighter
				><code class="whitespace-pre h-[32px] flex items-center even:bg-theme-bg-100/50 even:hover:bg-theme-bg-200/50 hover:bg-theme-bg-200/50 px-2" v-for="(line) in codeSnippet">{{ line }}</code></pre>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { computed } from "vue";
const props = defineProps<{
	title: string;
	example: string;
}>();

const codeSnippet = computed(() => {
	return props.example.split("\n");
});
</script>
