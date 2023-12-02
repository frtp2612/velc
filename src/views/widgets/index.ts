import { VButtonWidget } from "./VButton";
import { VDataGridWidget } from "./VDataGrid";
import { VTodoListWidget } from "./VTodoList";
export const widgets = [
	{
		widget: VButtonWidget,
		name: "Counter",
		size: {
			x: 1,
			y: 1,
		},
	},
	{
		widget: VDataGridWidget,
		name: "Network Status",
		size: {
			x: 2,
			y: 2,
		},
	},
	{
		widget: VTodoListWidget,
		name: "Todos",
		size: {
			x: 2,
			y: 3,
		},
	},
];
