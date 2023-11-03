import { App } from "vue";
import * as components from "./components";

const componentsList: { [key: string]: any } = components?.default;

const VelctComponents = {
	install(app: App) {
		Object.keys(componentsList).forEach((name) => {
			app.component(name, componentsList[name]);
		});
	},
};

export default VelctComponents;

export { VButton } from "./components/VButton";
export { VCheckBox } from "./components/VCheckBox";
export { VDataGrid } from "./components/VDataGrid";
export { VDatePicker } from "./components/VDatePicker";
export { VDropdown } from "./components/VDropdown";
export { VDynamicGrid } from "./components/VDynamicGrid";
export { VLabel } from "./components/VLabel";
export { VTextArea } from "./components/VTextArea";
export { VTextField } from "./components/VTextField";
