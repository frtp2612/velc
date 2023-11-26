<template>
  <div
    class="flex-col justify-center grid grid-cols-[1fr,_3fr] gap-8 p-8 min-h-0 h-full"
  >
    <div class="flex col-span-2">
      <VSelect
        :values="themeNames"
        id="theme-select"
        @update:model-value="onThemeChanged"
      />
    </div>
    <div class="flex flex-col gap-4 overflow-auto">
      <VThemeCustomizerColor
        :name="(key as string)"
        :value="value.default"
        :active="activeColor === value"
        @click="changeActiveColor(key as string)"
        v-for="(value, key) in colorsMap"
        :key="key + value.default"
      />
    </div>
    <div v-if="activeColor" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 items-center">
          <div
            class="h-16 aspect-square rounded-lg border border-color-border-100"
            :style="{ backgroundColor: `${activeColor.default}` }"
            v-tooltip="{ text: `${activeColor.default}` }"
          ></div>
          <VLabel class="text-lg font-semibold">{{
            activeColor.default
          }}</VLabel>
        </div>

        <VColorPicker v-model="activeColor.default" ref="colorPicker" />
      </div>
      <div class="flex gap-4">
        <VButton :on-click="generateShades">Generate Shades</VButton>
        <VCheckBox
          id="invert-generation"
          label="Invert colors?"
          v-model="invertGeneration"
        ></VCheckBox>
      </div>

      <div class="flex w-min">
        <div
          class="flex flex-col gap-2 items-center"
          v-for="([key, shade], index) in new Map(
            [...activeColor.shades.entries()].sort((value1, value2) =>
              value1[0]
                .padStart(3, '0')
                .localeCompare(value2[0].padStart(3, '0'))
            )
          )"
          :key="key"
        >
          <VColorPicker
            v-if="activeColor.shades.has(key)"
            :model-value="activeColor.shades.get(key)"
            @update:model-value="(value: string) => activeColor!.shades.set(key, value)"
            #default="{ toggle }"
          >
            <div
              class="h-16 aspect-square"
              :class="[
                {
                  'rounded-l-lg': index === 0,
                  'rounded-r-lg': index === activeColor.shades.size - 1,
                },
              ]"
              :style="{ backgroundColor: `${shade}` }"
              v-tooltip="{ text: `${shade}` }"
              @click="toggle"
            ></div>
          </VColorPicker>

          <VLabel>{{ key }}</VLabel>
        </div>
      </div>
    </div>

    <div class="flex gap-4 col-span-2 justify-end">
      <VButton :on-click="exportTheme">Export theme</VButton>
      <VButton
        :type="VButtonTypes.PRIMARY"
        :on-click="() => (promptSaveTheme = true)"
        >Save Theme</VButton
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
      <VModalWindow
        v-model="exportWindowVisible"
        title="Export theme"
        width="50%"
        height="50%"
      >
        <VTextArea id="export" v-model="exportedTheme" class="h-full" />
      </VModalWindow>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { clamp } from "@vueuse/core";
import { ref, computed } from "vue";
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
import VLabel from "@/components/VLabel/index";
import VColorPicker from "@/components/VColorPicker/VColorPicker.vue";
import VCheckBox from "@/components/VCheckBox/index";
import VTextArea from "@/components/VTextArea/VTextArea.vue";
import VSelect from "@/components/VSelect/index";

const themes = ref<{ [key: string]: string[] }>(
  JSON.parse(localStorage.getItem("themes") || "{}")
);
const themeNames = ref<string[]>([]);
for (const property in themes.value) {
  themeNames.value.push(property);
  // console.log(`${property}: ${themes.value[property]}`);
}

const colorsMap = ref<{
  [key: string]: { default: string; shades: Map<string, string> };
}>({});
const colors = ref<any[]>([]);
const promptSaveTheme = ref(false);
const themeName = ref("");

const activeColorKey = ref<string>("");
const activeColor = computed(() => colorsMap.value[activeColorKey.value]);

const colorPicker = ref<InstanceType<typeof VColorPicker>>();

const invertGeneration = ref(false);

const exportedTheme = ref();
const exportWindowVisible = ref(false);

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

function changeActiveColor(colorKey: string) {
  if (activeColorKey.value === colorKey) return;
  activeColorKey.value = colorKey;
  if (colorPicker.value) colorPicker.value.update();
}

