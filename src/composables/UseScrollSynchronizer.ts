import { Ref, onMounted } from "vue";
// Generic hook for detecting scroll:
export const useScrollSyncrhonizer = (
  synchHorizontal: boolean,
  synchVertical: boolean,
  ...containers: Ref<HTMLElement | null>[]
) => {
  onMounted(() => {
    containers.forEach((container) => {
      console.log(container.value);

      if (container.value !== null)
        container.value.addEventListener("scroll", onScroll);
    });
  });

  function onScroll(event: Event) {
    if (synchHorizontal) {
      containers
        .filter(
          (container) => container.value !== (event.target as HTMLElement)
        )
        .forEach((container) => {
          if (container.value !== null) {
            container.value.scrollLeft = (
              event.target as HTMLElement
            ).scrollLeft;
            console.log((event.target as HTMLElement).scrollLeft);
            console.log("TARGET: ", container.value);
            console.log("TARGET: ", container.value.scrollLeft);
          }
        });
      console.log("ORIGINAL: ", (event.target as HTMLElement).scrollLeft);
    }

    if (synchVertical) {
      containers.forEach((container) => {
        if (container.value !== null)
          container.value.scrollTop = (event.target as HTMLElement).scrollTop;
      });
    }
  }
};
