import * as components from "./components";
import { App } from "vue";

const componentsList: { [key: string]: any } = components?.default;

const VelctComponents = {
  install(app: App) {
    Object.keys(componentsList).forEach((name) => {
      app.component(name, componentsList[name]);
    });
  },
};

export default VelctComponents;

export { VButton } from "./components/Button";
export { VDropdown } from "./components/Dropdown";
