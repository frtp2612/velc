<template>
  <ComponentExampleTemplate title="VDataGrid" component-name="VDataGrid">
    <template #usage>
      <ComponentExampleBlockTemplate title="Example 1" example="">
        <div class="flex flex-col min-w-0 h-full gap-2">
          <div class="flex gap-4 w-full">
            <VButton :on-click="addRow" :type="VButtonTypes.PRIMARY"
              >Add</VButton
            >
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
import { VButtonTypes, VDataType } from "@/enums";
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

const getType = (index: number): VDataType | undefined => {
  if (index === columnsAmount - 2 || index === columnsAmount - 1) {
    return VDataType.BOOLEAN;
  } else if (index === columnsAmount - 6) {
    return VDataType.EDITABLE_BOOLEAN;
  } else if (index === columnsAmount - 8) {
    return VDataType.SELECT;
  } else if (index === columnsAmount - 9) {
    return VDataType.DATE;
  }
  return undefined;
};

const columns: VDataColumn<VDataRow>[] = Array.from(Array(columnsAmount)).map(
  (_, i) => ({
    id: "col" + i,
    label: {
      type: TranslationType.RAW,
      value: "col-" + i,
    },
    valueFormatter:
      i === columnsAmount - 8
        ? (value: any) => (value ? value.name : "")
        : i === columnsAmount - 2 || i === columnsAmount - 1
        ? (value: any) => (value ? "fa-check" : undefined)
        : (value: any) => value,
    locked: i === 0 || i === 1,
    dataType: getType(i),
  })
);

const rows = ref(
  Array.from(Array(100)).map((_, i) => {
    let row: VDataRow = {
      id: i,
    };

    columns.forEach((column: VDataColumn<VDataRow>) => {
      if (column.dataType !== undefined) {
        if (column.dataType === VDataType.SELECT) {
          row[column.id] = values[Math.floor(Math.random() * values.length)];
        } else if (column.dataType === VDataType.DATE) {
          row[column.id] =
            Math.round(Math.random()) === 0 ? new Date() : undefined;
        } else {
          row[column.id] = Math.round(Math.random()) === 0 ? true : false;
        }
      } else {
        row[column.id] =
          i !== 0 ? Math.floor(Math.random() * Date.now()).toString(36) : "";
      }
    });

    return row;
  })
);

function addRow() {
  rows.value.push(rowToAdd[0]);
}

const rowToAdd = Array.from(Array(1)).map((_, i) => {
  let row: VDataRow = {
    id: i + rows.value.length,
  };

  columns.forEach((column: VDataColumn<VDataRow>) => {
    if (column.dataType !== undefined) {
      if (column.dataType === VDataType.SELECT) {
        row[column.id] = values[Math.floor(Math.random() * values.length)];
      } else if (column.dataType === VDataType.DATE) {
        row[column.id] =
          Math.round(Math.random()) === 0 ? new Date() : undefined;
      } else {
        row[column.id] = Math.round(Math.random()) === 0 ? true : false;
      }
    } else {
      row[column.id] = Math.floor(Math.random() * Date.now()).toString(36);
    }
  });

  return row;
});

const filteredRows = computed(() => {
  const filter = rows.value.filter((_row: VDataRow, index: number) =>
    filterOdd.value ? index % 2 === 0 : true
  );
  return filter;
});

// const rowsFromTable = computed(() => table.value?.rows);
</script>
