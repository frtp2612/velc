/* import the fontawesome core */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import specific icons */
import {
	faAngleDown,
	faArrowDownWideShort,
	faArrowUpShortWide,
	faCheck,
	faEllipsisVertical,
	faLeftRight,
	faLock,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
	faEllipsisVertical,
	faLock,
	faArrowDownWideShort,
	faArrowUpShortWide,
	faLeftRight,
	faCheck,
	faAngleDown
);

export { FontAwesomeIcon, library };
