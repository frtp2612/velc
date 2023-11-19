<template>
  <div class="flex flex-col gap-2 items-start w-full grow">
    <div
      class="flex gap-2 min-w-[2.5rem] items-center cursor-pointer font-medium group"
      :class="[
        nodeClass,
        isExpanded ? 'px-2 py-1.5 w-full' : ' aspect-square justify-center',
      ]"
      @click="selectNode"
      v-tooltip="{ text: formattedValue }"
    >
      <font-awesome-icon
        :icon="data.icon"
        class="w-5 aspect-square group-hover:text-inherit"
        :class="{ 'text-color-text-300': !selected }"
        v-if="data.icon"
      />
      <VLabel
        class="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap"
        v-if="isExpanded"
        >{{ formattedValue }}</VLabel
      >
      <font-awesome-icon
        :icon="subMenuOpen ? 'fa-angle-down' : 'fa-angle-right'"
        class="w-5 aspect-square ml-auto"
        v-if="data.children && isExpanded"
      />
    </div>
    <template v-if="data.children && isExpanded">
      <div v-show="subMenuOpen" class="pl-4 flex flex-col gap-1">
        <VNavigationNode
          v-for="node in data.children"
          :data="node"
          :isExpanded="isExpanded"
          v-model="selectedNode"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import VLabel from "@/components/VLabel/index";
import { useVModel } from "@vueuse/core";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { VNavItem } from "../../enums/index";
import { textFormatter } from "../../formatters/index";

const props = defineProps<{
  data: VNavItem;
  modelValue?: string;
  isExpanded: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedNode = useVModel(props, "modelValue", emit);

const router = useRouter();

const i18n = useI18n();
const subMenuOpen = ref(false);

const formattedValue = computed(() => textFormatter(props.data.label, i18n));

const selected = computed(
  () => props.data.to !== undefined && selectedNode.value === props.data.to
);

const nodeClass = computed(() => {
  if (selected.value) {
    return "selected-node";
  }

  if (props.data.to !== undefined) {
    return "selectable-node";
  }

  return "hover:text-color-primary";
});

function selectNode() {
  props.data.to !== undefined
    ? (selectedNode.value = props.data.to)
    : (subMenuOpen.value = !subMenuOpen.value);

  if (props.data.to !== undefined) {
    if (router.hasRoute(props.data.to?.toString() || "")) {
      router.push({ name: props.data.to?.toString() || "" });
    } else {
      router.push("/404");
    }
  }
}
</script>

<style>
.selectable-node {
  @apply hover:bg-color-bg-50 hover:text-color-primary rounded-md;
}

.selected-node {
  @apply bg-color-primary text-color-text-50 rounded-md;
}
</style>
