import * as w from "react";
import { MultiDayView as u } from "../day/MultiDayViewDisplay.jsx";
import { DAYS_IN_WEEK_COUNT as r } from "../../constants/index.mjs";
import { ZonedDate as o, firstDayInWeek as g, getDate as c, addDays as E } from "@progress/kendo-date-math";
import { weekViewTitle as i, messages as p } from "../../messages/index.mjs";
import { toUTCDateTime as m } from "../../utils/index.jsx";
const y = (e) => /* @__PURE__ */ w.createElement(
  u,
  {
    ...e,
    step: r,
    numberOfDays: e.numberOfDays
  }
), k = (e) => c(e), _ = (e, t) => c(E(e, t || 1)), S = ({ intl: e, date: t, timezone: a }) => {
  const d = o.fromLocalDate(t, a), s = k(g(d, e.firstDay())), f = _(s, r), n = o.fromUTCDate(m(s), a), D = o.fromUTCDate(m(f), a), l = new Date(n.getTime()), T = new Date(D.getTime());
  return {
    start: l,
    end: T,
    zonedStart: n,
    zonedEnd: D
  };
}, O = {
  name: "week",
  slotDuration: 60,
  slotDivisions: 2,
  numberOfDays: r,
  dateRange: S,
  title: (e) => e.toLanguageString(i, p[i]),
  selectedDateFormat: "{0:D} - {1:D}",
  selectedShortDateFormat: "{0:d} - {1:d}"
};
y.displayName = "KendoReactSchedulerWeekView";
export {
  y as WeekView,
  O as weekViewDefaultProps
};
