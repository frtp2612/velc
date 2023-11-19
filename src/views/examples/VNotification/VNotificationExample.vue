<template>
  <ComponentExampleTemplate component-name="VNotification">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <VButton :on-click="() => (isOpen = true)">Show notification</VButton>
        <VNotification
          :title="title"
          :description="description"
          :type="MessageType.INFO"
          v-model="isOpen"
        >
        </VNotification>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VNotification from "@/components/VNotification/VNotification.vue";
import { ref } from "vue";
import VButton from "../../../components/VButton/index";
import { MessageType } from "@/enums";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";

const example1 = "";
const title = "Notification";
const description =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const isOpen = ref(false);
</script>
