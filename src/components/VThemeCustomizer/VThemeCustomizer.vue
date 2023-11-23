<template>
  <div class="grid grid-cols-5 md:grid-cols-4 gap-4 p-8">
    <div
      v-for="[key, value] in colorsMap"
      class="flex flex-col gap-4 bg-color-bg-50 rounded-xl overflow-hidden"
    >
      <VThemeCustomizerColor
        :key="key"
        :name="key"
        :value="value.main"
        :on-value-changed="changeProperty"
      />

      <!-- <VThemeCustomizerColor
					v-for="[derivedKey, derivedValue] in value.derived"
					:key="derivedKey"
					:name="key + '-' + derivedKey"
					:value="derivedValue"
					:on-value-changed="changeProperty"
				/> -->
    </div>
  </div>
  <div class="fixed bottom-0 left-0 flex gap-4 bg-white p-4">
    <div
      v-for="color in colors"
      :style="{ backgroundColor: `rgb(${color})` }"
      class="w-8 h-8"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { toRGBObject, RGBToHSL, HSLToRGB } from "../../utilities/index";
import VThemeCustomizerColor from "./VThemeCustomizerColor.vue";
import { clamp } from "@vueuse/core";

const colors = ref<any[]>([]);

const colorsMap = ref<
  Map<string, { main: string; derived: Map<string, string> }>
>(new Map());
document.body
  .computedStyleMap()
  .forEach((value: CSSStyleValue[], key: string) => {
    if (key.startsWith("--color")) {
      const main = key.replace("--color-", "");

      if (!key.endsWith("0")) {
        // main colors are the
        if (!colorsMap.value.has(key)) {
          colorsMap.value.set(main, {
            main: `rgb(${value[0].toString()})`,
            derived: new Map(),
          });
        }
      } else {
        colorsMap.value
          .get(main.split("-")[0])
          ?.derived.set(
            main.replace(main.split("-")[0] + "-", ""),
            `rgb(${value[0].toString()})`
          );
      }
    }
  });

function changeProperty(key: string, newValue: string) {
  const updatedColor = toRGBObject(newValue);
  // console.log(updatedColor);
  document.body.style.setProperty(
    "--color-" + key,
    `${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
  );

  const { h, s, l } = RGBToHSL(updatedColor.r, updatedColor.g, updatedColor.b);

  const newS = s * 0.01;
  const steps = 10;
  const lighterSteps = Math.round((100 - l) * 0.1);
  const darkerSteps = steps - lighterSteps;

  colors.value.length = 0;
  Array.from(Array(lighterSteps).keys()).forEach((_, i: number) => {
    const hFactor = h * ((lighterSteps - i) * 1) * 0.01;
    const newH = clamp(h - hFactor, 0, 360);
    const newL = clamp(l + l * ((lighterSteps - i) * 10) * 0.01, 0, 100) * 0.01;
    // console.log([newH, newS, newL]);
    const rgb = HSLToRGB(newH, newS, newL);
    colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  });

  Array.from(Array(darkerSteps).keys()).forEach((_, i: number) => {
    const hFactor = h * (i * 1) * 0.01;
    const newH = clamp(h + hFactor, 0, 360);
    const newL = clamp(l - l * (i * 10) * 0.01, 0, 100) * 0.01;
    // console.log([newH, newS, newL]);
    const rgb = HSLToRGB(newH, newS, newL);
    colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  });

  shades.forEach((shade: number, index: number) => {
    document.body.style.setProperty(
      "--color-" + key + "-" + shade,
      `${colors.value[index]}`
    );
  });

  // console.log(colors.value);
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>
