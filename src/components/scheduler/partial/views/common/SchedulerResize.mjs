import * as t from "react";
import { SchedulerItem as h } from "../../items/SchedulerItemDisplay.jsx";
import { SchedulerViewItem as g } from "../../items/SchedulerViewItemDisplay.jsx";
import { useSchedulerPropsContext as w, useSchedulerGroupsContext as R, useSchedulerFieldsContext as p, useSchedulerDateRangeContext as x } from "../../context/SchedulerContext.mjs";
import { mapItemsToSlots as v } from "../../utils/index.jsx";
import { useSchedulerViewRangesContext as C, useSchedulerViewSlotsContext as z } from "../../context/SchedulerViewContext.mjs";
import { toOccurrences as y } from "../../services/occurrenceService.jsx";
import { toItems as D } from "../../services/itemsService.mjs";
const V = (e) => {
  const s = C(), { timezone: o } = w(), c = R(), i = p(), r = x(), [d] = z(), S = e.viewItem || u.viewItem, n = t.useMemo(
    () => y([e.dataItem], { dateRange: r, fields: i, timezone: o }),
    [e.dataItem, r.start.getTime(), r.end.getTime(), i, o]
  ), l = t.useMemo(
    () => D(n, { timezone: o }, { groups: c, ranges: s }),
    [n, o, c, s]
  ), f = (d || []).map((m) => m.current.props);
  return v(l, f), /* @__PURE__ */ t.createElement(t.Fragment, null, l.map((m, I) => {
      var a;

    return /* @__PURE__ */ t.createElement(
      S,
      {
        key: I,
        ...m,
        format: e.format,
        item: (a = e.item) != null ? a : u.item,
        resizeHint: !0,
        vertical: e.vertical,
        ignoreIsAllDay: e.ignoreIsAllDay
      }
    );
  }));
}, u = {
  viewItem: g,
  item: h
};
V.displayName = "KendoReactSchedulerResize";
export {
  V as SchedulerResize,
  u as schedulerResizeDefaultProps
};
