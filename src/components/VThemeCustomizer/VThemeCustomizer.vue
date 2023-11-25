<template>
  <div class="flex flex-col justify-center">
    <div class="grid lg:grid-cols-8 md:grid-cols-4 gap-4 p-8">
      <div
        v-for="(value, key) in colorsMap"
        class="flex flex-col gap-4 bg-color-bg-50 rounded-xl overflow-hidden"
        :key="value.default"
      >
        <VThemeCustomizerColor
          :name="(key as string)"
          :value="value.default"
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
    <div>
      <VButton
        :type="VButtonTypes.PRIMARY"
        :on-click="() => (promptSaveTheme = true)"
        >Save</VButton
      >
      <VModalWindow v-model="promptSaveTheme" title="Save theme">
        <VTextField
          id="theme-name"
          v-model="themeName"
          label="Theme name"
        ></VTextField>
        <VButton :type="VButtonTypes.PRIMARY" :on-click="storeTheme"
          >Confirm</VButton
        >
      </VModalWindow>
    </div>
  </div>

  <div
    class="fixed bottom-0 left-1/2 -translate-x-1/2 rounded-t-lg flex gap-4 bg-color-nav w-auto mx-auto justify-self-center p-4"
  >
    <div
      v-for="(color, index) in colors"
      :style="{ backgroundColor: `rgb(${color})` }"
      :key="color + index"
      v-tooltip:top="{ text: computed(() => `rgb(${color})`) }"
      class="w-8 h-8"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { clamp } from "@vueuse/core";
import { computed, ref } from "vue";
import {
  HSLToRGB,
  RGBToHSL,
  getContrast,
  toRGBObject,
} from "../../utilities/index";
import VThemeCustomizerColor from "./VThemeCustomizerColor.vue";
import VButton from "@/components/VButton/VButton.vue";
import { VButtonTypes } from "@/enums";
import VModalWindow from "../VModalWindow/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { lerpFromTo } from "../../utilities/index";

const colorsMap = ref<{
  [key: string]: { default: string; shades: Map<string, string> };
}>({});
const colors = ref<any[]>([]);
const promptSaveTheme = ref(false);
const themeName = ref("");

document.body
  .computedStyleMap()
  .forEach((value: CSSStyleValue[], key: string) => {
    if (key.startsWith("--color")) {
      const main = key.replace("--color-", "");

      if (!key.endsWith("0")) {
        colorsMap.value[main] = {
          default: `rgb(${value[0].toString()})`,
          shades: new Map(),
        };
      } else {
        colorsMap.value[main.split("-")[0]]?.shades.set(
          main.replace(main.split("-")[0] + "-", ""),
          `rgb(${value[0].toString()})`
        );
      }
    }
  });

