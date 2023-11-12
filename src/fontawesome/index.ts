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
  faCalendarDays,
  faCheck,
  faEllipsisVertical,
  faFilter,
  faGear,
  faHouse,
  faLeftRight,
  faLock,
  faRightFromBracket,
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
  faGear, // TODO REMOVE
  faRightFromBracket, // TODO REMOVE
  faHouse // TODO REMOVE
);

export { FontAwesomeIcon, library };
