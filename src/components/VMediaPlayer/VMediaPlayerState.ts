import { ref, computed, Ref } from "vue";
export function VMediaPlayerState(media: Ref<HTMLVideoElement | null>) {
  // const media = ref<HTMLVideoElement>();

  const playing = ref(false);
  const videoDuration = ref<number>(0);
  const currentTime = ref<number>(0);

  function init() {
    // media.value =
  }

  const icon = computed(() => (playing.value ? "fa-pause" : "fa-play"));

  function togglePlay() {
    playing.value = !playing.value;
    if (playing.value) {
      media.value?.play();
    } else {
      media.value?.pause();
    }
  }

  function onLoadedMetadata(_event: Event) {
    if (media.value) {
      videoDuration.value = media.value.duration;
    }
  }

  function onTimeUpdate(_event: Event) {
    if (media.value) {
      currentTime.value = media.value.currentTime;

      if (media.value.currentTime === media.value.duration) {
        playing.value = false;
        media.value.pause();
      }
    }
  }

  const formattedVideoDuration = computed(() => {
    if (media.value) {
      console.log(videoDuration.value);

      const minutes = Math.floor(videoDuration.value / 60);
      const seconds = Math.floor(videoDuration.value - minutes * 60);

      const minuteValue = minutes.toString().padStart(2, "0");
      const secondValue = seconds.toString().padStart(2, "0");
      return `${minuteValue}:${secondValue}`;
    }
    return "00:00";
  });

  const formattedVideoCurrentTime = computed(() => {
    if (media.value) {
      const minutes = Math.floor(currentTime.value / 60);
      const seconds = Math.floor(currentTime.value - minutes * 60);

      const minuteValue = minutes.toString().padStart(2, "0");
      const secondValue = seconds.toString().padStart(2, "0");
      return `${minuteValue}:${secondValue}`;
    }
    return "00:00";
  });

  return {
    icon,
    togglePlay,
    init,
    onLoadedMetadata,
    formattedVideoDuration,
    formattedVideoCurrentTime,
    onTimeUpdate,
  };
}
