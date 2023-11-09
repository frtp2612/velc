import { createApp } from "vue";
import "./style/style.css";
import "./style/tailwind.css";

import directives from "./directives";
import router from "./router/index";

import App from "./views/App.vue";

import { FontAwesomeIcon } from "./fontawesome/index";
import i18n from "./localization/index";

const app = createApp(App);

directives(app);
app.use(i18n);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
