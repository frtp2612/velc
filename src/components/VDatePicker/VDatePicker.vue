<template>
	<div class="flex flex-col gap-2 justify-center">
		<VLabel v-if="label">{{ label }}</VLabel>
		<VPopover class="relative w-full" ref="popover">
			<template v-slot="{ events, attributes }">
				<div
					@click="events.toggle()"
					class="relative group border-color-border-50 hover:border-color-border-100 w-full"
				>
					<VTextField
						id="date-picker"
						v-model="formattedDate"
						:custom-class="inputBaseClass + ' !pl-10 w-full !flex'"
						autocomplete="off"
					/>
					<font-awesome-icon
						icon="fa-calendar-days"
						class="w-5 aspect-square absolute top-1/2 -translate-y-1/2 left-0 px-2 text-color-text-500 group-hover:text-color-text"
					/>

					<font-awesome-icon
						icon="fa-xmark"
						class="cursor-pointer w-5 aspect-square absolute top-1/2 -translate-y-1/2 right-0 p-2 text-color-text-500 hover:text-color-text"
						@click.capture.stop="resetDate(attributes.isOpen)"
						v-show="date"
					/>
				</div>
			</template>
			<template #content>
				<div class="flex flex-col gap-2 w-min">
					<div class="flex gap-2">
						<font-awesome-icon
							icon="fa-angle-left"
							class="w-5 h-5 p-2 hover:bg-color-bg-100 cursor-pointer rounded-md"
							@click.capture.stop="onChangeMonthClick(-1)"
						/>
						<div class="flex gap-2 justify-self-center">
							<VSelect
								id="month-select"
								:values="monthsIndeces"
								v-model="month"
								:formatter="monthFormatter"
								prevent-append
							>
								<VTextField
									id="month-select"
									:model-value="months[month]"
									custom-class="input-base"
									autocomplete="off"
								/>
							</VSelect>
							<VSelect
								id="year-select"
								:values="years"
								:formatter="yearFormatter"
								v-model="year"
								prevent-append
							>
								<VTextField
									id="year-select"
									:model-value="year"
									custom-class="input-base"
									autocomplete="off"
								/>
							</VSelect>
						</div>

						<font-awesome-icon
							icon="fa-angle-right"
							class="w-5 h-5 p-2 hover:bg-color-bg-100 cursor-pointer rounded-md"
							@click.capture.stop="onChangeMonthClick(1)"
						/>
					</div>
					<div
						class="grid gap-1 bg-color-bg-50 rounded-md py-1"
						:style="{ gridTemplateColumns: calendarGrid }"
					>
						<div v-for="day in days">
							<span class="aspect-square w-10 p-1 text-color-text">{{
								day.slice(0, 2)
							}}</span>
						</div>
					</div>
					<div>
						<div
							ref="calendarDays"
							class="grid gap-1"
							:style="{ gridTemplateColumns: calendarGrid }"
						>
							<div
								v-for="dayData in monthData"
								class="flex flex-col aspect-square w-10 p-1 rounded-md border justify-center relative"
								:class="[cellClass(dayData)]"
								@click.capture.stop="changeDate(dayData)"
							>
								<span class="pointer-events-none">{{ dayData.date }}</span>
								<div
									class="absolute bottom-0 mb-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-color-accent rounded-full"
									v-if="dayData.isToday"
								></div>
							</div>
						</div>
					</div>
				</div>
			</template>
		</VPopover>
	</div>
</template>

<script lang="ts" setup>
import VLabel from "@/components/VLabel/index";
import VPopover from "@/components/VPopover/VPopover.vue";
import VSelect from "@/components/VSelect/index";
import VTextField from "@/components/VTextField/VTextField.vue";
import { inputBaseClass } from "@/constants";
import { useVModel } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

type DateDetails = {
	index: number;
	numberOfDays: number;
	firstDay: number;
	year: number;
	month: number;
};

type DayDetails = {
	date: number;
	day: number;
	month: number;
	timestamp: number;
	dayString: string;
	isToday: boolean;
};

const props = withDefaults(
	defineProps<{
		modelValue?: Date | null;
		offsetDayIndices?: number;
		autoFocus?: boolean;
		label?: string;
		yearRangeOffsetMin?: number;
		yearRangeOffsetMax?: number;
	}>(),
	{
		offsetDayIndices: 0,
		yearRangeOffsetMin: -50,
		yearRangeOffsetMax: 10,
	}
);

const emit = defineEmits(["update:modelValue"]);

const date = useVModel(
	props,
	"modelValue",
	emit,
	props.modelValue
		? {}
		: {
				passive: true,
				defaultValue: null,
		  }
);

function dateIsValid(): boolean {
	return date.value !== null && date.value !== undefined;
}

const formattedDate = computed(() =>
	dateIsValid() ? getDateStringFromTimestamp(date.value!.getTime()) : ""
);

const normalizedSelectedDate = computed(() =>
	dateIsValid()
		? new Date(
				date.value!.getFullYear(),
				date.value!.getMonth(),
				date.value!.getDate(),
				0
		  )
		: undefined
);

const currentYear = new Date().getFullYear();

const years = Array.from(
	{ length: props.yearRangeOffsetMax + Math.abs(props.yearRangeOffsetMin) },
	(_, index: number) => props.yearRangeOffsetMax + currentYear - index
);

