<template>
  <VDatePicker
    v-model="model"
    v-if="isDate"
    :id="id"
    class="w-full flex items-center h-full"
    :auto-focus="autoFocus"
  />
  <VSelect
    :id="id"
    v-model="model"
    :values="(props.descriptor as VDropdownCellEditor).values"
    :formatter="(props.descriptor as VDropdownCellEditor).formatter"
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
    class="w-full"
  />
  <VTextField
    v-model="model"
    v-else
    :id="id"
    :auto-focus="autoFocus"
    class="w-full"
  />
</template>

<script setup lang="ts">
import VDatePicker from "@/components/VDatePicker/index";
import VSelect from "@/components/VSelect/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { VDataType } from "@/enums";
import VNumericField from "../VNumericField/index";
import { VCellEditor, VDropdownCellEditor } from "../VDataGrid/types";

const props = withDefaults(
  defineProps<{
    id: string;
    descriptor: VCellEditor;
    autoFocus?: boolean;
  }>(),
  {
    autoFocus: false,
    formatter: (value: any) => value,
  }
);

const model = defineModel<any>();

const isDate = props.descriptor.type === VDataType.DATE;
const isSelect = props.descriptor.type === VDataType.SELECT;
const isNumber = props.descriptor.type === VDataType.NUMBER;
</script>
