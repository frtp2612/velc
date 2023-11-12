import { ref, Ref, computed } from "vue";
export const useFilter = <T extends { [key: string]: any }>(
  values: Ref<T[]>
) => {
  const filters = ref<Map<string, any>>(new Map());

  function filter(this: { [key: string]: any }, dataValue: T) {
    console.log(Object.keys(this));

    return Object.keys(this).every((key) => {
      if (typeof dataValue[key] === "string") {
        return dataValue[key]
          .toString()
          .toLowerCase()
          .includes(this[key].toLowerCase());
      }
      return dataValue[key] === this[key];
    });
  }

  function setFilter(filterKey: string, filterValue: any) {
    if (filterValue === undefined) {
      filters.value.delete(filterKey);
    } else {
      filters.value.set(filterKey, filterValue);
    }
  }

  function applyFilters() {
    return values.value.filter((element) => {
      let success = true;
      filters.value!.forEach((value, key) => {
        if (typeof value === "string") {
          if (
            !element[key].toString().toLowerCase().includes(value.toLowerCase())
          ) {
            success = false;
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
    data: computed(() => applyFilters()),
    filter,
    filters,
    setFilter,
    applyFilters,
  };
};
