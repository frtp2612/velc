import { VButtonWidget } from "./VButton";
import { VDataGridWidget } from "./VDataGrid";
import { VTodoListWidget } from "./VTodoList";
export const widgets = [
  {
    widget: VButtonWidget,
    name: "Counter",
    size: {
      x: 3,
      y: 3,
    },
  },
  {
    widget: VDataGridWidget,
    name: "Network Status",
    size: {
      x: 3,
      y: 3,
    },
  },
  {
    widget: VTodoListWidget,
    name: "Todos",
    size: {
      x: 3,
      y: 6,
    },
  },
];
