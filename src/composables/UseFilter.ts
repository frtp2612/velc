import { deepEqual } from "@/utilities/index";
import { computed, ref, type Ref } from "vue";

export const useFilter = <T extends { [key: string]: any }>(
  values: Ref<T[]>
) => {
  const filters = ref<Map<string, any>>(new Map());
  const filteredData: Ref<T[]> = ref(values.value) as Ref<T[]>;

  function setFilter(filterKey: string, filterValue: any) {
    if (filterValue === undefined || filterValue === null) {
      filters.value.delete(filterKey);
    } else {
      filters.value.set(filterKey, filterValue);
    }
    applyFilters();
  }

  function resetFilter(filterKey: string) {
    filters.value.delete(filterKey);
    applyFilters();
  }

  function applyFilters() {
    filteredData.value = values.value.filter((element) => {
      let success = true;
      filters.value!.forEach((value, key) => {
        if (typeof value === "string" || typeof value === "number") {
          let objectValue = element[key];
          if (objectValue === undefined || objectValue === null) {
            objectValue = "";
          }
          if (
            !objectValue
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())
          ) {
            success = false;
          }
        } else if (value instanceof Date) {
          let date = element[key];
          if (typeof element[key] === "string") {
            date = new Date(element[key]);
          }
          if (element[key] !== undefined && element[key] !== null) {
            success =
              (value as Date).toUTCString() === (date as Date).toUTCString();
          } else {
            success = false;
          }
        } else if (typeof value === "object") {
          if (
            element[key] != undefined &&
            "id" in value &&
            "id" in element[key]
          ) {
            success = value.id == element[key].id;
          } else {
            success = deepEqual(element[key], value);
          }
        } else {
          if (element[key] !== value) {
            success = false;
          }
        }
      });
      if (success) {
        return element;
      }
    });
  }

  return {
    filteredData,
    filters,
    setFilter,
    applyFilters,
    resetFilter,
  };
};
