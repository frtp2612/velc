<template>
  <div
    class="flex media-player relative w-auto h-full min-h-0 bg-color-bg-800 aspect-video"
  >
    <video
      ref="media"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
    >
      <source
        v-for="resource in data"
        :src="resource.link"
        :type="resource.type"
      />
      <VLabel> Your browser doesn't support HTML video. </VLabel>
    </video>
    <div
      class="absolute bottom-0 left-0 w-full flex gap-4 justify-stretch bg-color-bg/50 p-2 items-center"
    >
      <div
        class="justify-self-start w-7 aspect-square flex items-center justify-center"
      >
        <font-awesome-icon
          :icon="icon"
          class="w-5 aspect-square"
          ref="playToggle"
          @click="togglePlay"
        />
      </div>
      <div class="h-1 rounded-full bg-color-bg/50 w-full">
        <div class="" ref="loadingBar"></div>
        <div class="relative h-full" ref="progressBar">
          <div
            class="absolute top-0 bg-color-bg rounded-full w-2 hover:w-3 aspect-square -translate-x-1/2 -translate-y-1/4 hover:-translate-y-1/3"
            ref="gutter"
          ></div>
        </div>
      </div>
      <div class="justify-self-end">
        <VLabel
          >{{ formattedVideoCurrentTime }}/{{ formattedVideoDuration }}</VLabel
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from "vue";
import { VMediaPlayerResource } from "../../enums/index";
import VLabel from "@/components/VLabel/index";
import { VMediaPlayerState } from "./VMediaPlayerState";

defineProps<{
  data: VMediaPlayerResource[];
}>();

const playToggle = ref<HTMLElement | null>();
const loadingBar = ref<HTMLElement | null>();
const progressBar = ref<HTMLElement | null>();
const gutter = ref<HTMLElement | null>();
const media = ref<HTMLVideoElement | null>(null);

const state = VMediaPlayerState(media);

const {
  icon,
  togglePlay,
  onLoadedMetadata,
  onTimeUpdate,
  formattedVideoDuration,
  formattedVideoCurrentTime,
} = state;

onBeforeMount(() => {
  if (media.value) {
    state.init();
  }
});
</script>