function changeProperty(
  key: string,
  newValue: string,
  colorHue: number,
  colorSaturation: number,
  updateColorsView: boolean = true
) {
  const updatedColor = toRGBObject(newValue);
  document.body.style.setProperty(
    "--color-" + key,
    `${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
  );

  const { s, l } = RGBToHSL(updatedColor.r, updatedColor.g, updatedColor.b);
  // console.log([s, l, colorSaturation]);

  const darkestColor =
    l < 10
      ? updatedColor
      : HSLToRGB(colorHue, colorSaturation, Math.random() * 0.1);
  const lightestColor =
    l > 90
      ? updatedColor
      : HSLToRGB(colorHue, colorSaturation, 1 - Math.random() * 0.1);

  const steps = 11;
  let lighterSteps = 0;
  const lightnessRatio = l * 0.01;

  lighterSteps = Math.floor(steps * (1 - lightnessRatio));
  let darkerSteps = steps - lighterSteps;

  // console.log([darkestColor, lightestColor]);

  const darkestColorL = RGBToHSL(
    darkestColor.r,
    darkestColor.g,
    darkestColor.b
  ).l;
  const lightestColorL = RGBToHSL(
    lightestColor.r,
    lightestColor.g,
    lightestColor.b
  ).l;

  const lerpFactors: number[] = lerpFromTo(
    darkestColorL,
    lightestColorL,
    steps
  );

  var closest = lerpFactors.findIndex(
    (value: number) =>
      value ===
      lerpFactors.reduce(function (prev, curr) {
        return Math.abs(curr - l) < Math.abs(prev - l) ? curr : prev;
      })
  );

  // console.log(lerpFactors);
  // console.log(closest);

  colors.value.length = 0;

  Array.from(Array(steps).keys()).forEach((_, i: number) => {
    if (i === closest) {
      colors.value.push(
        `${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
      );
    } else {
      const lerpValue = lerpFactors[i];

      const newH = clamp(colorHue, 0, 360);
      const newL = clamp(lerpValue, 0, 100) * 0.01;
      console.log([newH, lerpValue * s * 0.01, newL]);
      const rgb = HSLToRGB(newH, s * 0.01, newL);
      console.log(rgb.formatted);

      colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
    }
  });

  shades.forEach((shade: number, index: number) => {
    document.body.style.setProperty(
      "--color-" + key + "-" + shade,
      `${colors.value[index]}`
    );
    colorsMap.value[key].shades.set(
      "--color-" + key + "-" + shade,
      `rgb(${colors.value[index]})`
    );
  });

  const contrast = getContrast(updatedColor, toRGBObject("rgb(0, 0, 0)"));

  // if (key !== "text") {
  //   Array.from(Array(lighterSteps).keys()).forEach((_, i: number) => {
  //     const lIncrease =
  //       BezierBlend((lighterSteps - i) * 0.1) * 4 * lFraction + lFraction;
  //     const sDecrease = BezierBlend(i * 0.1) * colorSaturation * 0.2;
  //     const newH = clamp(colorHue, 0, 360);
  //     const newL = clamp(l + lIncrease, 0, 100) * 0.01;
  //     console.log([newH, newS - sDecrease, newL]);
  //     const rgb = HSLToRGB(newH, newS - sDecrease, newL);
  //     colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  //   });

  //   Array.from(Array(darkerSteps).keys()).forEach((_, i: number) => {
  //     const lDecrease =
  //       BezierBlend(i * 0.1) * lFraction + lFraction * (i + 1) * 0.1;
  //     const sDecrease = BezierBlend(i * 0.1) * colorSaturation * 0.2;
  //     // console.log(lDecrease);
  //     const newH = clamp(colorHue, 0, 360);
  //     const newL = clamp(l - lDecrease, 0, 100) * 0.01;
  //     console.log([newH, newS + sDecrease, newL]);
  //     const rgb = HSLToRGB(newH, newS + sDecrease, newL);
  //     colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  //   });

  //   shades.forEach((shade: number, index: number) => {
  //     document.body.style.setProperty(
  //       "--color-" + key + "-" + shade,
  //       `${colors.value[index]}`
  //     );
  //     colorsMap.value[key].shades.set(
  //       "--color-" + key + "-" + shade,
  //       `rgb(${colors.value[index]})`
  //     );
  //   });
  // }
  console.log(colors.value);

  // if (key === "bg" || key === "text") {
  //   const textMainColor = colorsMap.value["text"].default;
  //   if (textMainColor) {
  //     const darkestColor = HSLToRGB(
  //       colorHue,
  //       colorSaturation,
  //       Math.random() * 0.1
  //     );
  //     const lightestColor = HSLToRGB(
  //       colorHue,
  //       colorSaturation,
  //       1 - Math.random() * 0.1
  //     );

  //     if (contrast < 4.5) {
  //       calculateTextShades(
  //         [lightestColor.r, lightestColor.g, lightestColor.b],
  //         [darkestColor.r, darkestColor.g, darkestColor.b],
  //         steps
  //       );
  //     } else {
  //       calculateTextShades(
  //         [darkestColor.r, darkestColor.g, darkestColor.b],
  //         [lightestColor.r, lightestColor.g, lightestColor.b],
  //         steps
  //       );
  //     }
  //     document.body.style.setProperty(
  //       "--color-text",
  //       `${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
  //     );
  //     colorsMap.value[
  //       "text"
  //     ].default = `rgb(${updatedColor.r} ${updatedColor.g} ${updatedColor.b})`;
  //     // console.log(contrast);
  //   }
  // }

  // console.log(colors.value);
}

function calculateTextShades(
  fromColor: number[],
  toColor: number[],
  steps: number
) {
  Array.from(Array(steps).keys()).forEach((_, i: number) => {
    const interpolatedColor = interpolateColor(fromColor, toColor, i / steps);

    colors.value.push(
      `${interpolatedColor[0]} ${interpolatedColor[1]} ${interpolatedColor[2]}`
    );
  });

  console.log(colors.value);

  shades.forEach((shade: number, index: number) => {
    document.body.style.setProperty(
      "--color-text-" + shade,
      `${colors.value[index]}`
    );
    colorsMap.value["text"].shades.set(
      "--color-text-" + shade,
      `rgb(${colors.value[index]})`
    );
  });
}

function BezierBlend(t: number): number {
  return t * t * (3.0 - 2.0 * t);
}

// function quadraticBlend(x: number): number {
//   return 2 * x * (1 - x) + 0.5;
// }

function interpolateColor(color1: number[], color2: number[], factor: number) {
  var result: number[] = color1.slice();
  for (var i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

function storeTheme() {
  let colorsArray = [];
  for (const [key, value] of Object.entries(colorsMap.value)) {
    console.log(`--color-${key}: ${value.default}`);
    colorsArray.push(
      `--color-${key}: ${value.default.match(/\d+/g)?.join(" ")}`
    );
    value.shades.forEach((shade: string, shadeKey: string) => {
      colorsArray.push(
        `--color-${key}-${shadeKey}: ${shade.match(/\d+/g)?.join(" ")}`
      );
      console.log(
        `--color-${key}-${shadeKey}: ${shade.match(/\d+/g)?.join(" ")}`
      );
    });
  }
  localStorage.setItem(themeName.value, JSON.stringify(colorsArray));
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>
