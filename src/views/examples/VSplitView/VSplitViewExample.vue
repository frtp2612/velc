<template>
	<VSplitView>
		<VSplitPanel :minSize="20"
			><div class="grid items-center justify-center">Panel 1</div></VSplitPanel
		>
		<VSplitPanel noPadding
			><VSplitView vertical>
				<VSplitPanel
					><div class="grid items-center justify-center">
						Nested panel 1
					</div></VSplitPanel
				>
				<VSplitPanel
					><div class="grid items-center justify-center">
						Nested panel 2
					</div></VSplitPanel
				>
			</VSplitView></VSplitPanel
		>
		<VSplitPanel :initialSize="40"
			><div class="grid items-center justify-center">Panel 3</div></VSplitPanel
		>
	</VSplitView>
</template>

<script lang="ts" setup>
import VSplitPanel from "@/components/VSplitView/VSplitPanel.vue";
import VSplitView from "@/components/VSplitView/VSplitView.vue";
</script>
