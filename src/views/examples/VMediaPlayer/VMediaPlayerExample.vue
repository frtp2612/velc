<template>
  <ComponentExampleTemplate component-name="VPopover">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VMediaPlayer :data="data" />
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VMediaPlayer from "@/components/VMediaPlayer/VMediaPlayer.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { VMediaPlayerResource, VMediaPlayerTypes } from "../../../enums/index";
import { ref } from "vue";

const example1 = "";

const data = ref<VMediaPlayerResource[]>([
  {
    link: "/src/assets/video.mp4",
    type: VMediaPlayerTypes.MP4,
  },
]);
</script>
