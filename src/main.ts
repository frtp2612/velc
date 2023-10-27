import { createApp } from "vue";
import "./style/style.css";
import "./style/tailwind.css";

import directives from "./directives";
import router from "./router/index";

import App from "./views/App.vue";

const app = createApp(App);

app.use(router);

directives(app);
app.mount("#app");
