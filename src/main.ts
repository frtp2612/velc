import { createApp } from "vue";
import "./style/style.css";
import "./style/tailwind.css";

import directives from "./directives";
import router from "./router/index";

import App from "./views/App.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
	faArrowDownWideShort,
	faArrowUpShortWide,
	faEllipsisVertical,
	faLock,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
	faEllipsisVertical,
	faLock,
	faArrowDownWideShort,
	faArrowUpShortWide
);

const app = createApp(App);

app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);
directives(app);
app.mount("#app");
