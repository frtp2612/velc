import { ref, type Ref } from "vue";

export interface SorterReturnType<T extends { [key: string]: any }> {
  // sortedData: Ref<T[]>;
  sortKey: Ref<string>;
  sortOrder: Ref<string>;
  sort: (key: string, formatter: Function | undefined) => void;
  applySort: (data: Ref<T[]>) => T[];
}

export type SorterType = <T extends { [key: string]: any }>(
  // data: Ref<T[]>,
  defaultSortKey: string | undefined,
  defaultSortOrder: string | undefined
) => SorterReturnType<T>;

// Generic hook for handling sorting:
export const useSorter: SorterType = <T extends { [key: string]: any }>(
  defaultSortKey: string | undefined = "",
  defaultSortOrder: string | undefined = "asc"
) => {
  const sortKey = ref<string>(defaultSortKey);
  const sortOrder = ref<string>(defaultSortOrder);

  const formatter = ref<Function | undefined>();

  function sort(key: string, _formatter: Function | undefined) {
    formatter.value = _formatter;
    if (key === sortKey.value) {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    }

    sortKey.value = key;
  }

  function applySort(data: Ref<T[]>) {
    const sortedData = [...data.value].sort((a: any, b: any) => {
      const valueA =
        a[sortKey.value] === null
          ? ""
          : typeof a[sortKey.value] === "string"
          ? a[sortKey.value].toUpperCase()
          : formatter.value !== undefined
          ? formatter.value(a[sortKey.value])
          : a[sortKey.value];
      const valueB =
        b[sortKey.value] === null
          ? ""
          : typeof b[sortKey.value] === "string"
          ? b[sortKey.value].toUpperCase()
          : formatter.value !== undefined
          ? formatter.value(b[sortKey.value])
          : b[sortKey.value];

      let comparison = 0;

      if (valueA < valueB) {
        comparison = -1;
      } else if (valueA > valueB) {
        comparison = 1;
      }

      return sortOrder.value === "desc" ? comparison * -1 : comparison;
    });

    return sortedData;
  }

  return {
    sortKey,
    sortOrder,
    sort,
    applySort,
  };
};
