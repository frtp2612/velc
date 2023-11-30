<template>
	<div class="relative h-full">
		<div
			class="absolute grid w-full h-full z-0"
			:style="[
				{ 'grid-template-rows': gridRows },
				{ 'grid-template-columns': gridColumns },
			]"
			ref="grid"
			@drop="onDrop"
			@dragend="onDragEnd"
		>
			<div
				v-for="gridBlock in gridBlocks"
				class="w-full h-full"
				@dragover.prevent="() => onDragOver(gridBlock)"
				v-once
			></div>
		</div>
		<div
			class="grid gap-4 h-full z-10"
			:style="[
				{ 'grid-template-rows': gridRows },
				{ 'grid-template-columns': gridColumns },
			]"
		>
			<div
				v-if="dragging && previewElementPath !== ''"
				:style="[
					{ 'grid-column': previewElementWidth },
					{ 'grid-row': previewElementHeight },
				]"
				class="relative"
			>
				<div
					class="absolute top-0 left-0 w-full h-full"
					:class="[positionValid ? 'bg-color-primary' : 'bg-color-error']"
				></div>
				<VWidget
					:component-path="previewElementPath"
					:name="previewElementName"
					class="opacity-50"
				/>
			</div>
			<VDynamicBentoGridRegion
				v-for="region in regions.values()"
				:key="region.id"
				:style="[
					{
						'grid-column': `${region.colIndex + 1} / span ${region.colSpan}`,
						'grid-row': `${region.rowIndex + 1} / span ${region.rowSpan}`,
					},
				]"
				:id="region.id"
				:data="region.data"
				:active="activeRegionId === region.id"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import VWidget from "@/components/VWidget/VWidget.vue";
import { ref } from "vue";
import VDynamicBentoGridRegion from "./VDynamicBentoGridRegion.vue";
import { VDynamicBentoGridState } from "./VDynamicBentoGridState";

const props = withDefaults(
	defineProps<{
		rows?: number;
		columns?: number;
	}>(),
	{
		rows: 10,
		columns: 10,
	}
);

const emit = defineEmits(["selectBlockContent"]);

const grid = ref<HTMLElement | null>(null);

const state = VDynamicBentoGridState(props.rows, props.columns);
const {
	activeRegionId,
	gridRows,
	gridColumns,
	gridBlocks,
	regions,
	dragging,
	positionValid,
	previewElementHeight,
	previewElementPath,
	previewElementWidth,
	previewElementName,
	onDragEnd,
	onDragOver,
	onDrop,
} = state;

// function onBlockResize(
//   blockId: string,
//   blockSizeStart: { x: number; y: number },
//   blockSizeEnd: { x: number; y: number }
// ) {
//   const gridBlockData = gridBlocksData.value.get(blockId);

//   if (gridBlockData) {
//     let colSpan = 1;
//     let rowSpan = 1;

//     gridBlocksData.value.forEach((data: GridBlockData) => {
//       const el = data.el.getBoundingClientRect();
//       // if intersecting and not already merged, use it
//       if (
//         intersecting(
//           blockSizeStart,
//           blockSizeEnd,
//           el.x,
//           el.y,
//           el.right,
//           el.bottom
//         )
//       ) {
//         if (
//           gridBlockData.mergedWith.has(data.blockIndex) ||
//           isAvailable(data.rowIndex, data.colIndex)
//         ) {
//           if (data.rowIndex !== gridBlockData.rowIndex) {
//             rowSpan = Math.max(
//               rowSpan,
//               data.rowIndex - gridBlockData.rowIndex + 1
//             );
//           }

//           if (data.colIndex !== gridBlockData.colIndex) {
//             colSpan = Math.max(
//               colSpan,
//               data.colIndex - gridBlockData.colIndex + 1
//             );
//           }

//           if (data.blockIndex !== gridBlockData.blockIndex) {
//             gridBlocks.value[data.blockIndex].visible = false;
//             gridBlockData.mergedWith.add(data.blockIndex);
//           }
//           islands.value[data.rowIndex][data.colIndex] =
//             gridBlockData.blockIndex;
//         }
//       } else if (gridBlockData.mergedWith.has(data.blockIndex)) {
//         gridBlocks.value[data.blockIndex].visible = true;
//         islands.value[data.rowIndex][data.colIndex] = -1;
//         gridBlockData.mergedWith.delete(data.blockIndex);
//       }
//     });

//     if (
//       !isAvailable(gridBlockData.rowIndex, gridBlockData.colIndex) &&
//       colSpan == 1 &&
//       rowSpan == 1
//     ) {
//       islands.value[gridBlockData.rowIndex][gridBlockData.colIndex] = -1;
//     }

//     gridBlocks.value[gridBlockData.blockIndex].colSpan = colSpan;
//     gridBlocks.value[gridBlockData.blockIndex].rowSpan = rowSpan;
//   }
// }

// function isAvailable(x: number, y: number) {
//   return islands.value[x][y] === -1;
// }

// function intersecting(
//   rect1Start: { x: number; y: number },
//   rect1End: { x: number; y: number },
//   rect2StartX: number,
//   rect2StartY: number,
//   rect2EndX: number,
//   rect2EndY: number
// ) {
//   return (
//     rect1End.x >= rect2StartX &&
//     rect1Start.x <= rect2EndX &&
//     rect1Start.y <= rect2EndY &&
//     rect1End.y >= rect2StartY
//   );
// }

// function selectContent(gridBlock: GridBlock) {
//   if (activeBlock.value?.id === gridBlock.id) {
//     activeBlock.value = undefined;
//   } else {
//     activeBlock.value = gridBlock;
//   }
// }

// function assignData(key: string, data: any) {
//   if (activeBlock.value) {
//     activeBlock.value["data"] = {
//       [key]: data,
//     };

//     activeBlock.value = undefined;
//   }
// }

// defineExpose({ assignData });

// function onClearData(gridBlock: GridBlock) {
//   gridBlock["data"] = undefined;
// }

// const visibleBlocks = computed(() =>
//   gridBlocks.value.filter((block: GridBlock) => block.visible)
// );
</script>
