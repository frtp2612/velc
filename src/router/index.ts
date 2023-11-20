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
    component: () => import("@/views/examples/VLabel/VLabelExample.vue"),
  },
  {
    path: "/VCheckBox",
    name: "VCheckBox",
    component: () => import("@/views/examples/VCheckBox/VCheckBoxExample.vue"),
  },
  {
    path: "/VTextField",
    name: "VTextField",
    component: () =>
      import("@/views/examples/VTextField/VTextFieldExample.vue"),
  },
  {
    path: "/VTextArea",
    name: "VTextArea",
    component: () => import("@/views/examples/VTextArea/VTextAreaExample.vue"),
  },
  {
    path: "/VDatePicker",
    name: "VDatePicker",
    component: () =>
      import("@/views/examples/VDatePicker/VDatePickerExample.vue"),
  },
  {
    path: "/VTree",
    name: "VTree",
    component: () => import("@/views/examples/VTree/VTreeExample.vue"),
  },
  {
    path: "/VTabbedView",
    name: "VTabbedView",
    component: () =>
      import("@/views/examples/VTabbedView/VTabbedViewExample.vue"),
  },
  {
    path: "/VNavigation",
    name: "VNavigation",
    component: () =>
      import("@/views/examples/VNavigation/VNavigationExample.vue"),
  },
{
    path: "/VMediaPlayer",
    name: "VMediaPlayer",
    component: () =>
    import(
        "@/views/examples/VMediaPlayer/VMediaPlayerExample.vue"
    )
},
{
    path: "/VContextMenu",
    name: "VContextMenu",
    component: () =>
    import(
        "@/views/examples/VContextMenu/VContextMenuExample.vue"
    )
},
{
    path: "/VDrawer",
    name: "VDrawer",
    component: () =>
    import(
        "@/views/examples/VDrawer/VDrawerExample.vue"
    )
},
{
    path: "/VDataList",
    name: "VDataList",
    component: () =>
    import(
        "@/views/examples/VDataList/VDataListExample.vue"
    )
},
{
    path: "/VNotification",
    name: "VNotification",
    component: () =>
    import(
        "@/views/examples/VNotification/VNotificationExample.vue"
    )
},
{
    path: "/VLoading",
    name: "VLoading",
    component: () =>
    import(
        "@/views/examples/VLoading/VLoadingExample.vue"
    )
},
{
    path: "/VProgressBar",
    name: "VProgressBar",
    component: () =>
    import(
        "@/views/examples/VProgressBar/VProgressBarExample.vue"
    )
},
{
    path: "/VFileUploader",
    name: "VFileUploader",
    component: () =>
    import(
        "@/views/examples/VFileUploader/VFileUploaderExample.vue"
    )
},
{
    path: "/VTimeLine",
    name: "VTimeLine",
    component: () =>
    import(
        "@/views/examples/VTimeLine/VTimeLineExample.vue"
    )
},
{
    path: "/VSwitcher",
    name: "VSwitcher",
    component: () =>
    import(
        "@/views/examples/VSwitcher/VSwitcherExample.vue"
    )
},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
