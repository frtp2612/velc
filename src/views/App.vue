<template>
	<div
		class="grid grid-cols-[1fr,_4fr] h-full w-full items-start divide-x divide-color-border-100"
	>
		<div class="min-h-0 h-full px-2 overflow-auto">
			<ul class="flex flex-col overflow-visible gap-1">
				<router-link
					v-for="route in routes"
					:to="route.path"
					class="h-full px-2 py-2 w-max"
					v-tooltip="{ text: route.path }"
					:key="route.path"
				>
					{{ route.name }}
				</router-link>
			</ul>
		</div>
		<div class="min-h-0 h-full overflow-auto relative">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouteRecordNormalized, useRouter } from "vue-router";

const router = useRouter();
const { getRoutes } = router;

const routes = computed(() =>
	getRoutes()
		.sort((a: RouteRecordNormalized, b: RouteRecordNormalized) =>
			a.name!.toString().localeCompare(b.name!.toString())
		)
		.filter((route: RouteRecordNormalized) => route)
);
</script>

<style scoped></style>
