import { Ref, computed } from "vue";

// Generic hook for detecting resize:
export const useDirtyChecker = <T extends { [key: string]: any }>(
	originalData: T,
	dataToWatch: Ref<T>
) => {
	const isDirty = computed<boolean>(() =>
		Object.keys(originalData).some((key: any) => {
			originalData[key] !== dataToWatch.value[key];
		})
	);

	return { isDirty };
};
