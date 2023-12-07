<template>
	<div
		class="rounded-xl flex flex-col min-h-0 bg-color-bg-50 border border-transparent hover:border-color-border-100 p-2 gap-4"
	>
		<div
			class="px-2 py-1 bg-color-bg-50 self-start rounded-lg border border-color-border-100"
		>
			<VLabel class="font-semibold text-sm">{{ title }}</VLabel>
		</div>
		<div
			class="self-center min-h-0 min-w-0 w-full flex bg-color-bg rounded-lg p-4 border border-color-border-50"
		>
			<slot></slot>
		</div>

		<div class="flex flex-col gap-2" v-if="false">
			<div class="px-2 py-1"><VLabel class="font-semibold">Code</VLabel></div>
			<div
				class="grid grid-cols-[40px,_1fr] bg-color-bg-100 rounded-lg divide-x divide-color-border-100 overflow-hidden"
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
				><code class="whitespace-pre h-[32px] flex items-center even:bg-color-bg-200/50 even:hover:bg-color-bg-300/50 hover:bg-color-bg-300/50 px-2" v-for="(line) in codeSnippet">{{ line }}</code></pre>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { computed } from "vue";
const props = defineProps<{
	title: string;
	example?: string;
}>();

const codeSnippet = computed(() => {
	return props.example ? props.example.split("\n") : undefined;
});
</script>
