
import * as t from "react";
import { SchedulerItem as g } from "../../items/SchedulerItemDisplay.jsx";
import { SchedulerViewItem as I } from "../../items/SchedulerViewItemDisplay.jsx";
import { useSchedulerPropsContext as h, useSchedulerGroupsContext as f, useSchedulerFieldsContext as p, useSchedulerDateRangeContext as w } from "../../context/SchedulerContext.jsx";
import { mapItemsToSlots as x } from "../../utils/index.jsx";
import { useSchedulerViewRangesContext as D, useSchedulerViewSlotsContext as v } from "../../context/SchedulerViewContext.mjs";
import { toOccurrences as C } from "../../services/occurrenceService.jsx";
import { toItems as R } from "../../services/itemsService.mjs";
const y = (e) => {
  const m = D(), { timezone: o } = h(), s = f(), c = p(), n = w(), [l] = v(), u = e.viewItem || V.viewItem, a = t.useMemo(
    () => C([e.dataItem], { dateRange: n, fields: c, timezone: o }),
    [e.dataItem, n, c, o]
  ), i = t.useMemo(
    () => R(a, { timezone: o }, { groups: s, ranges: m }),
    [a, o, s, m]
  ), d = (l || []).map((r) => r.current.props);
  return x(i, d), /* @__PURE__ */ t.createElement(t.Fragment, null, i.map((r, S) => /* @__PURE__ */ t.createElement(
    u,
    {
      key: S,
      ...r,
      item: e.item,
      dragHint: !0,
      vertical: e.vertical,
      ignoreIsAllDay: e.ignoreIsAllDay
    }
  )));
}, V = {
  viewItem: I,
  item: g
};
y.displayName = "KendoReactSchedulerDrag";
export {
  y as SchedulerDrag,
  V as schedulerDragDefaultProps
};
