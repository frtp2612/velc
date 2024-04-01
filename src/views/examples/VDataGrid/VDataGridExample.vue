<template>
  <ComponentExampleTemplate title="VDataGrid" component-name="VDataGrid">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" example="">
        <div class="flex flex-col min-w-0 h-full gap-2">
          <div class="flex gap-4 w-full">
            <VButton :on-click="() => (filterOdd = !filterOdd)"
              >Filter odd</VButton
            >
            <VNumericField
              id="jump-to"
              @update:model-value="(value: number) => table!.scrollTo(value)"
            />
          </div>
          <VDataGrid
            :columns="columns"
            :rows="filteredRows"
            :column-groups="columnGroups"
            :descriptor="gridDescriptor"
            ref="table"
          >
          </VDataGrid>
        </div>
      </ComponentExampleBlockTemplate>
    </template>
  </ComponentExampleTemplate>
</template>

<script lang="ts" setup>
import VDataGrid from "@/components/VDataGrid/VDataGrid.vue";
import VNumericField from "@/components/VNumericField/VNumericField.vue";
import { VDataType } from "@/enums";
import ComponentExampleBlockTemplate from "@/views/templates/ComponentExampleBlockTemplate.vue";
import ComponentExampleTemplate from "@/views/templates/ComponentExampleTemplate.vue";
import { computed, ref } from "vue";
import VButton from "../../../components/VButton/index";
import { TranslationType } from "../../../enums/index";
import {
  VDataColumn,
  VDataRow,
  VDataGroupColumn,
} from "@/components/VDataGrid/types";
import type { ComponentExposed } from "vue-component-type-helpers";
import { VDataGridDescriptor } from "../../../components/VDataGrid/types";

const table = ref<ComponentExposed<typeof VDataGrid<VDataRow>> | null>(null);
const filterOdd = ref(false);

const columnsAmount = 10;
const values = Array.from(Array(8)).map((_, i) => ({
  id: "user" + i,
  name: "user" + Math.floor(Math.random() * Date.now()).toString(36),
}));

const columnGroups: VDataGroupColumn[] = [
  {
    id: "group1",
    label: {
      type: TranslationType.RAW,
      value: "Group1",
    },
    span: 3,
  },
  {
    id: "group2",
    label: {
      type: TranslationType.RAW,
      value: "Group2",
    },
    span: 2,
  },
  {
    id: "group3",
    label: {
      type: TranslationType.RAW,
      value: "Group3",
    },
    span: 2,
  },
  {
    id: "group4",
    label: {
      type: TranslationType.RAW,
      value: "Group4",
    },
    span: 3,
  },
];

const getType = (index: number): VDataType => {
  if (index === columnsAmount - 2 || index === columnsAmount - 1) {
    return VDataType.BOOLEAN;
  } else if (index === columnsAmount - 3) {
    return VDataType.EDITABLE_BOOLEAN;
  } else if (index === columnsAmount - 4) {
    return VDataType.SELECT;
  } else if (index === columnsAmount - 5) {
    return VDataType.DATE;
  }
  return VDataType.STRING;
};

const columns: VDataColumn[] = Array.from(Array(columnsAmount)).map((_, i) => ({
  id: "col" + i,
  label: {
    type: TranslationType.RAW,
    value: "col-" + i,
  },
  descriptor: {
    isLocked: i === 0 || i === 1,
  },
}));

const gridDescriptor: VDataGridDescriptor<VDataRow> = {
  getDataType(_row, column) {
    return getType(parseInt(column.id.replace("col", "")));
  },
  getValueFormatter(row, column) {
    if (column.id === "col6") {
      return () => row[column.id].name;
    }
    return () => row[column.id];
  },
};

const rows = ref(
  Array.from(Array(10)).map((_, i) => {
    let row: VDataRow = {
      id: i,
    };

    columns.forEach((column: VDataColumn) => {
      const type: VDataType = gridDescriptor.getDataType(row, column);
      if (type !== undefined) {
        if (type === VDataType.STRING) {
          row[column.id] =
            i !== 0 ? Math.floor(Math.random() * Date.now()).toString(36) : "";
        } else if (type === VDataType.SELECT) {
          row[column.id] = values[Math.floor(Math.random() * values.length)];
        } else if (type === VDataType.DATE) {
          row[column.id] =
            Math.round(Math.random()) === 0 ? new Date() : undefined;
        } else {
          row[column.id] = Math.round(Math.random()) === 0 ? true : false;
        }
      }
    });

    return row;
  })
);

const filteredRows = computed(() => {
  const filter = rows.value.filter((_row: VDataRow, index: number) =>
    filterOdd.value ? index % 2 === 0 : true
  );
  return filter;
});

// const rowsFromTable = computed(() => table.value?.rows);
</script>
