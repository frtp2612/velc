/* import the fontawesome core */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import specific icons */
import {
  faAngleDown,
  faAngleLeft,
  faAngleRight,
  faArrowDownWideShort,
  faArrowUpShortWide,
  faBarsStaggered,
  faCalendarDays,
  faCheck,
  faDownLeftAndUpRightToCenter,
  faEllipsisVertical,
  faExclamation,
  faFilter,
  faGear,
  faHouse,
  faLeftRight,
  faLightbulb,
  faLock,
  faPause,
  faPlay,
  faRightFromBracket,
  faStop,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(
  faEllipsisVertical,
  faLock,
  faArrowDownWideShort,
  faArrowUpShortWide,
  faLeftRight,
  faCheck,
  faAngleDown,
  faAngleRight,
  faAngleLeft,
  faCalendarDays,
  faFilter,
  faXmark,
  faPlay,
  faStop,
  faPause,
  faGear, // TODO REMOVE
  faRightFromBracket, // TODO REMOVE
  faHouse, // TODO REMOVE
  faDownLeftAndUpRightToCenter,
  faBarsStaggered,
  faLightbulb,
  faExclamation,
  faTrashCan
);

export { FontAwesomeIcon, library };
