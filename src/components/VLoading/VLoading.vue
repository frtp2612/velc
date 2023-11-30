<template>
	<div
		class="bg-color-bg-50 rounded-lg grid items-center justify-center h-full w-full p-6"
	>
		<div class="animate-pulse flex items-center gap-4 text-color-text-500">
			<div aria-label="Loading..." role="status" class="stroke-color-text-500">
				<svg
					width="24"
					height="24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					viewBox="0 0 24 24"
					stroke-linecap="round"
					stroke-linejoin="round"
					xmlns="http://www.w3.org/2000/svg"
					class="animate-[spin_1.5s_linear_infinite] w-8 h-8 stroke-inherit"
				>
					<path
						d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"
					></path>
				</svg>
			</div>
			<VLabel class="font-semibold text-lg">Loading...</VLabel>
		</div>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/VLabel.vue";
</script>
