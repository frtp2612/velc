<template>
  <ComponentExampleTemplate component-name="VProgressBar">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" :example="example1">
        <div class="flex flex-col gap-4 w-full">
          <div class="flex gap-4">
            <VButton
              :type="VButtonTypes.PRIMARY"
              :on-click="() => (progress += 5)"
              >Increase progress by 5</VButton
            >
            <VButton
              :type="VButtonTypes.PRIMARY"
              :on-click="() => (progress -= 5)"
              >Decrease progress by 5</VButton
            >
          </div>

          <VProgressBar
            v-model="progress"
            @fully-loaded="progressComplete = true"
          >
          </VProgressBar>
          <VLabel>{{ progressComplete }}</VLabel>
        </div>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VProgressBar from "@/components/VProgressBar/VProgressBar.vue";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { ref } from "vue";
import VButton from "@/components/VButton/index";
import { VButtonTypes } from "@/enums";
import VLabel from "@/components/VLabel/VLabel.vue";

const example1 = "";

const progress = ref(20);
const progressComplete = ref(false);
</script>