const monthFormatter = (monthIndex: number) => months[monthIndex];
const yearFormatter = (year: number) => `${year}`;

const monthsIndeces = Array.from(Array(12).keys());

const year = ref(
	dateIsValid() ? date.value!.getFullYear() : new Date().getFullYear()
);
const month = ref(
	dateIsValid() ? date.value!.getMonth() : new Date().getMonth()
);
const popover = ref<InstanceType<typeof VPopover> | null>(null);

function cellClass(dayData: DayDetails) {
	let finalClass = "";
	const isSelected = normalizedSelectedDate.value
		? dayData.timestamp === normalizedSelectedDate.value.getTime()
		: 0;
	const isToday = dayData.isToday;
	const isActiveMonth = dayData.month === 0;

	if (isToday) {
		if (isSelected) {
			finalClass += isActiveMonth
				? "cursor-pointer bg-color-accent border-transparent text-color-text-50"
				: "text-color-text-100 bg-color-accent-400 border-transparent";
		} else {
			finalClass += isActiveMonth
				? "cursor-pointer border-color-accent border-dashed hover:bg-color-accent-400"
				: "text-color-text-500 border-color-accent-300 border-dashed";
		}
	} else {
		finalClass += "border-transparent ";
		if (isActiveMonth) {
			finalClass += "cursor-pointer ";
			finalClass += isSelected
				? "bg-color-primary text-color-text-50 "
				: "hover:bg-color-bg-100";
		} else {
			finalClass += isSelected
				? "bg-color-primary-200 text-color-text-100"
				: "text-color-text-500";
		}
	}
	return finalClass;
}

const days = ref<string[]>([
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
]);

for (let index = 0; index < props.offsetDayIndices; index++) {
	days.value.push(days.value.shift()!);
}

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const oneDay = 60 * 60 * 24 * 1000;

const CALENDAR_ROWS = 6;
const CALENDAR_COLUMNS = 7;

let todayTimestamp =
	Date.now() -
	(Date.now() % oneDay) +
	new Date().getTimezoneOffset() * 1000 * 60;

const monthData = computed(() => getMonthInfo(year.value, month.value));
// Set dynamic calendar header
// const header = computed(() => getMonthStr(month.value) + " " + year.value);

const calendarGrid = `repeat(${CALENDAR_COLUMNS}, 1fr)`;

const getNumberOfDays = (year: number, month: number) => {
	return new Date(year, month, 0).getDate();
};

function getDayInfo(data: DateDetails): DayDetails {
	const dayOfTheWeek = data.index - data.firstDay + props.offsetDayIndices;

	const dayIndex = data.index % CALENDAR_COLUMNS;

	let previousMonth = data.month - 1;
	let previousYear = data.year;
	if (previousMonth < 0) {
		previousMonth = 11;
		previousYear--;
	}

	let previousMonthNumberOfDays = getNumberOfDays(
		previousYear,
		previousMonth + 1
	);

	let calculatedDate =
		(dayOfTheWeek < 0
			? previousMonthNumberOfDays + dayOfTheWeek
			: dayOfTheWeek % data.numberOfDays) + 1;
	let monthOffset =
		dayOfTheWeek < 0 ? -1 : dayOfTheWeek >= data.numberOfDays ? 1 : 0;
	let actualMonth = data.month + monthOffset;
	let timestamp = new Date(data.year, actualMonth, calculatedDate).getTime();
	const isToday = todayTimestamp === timestamp;

	return {
		date: calculatedDate,
		day: dayIndex,
		month: monthOffset,
		timestamp,
		dayString: days.value[dayIndex],
		isToday,
	};
}

function getMonthInfo(year: number, month: number): DayDetails[] {
	let firstDay = new Date(year, month).getDay();

	let numberOfDays = getNumberOfDays(year, month + 1);

	let monthList = [];
	let currentDay = null;
	const totalCells = CALENDAR_COLUMNS * CALENDAR_ROWS;
	for (let cell = 0; cell < totalCells; cell++) {
		currentDay = getDayInfo({
			index: cell,
			numberOfDays,
			firstDay,
			year,
			month,
		});

		monthList.push(currentDay);
	}

	return monthList;
}

// Get month str
const getMonthStr = (month: number) =>
	months[Math.max(Math.min(11, month), 0)] || "Month";

// Set year using arrows
const onChangeMonthClick = (offset: number) => {
	month.value = month.value + offset;
	if (month.value === -1) {
		month.value = 11;
		year.value--;
	} else if (month.value === 12) {
		month.value = 0;
		year.value++;
	}
};

// 1677139200000 => "2023-02-23"
const getDateStringFromTimestamp = (timestamp: number) => {
	let dateObject = new Date(timestamp);
	let month = dateObject.getMonth();
	let date = dateObject.getDate();

	return `${getMonthStr(month)} ${date}, ${dateObject.getFullYear()}`;
};

function changeDate(dayData: DayDetails) {
	if (dayData.month === 0) {
		const newDate = new Date(dayData.timestamp);
		date.value = new Date(
			Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
		);
	}
}

function resetDate(isOpen: boolean) {
	date.value = null;

	if (isOpen && popover.value !== null) {
		popover.value.close();
	}
}

onMounted(() => {
	if (props.autoFocus && popover.value !== null) {
		popover.value.open();
	}
});
</script>
