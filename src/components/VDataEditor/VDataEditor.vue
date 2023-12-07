<template>
  <VCheckBox
    v-model="model"
    v-if="isBoolean || isEditableBoolean"
    class="w-full h-full"
    :id="id"
    resettable
  />
  <VDatePicker
    v-model="model"
    v-else-if="isDate"
    :id="id"
    class="w-full flex items-center h-full"
    :auto-focus="autoFocus"
  />
  <VSelect
    :id="id"
    v-model="model"
    :values="values!"
    :formatter="formatter"
    append-to="body"
    class="w-full"
    :auto-focus="autoFocus"
    v-else-if="isSelect"
  >
  </VSelect>
  <VNumericField
    :id="id"
    v-model="model"
    v-else-if="isNumber"
    :auto-focus="autoFocus"
    :placeholder="placeholder"
    class="w-full"
  />
  <VTextField
    v-model="model"
    v-else
    :id="id"
    :auto-focus="autoFocus"
    :placeholder="placeholder"
    class="w-full"
  />
</template>

<script setup lang="ts">
import VCheckBox from "@/components/VCheckBox/index";
import VDatePicker from "@/components/VDatePicker/index";
import VSelect from "@/components/VSelect/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { VDataType } from "@/enums";
import { useVModel } from "@vueuse/core";
import VNumericField from "../VNumericField/index";

const props = withDefaults(
  defineProps<{
    id: string;
    type?: VDataType;
    values?: any[];
    modelValue: any;
    formatter?: Function;
    autoFocus?: boolean;
    placeholder?: string;
  }>(),
  {
    autoFocus: false,
    formatter: (value: any) => value,
  }
);

const emit = defineEmits(["update:modelValue"]);

const model = useVModel(props, "modelValue", emit);

const isBoolean =
  props.type !== undefined && (props.type as VDataType) === VDataType.BOOLEAN;
const isEditableBoolean =
  props.type !== undefined &&
  (props.type as VDataType) === VDataType.EDITABLE_BOOLEAN;
const isDate =
  props.type !== undefined && (props.type as VDataType) === VDataType.DATE;
const isSelect =
  props.type !== undefined && (props.type as VDataType) === VDataType.SELECT;
const isNumber =
  props.type !== undefined && (props.type as VDataType) === VDataType.NUMBER;
</script>
