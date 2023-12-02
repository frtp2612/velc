<template>
	<ComponentExampleTemplate component-name="Home">
		<template #usage>
			<VButton :on-click="() => (sideBarOpen = true)">Add Widgets</VButton>
			<div class="grid grid-cols-[1fr,_auto] h-full overflow-hidden">
				<VDynamicBentoGrid ref="dynamicGrid" :rows="8"> </VDynamicBentoGrid>
				<VSideBar v-model="sideBarOpen"><Widgets /></VSideBar>
			</div>
		</template>
	</ComponentExampleTemplate>
</template>

<script setup lang="ts">
import VButton from "@/components/VButton/index";
import VDynamicBentoGrid from "@/components/VDynamicBentoGrid/VDynamicBentoGrid.vue";
import VSideBar from "@/components/VSideBar/index";
import { ref } from "vue";
import Widgets from "./Widgets.vue";
import ComponentExampleTemplate from "./templates/ComponentExampleTemplate.vue";

const dynamicGrid = ref<InstanceType<typeof VDynamicBentoGrid> | null>(null);
const sideBarOpen = ref(false);
// function assignGridBlockContent(componentPath: string) {
//   if (dynamicGrid.value !== null) {
//     dynamicGrid.value.assignData("componentPath", componentPath);
//   }
// }
</script>