function generateShades() {
  if (!colorPicker.value) return;

  const hue = colorPicker.value.hue;
  const saturation = colorPicker.value.saturation;

  const updatedColor = toRGBObject(activeColor.value?.default);

  document.body.style.setProperty(
    "--color-" + activeColorKey.value,
    `${updatedColor.r} ${updatedColor.g} ${updatedColor.b}`
  );

  const { s, l } = RGBToHSL(updatedColor.r, updatedColor.g, updatedColor.b);
  // console.log([s, l, colorSaturation]);

  const darkestColor = HSLToRGB(
    hue,
    saturation,
    l < 20 ? l * 0.01 + Math.random() * 0.05 : Math.random() * 0.1
  );
  const lightestColor = HSLToRGB(hue, saturation, 1 - Math.random() * 0.1);

  const steps = 10;

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

  colors.value.length = 0;

  Array.from(Array(steps).keys()).forEach((_, i: number) => {
    const index =
      invertGeneration.value || (l < 20 && activeColorKey.value === "bg")
        ? steps - i - 1
        : i;

    const lerpValue = lerpFactors[index];

    const newH = clamp(hue, 0, 360);
    const newL = clamp(lerpValue, 0, 100) * 0.01;
    // console.log([newH, lerpValue * s * 0.01, newL]);
    const rgb = HSLToRGB(newH, s * 0.01, newL);
    // console.log(rgb.formatted);

    colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  });

  shades.forEach((shade: number, index: number) => {
    document.body.style.setProperty(
      "--color-" + activeColorKey.value + "-" + shade,
      `${colors.value[index]}`
    );
    colorsMap.value[activeColorKey.value!].shades.set(
      "" + shade,
      `rgb(${colors.value[index]})`
    );
  });

  const contrast = getContrast(
    updatedColor,
    toRGBObject(colorsMap.value["text"].default)
  );
  console.log(contrast);
  if (contrast < 8 && activeColorKey.value === "bg") {
    generateTextShades(hue, l, steps);
  }
  // console.log(colors.value);
}

function generateTextShades(hue: number, l: number, steps: number) {
  let lightness = 0;

  // bg is light
  if (l > 60) {
    // my text should be dark
    lightness = Math.random() * 0.1;
  } else {
    lightness = 1 - Math.random() * 0.1;
  }
  const textMainColor = HSLToRGB(hue, 0.1, lightness);

  colorsMap.value["text"].default = textMainColor.formatted;
  document.body.style.setProperty(
    "--color-text",
    `${textMainColor.r} ${textMainColor.g} ${textMainColor.b}`
  );

  const { s } = RGBToHSL(textMainColor.r, textMainColor.g, textMainColor.b);

  console.log(lightness);

  const lerpFactors: number[] = lerpFromTo(
    l > 60 ? lightness + Math.random() * 0.1 : Math.random() * 0.1,
    l > 60 ? 1 - Math.random() * 0.1 : lightness - Math.random() * 0.1,
    steps
  );

  colors.value.length = 0;

  Array.from(Array(steps).keys()).forEach((_, i: number) => {
    const index = l < 40 ? steps - i - 1 : i;

    const lerpValue = lerpFactors[index];

    const newH = clamp(hue, 0, 360);
    const newL = clamp(lerpValue, 0, 100);
    const rgb = HSLToRGB(newH, s * 0.01, newL);
    // console.log(rgb.formatted);

    colors.value.push(`${rgb.r} ${rgb.g} ${rgb.b}`);
  });

  shades.forEach((shade: number, index: number) => {
    document.body.style.setProperty(
      "--color-text-" + shade,
      `${colors.value[index]}`
    );
    colorsMap.value["text"].shades.set(
      "" + shade,
      `rgb(${colors.value[index]})`
    );
  });
}

function storeTheme() {
  let colorsArray = [];
  for (const [key, value] of Object.entries(colorsMap.value)) {
    colorsArray.push(
      `--color-${key}: ${value.default.match(/\d+/g)?.join(" ")}`
    );
    value.shades.forEach((shade: string, shadeKey: string) => {
      colorsArray.push(
        `--color-${key}-${shadeKey}: ${shade.match(/\d+/g)?.join(" ")}`
      );
    });
  }
  themes.value[themeName.value] = colorsArray;
  localStorage.setItem("themes", JSON.stringify(themes.value));
}

function exportTheme() {
  let colorsArray = "";
  for (const [key, value] of Object.entries(colorsMap.value)) {
    colorsArray += `--color-${key}: ${value.default
      .match(/\d+/g)
      ?.join(" ")};\n`;
    value.shades.forEach((shade: string, shadeKey: string) => {
      colorsArray += `--color-${key}-${shadeKey}: ${shade
        .match(/\d+/g)
        ?.join(" ")};\n`;
    });
  }
  exportedTheme.value = colorsArray;
  exportWindowVisible.value = true;
}

function onThemeChanged(theme: string) {
  if (themes.value[theme] === undefined) return;

  themes.value[theme].forEach((themeColor: string) => {
    const colorData = themeColor.split(": ");
    document.body.style.setProperty(colorData[0], colorData[1]);

    const main = colorData[0].replace("--color-", "");
    console.log(main);

    if (!main.endsWith("0")) {
      colorsMap.value[main] = {
        default: `rgb(${colorData[1]})`,
        shades: new Map(),
      };
    } else {
      colorsMap.value[main.split("-")[0]]?.shades.set(
        main.replace(main.split("-")[0] + "-", ""),
        `rgb(${colorData[1]})`
      );
    }
  });
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
</script>
