import { createRouter, createWebHistory } from "vue-router";

const routes = [
	{ path: "/", name: "Home", component: () => import("@/views/Home.vue") },
	{
		path: "/VButton",
		name: "VButton",
		component: () => import("@/views/examples/VButton/VButtonExample.vue"),
	},
	{
		path: "/VButtonGroup",
		name: "VButtonGroup",
		component: () =>
			import("@/views/examples/VButtonGroup/VButtonGroupExample.vue"),
	},
	{
		path: "/VDataGrid",
		name: "VDataGrid",
		component: () => import("@/views/examples/VDataGrid/VDataGridExample.vue"),
	},
	{
		path: "/VDropdown",
		name: "VDropdown",
		component: () => import("@/views/examples/VDropdown/VDropdownExample.vue"),
	},
	{
		path: "/VModalWindow",
		name: "VModalWindow",
		component: () =>
			import("@/views/examples/VModalWindow/VModalWindowExample.vue"),
	},
	{
		path: "/VPopover",
		name: "VPopover",
		component: () => import("@/views/examples/VPopover/VPopoverExample.vue"),
	},
	{
		path: "/VSplitView",
		name: "VSplitView",
		component: () =>
			import("@/views/examples/VSplitView/VSplitViewExample.vue"),
	},
{
    path: "/VLabel",
    name: "VLabel",
    component: () =>
    import(
        "@/views/examples/VLabel/VLabelExample.vue"
    )
},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
