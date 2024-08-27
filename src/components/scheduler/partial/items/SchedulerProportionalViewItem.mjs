import * as r from "react";
import { SchedulerItem as ce } from "./SchedulerItemDisplay.jsx";
import { first as $, last as le, calculateOrder as se, intersects as q } from "../utils/index.jsx";
import { getRect as R, setRect as B } from "../views/common/utilsJava.js";
import { BORDER_WIDTH as d } from "../constants/index.mjs";
import { useInternationalization as oe } from "@progress/kendo-react-intl";
import { SchedulerItemContent as G } from "./SchedulerItemContent.mjs";
import { useDir as ae, IconWrap as P } from "@progress/kendo-react-common";
import { caretAltRightIcon as me, caretAltLeftIcon as ue, arrowRotateCwIcon as de, nonRecurrenceIcon as fe } from "@progress/kendo-svg-icons";
import { useSchedulerViewItemsContext as ge, useSchedulerViewSlotsContext as he } from "../context/SchedulerViewContext.mjs";
import { useSchedulerElementContext as Se } from "../context/SchedulerContext.mjs";
const Ie = 1, Re = r.forwardRef((e, K) => {
  const { item: L, _ref: j, itemRef: J, ...Q } = e, v = r.useRef(), l = r.useRef(null), A = r.useRef(null), T = r.useRef(null);
  r.useImperativeHandle(A, () => ({ props: e, element: l.current && l.current.element })), r.useImperativeHandle(K, () => A.current), r.useImperativeHandle(j, () => l.current), r.useImperativeHandle(J, () => l.current);
  const U = L || ve.item, w = oe(), [X] = ge(), [D] = he(), h = Se(), [Y, E] = r.useState(!0), [Z, p] = r.useState(!1), [ee, te] = r.useState(0), M = ae(h), _ = r.useMemo(
    () => e.isAllDay ? w.toString(e.zonedStart, "t") : w.format("{0:t} - {1:t}", e.zonedStart, e.zonedEnd),
    [w, e.isAllDay, e.zonedEnd, e.zonedStart]
  ), C = r.useMemo(() => `(${_}): ${e.title}`, [_, e.title]), O = (n, t) => {
    let i = 1;
    return n.forEach((o) => {
      const m = t.filter((f) => S(o.current.props, f.props));
      m.length > i && (i = m.length);
    }), i;
  }, ne = (n, t) => n.map((o) => t.filter((m) => S(o.current.props, m.props))), S = (n, t) => q(n.start, n.end, t.start, t.end) && n.group.index === t.group.index && n.range.index === t.range.index && (e.ignoreIsAllDay || n.isAllDay === t.isAllDay), b = () => {
    const n = (D || []).filter((o) => o.current && S(o.current.props, e));
    if (n.length === 0) {
      E(!1);
      return;
    }
    const t = $(n);
    if (!t.current || !l.current)
      return;
    const i = R(t.current.element);
    B(l.current.element, i);
  }, H = () => {
    const n = (D || []).filter((s) => s.current && S(s.current.props, e)), t = l.current && l.current.element;
    if (!t || !n.length)
      return;
    const i = $(n), o = le(n);
    if (!i.current || !l.current || !o.current)
      return;
    const m = [], f = [], x = [], k = R(i.current.element), N = (e.vertical ? k.height : k.width) / (i.current.props.end.getTime() - i.current.props.start.getTime()), I = (e.start.getTime() - i.current.props.start.getTime()) * N, F = (Math.min(e.end.getTime(), o.current.props.end.getTime()) - Math.max(e.start.getTime(), i.current.props.start.getTime())) * N;
    (X || []).forEach((s) => {
      s.current && (s.current.props.dragHint ? f.push(s.current) : s.current.props.resizeHint ? x.push(s.current) : m.push(s.current));
    });
    const g = e.dragHint || e.resizeHint ? se(l.current, e.dragHint ? f : x, n, e.ignoreIsAllDay) : e.order || 0;
    let u = e.dragHint || e.resizeHint ? O(n, e.dragHint ? f : x) : O(n, m);
    const re = ne(n, m);
    let y = 0;
    const c = R(t);
    if (re.forEach((s) => {
      let z = 0;
      s.forEach((a) => {
        q(a.props.start, a.props.end, e.start, e.end) && !(e.dragHint || e.resizeHint) && a.props._maxSiblingsPerSlot && a.props._maxSiblingsPerSlot > u && a.element !== t && (u = a.props._maxSiblingsPerSlot);
        const W = R(a.element);
        a.props.order !== null && a.props.order < g && (z = W.top + W.height - c.top - d * g + Ie);
      }), z > y && (y = z);
    }), n.length === 0) {
      E(!1);
      return;
    }
    const ie = 20;
    c.width = e.vertical ? c.width / u - d - ie / u : F + d, c.height = e.vertical ? F - d : (e.resizeHint || e.dragHint) && u <= 1 ? c.height : e.style && e.style.height ? e.style.height : 25, c.left = e.vertical ? c.left + g * c.width + d * g : c.left + (I < 0 ? 0 : I), c.top = e.vertical ? c.top + (I < 0 ? 0 : I) : c.top + y + d * g, te(u), B(t, c), p(!0), E(!0);
  }, V = r.useCallback(
    (n) => {
      const t = n && n[0], i = T.current;
      v.current !== void 0 && window.cancelAnimationFrame(v.current), i && t && (i.width !== t.contentRect.width || i.height !== t.contentRect.height) && (v.current = window.requestAnimationFrame(() => {
        b(), H();
      })), T.current = { width: t.contentRect.width, height: t.contentRect.height };
    },
    [b, H]
  );
  return r.useEffect(b), r.useEffect(H), r.useEffect(
    () => {
      if (!h.current)
        return;
      const n = window.ResizeObserver, t = n && new n(V);
      return t && t.observe(h.current), () => {
        t && t.disconnect();
      };
    },
    [V, h]
  ), /* @__PURE__ */ r.createElement(
    U,
    {
      ...Q,
      _ref: l,
      _maxSiblingsPerSlot: ee,
      itemRef: l,
      style: {
        visibility: Z ? void 0 : "hidden",
        display: Y ? void 0 : "none",
        ...e.style
      }
    },
    !e.resizeHint && /* @__PURE__ */ r.createElement("span", { className: "k-event-actions" }, e.tail && /* @__PURE__ */ r.createElement(
      P,
      {
        name: M === "rtl" ? "caret-alt-right" : "caret-alt-left",
        icon: M === "rtl" ? me : ue
      }
    ), e.isRecurring && !e.isException && /* @__PURE__ */ r.createElement(P, { name: "reload", icon: de }), !e.isRecurring && e.isException && /* @__PURE__ */ r.createElement(P, { name: "non-recurrence", icon: fe })),
    !e.resizeHint && /* @__PURE__ */ r.createElement("div", { title: C }, !e.isAllDay && /* @__PURE__ */ r.createElement(G, { className: "k-event-template k-event-time " }, C), /* @__PURE__ */ r.createElement(G, { className: "k-event-template" }, e.title))
  );
}), ve = {
  item: ce
};
Re.displayName = "KendoReactSchedulerProportionalViewItem";
export {
  Re as SchedulerProportionalViewItem,
  ve as schedulerProportionalViewItemDefaultProps
};
