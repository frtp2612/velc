import { Ref, computed, ref } from "vue";
import { deepEqual } from "../utilities/index";

export const useFilter = <T extends { [key: string]: any }>(
	values: Ref<T[]>
) => {
	const filters = ref<Map<string, any>>(new Map());

	function filter(this: { [key: string]: any }, dataValue: T) {
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
		if (filterValue === undefined || filterValue === null) {
			filters.value.delete(filterKey);
		} else {
			filters.value.set(filterKey, filterValue);
		}
	}

	function resetFilter(filterKey: string) {
		filters.value.delete(filterKey);
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
					success = deepEqual(element[key], value);
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
		resetFilter,
	};
};
