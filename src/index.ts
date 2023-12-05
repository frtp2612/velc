import type { App } from "vue";
import * as components from "./components";

const componentsList: { [key: string]: any } = components?.default;

const Velc = {
	install: (app: App): any => {
		Object.keys(componentsList).forEach((name) => {
			app.component(name, componentsList[name]);
		});
	},
};

export default Velc;

export { VAlert } from "./components/VAlert";
export { VButton } from "./components/VButton";
export { VButtonGroup } from "./components/VButtonGroup";
export { VCheckBox } from "./components/VCheckBox";
export { VContextMenu } from "./components/VContextMenu";
export { VDataGrid } from "./components/VDataGrid";
export { VDataList } from "./components/VDataList";
export { VDatePicker } from "./components/VDatePicker";
export { VDivider } from "./components/VDivider";
export { VDrawer } from "./components/VDrawer";
export { VDropdown } from "./components/VDropdown";
export { VDynamicBentoGrid } from "./components/VDynamicBentoGrid";
export { VFileUploader } from "./components/VFileUploader";
export { VLabel } from "./components/VLabel";
export { VLoading } from "./components/VLoading";
export { VModalWindow } from "./components/VModalWindow";
export { VNavigation } from "./components/VNavigation";
export { VNotification } from "./components/VNotification";
export { VNumericField } from "./components/VNumericField";
export { VPopover } from "./components/VPopover";
export { VProgressBar } from "./components/VProgressBar";
export { VSelect } from "./components/VSelect";
export { VSplitPanel, VSplitView } from "./components/VSplitView";
export { VStepPanel, VStepper } from "./components/VStepper";
export { VSwitcher } from "./components/VSwitcher";
export { VTabPanel, VTabbedView } from "./components/VTabbedView";
export { VTextArea } from "./components/VTextArea";
export { VTextField } from "./components/VTextField";
export { VThemeCustomizer } from "./components/VThemeCustomizer";
export { VTimeLine } from "./components/VTimeLine";
export { VTree } from "./components/VTree";
export { VWidget } from "./components/VWidget";
