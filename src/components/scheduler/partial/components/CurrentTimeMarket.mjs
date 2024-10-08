/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as n from "react";
import * as T from "react-dom";
import { cloneDate as M } from "@progress/kendo-date-math";
import { useDir as C, classNames as z } from "@progress/kendo-react-common";
import { intersects as P, isInTimeRange as $, first as A } from "../utils/index.jsx";
import { getRect as d } from "../views/common/utilsJava.js";
import { useSchedulerElementContext as H, useSchedulerPropsContext as N } from "../context/SchedulerContext.mjs";
import { useSchedulerViewSlotsContext as O } from "../context/SchedulerViewContext.mjs";
const X = (e) => {
  let r = 0;
  return e.forEach((c) => {
    if (c.current) {
      const i = d(c.current.element);
      r += i.width;
    }
  }), r;
}, F = (e) => {
  let r = 0;
  return e.forEach((c) => {
    if (c.current) {
      const i = d(c.current.element);
      r += i.height;
    }
  }), r;
}, Y = (e, r) => {
  const c = M(e);
  return c.setHours(
    r.getHours(),
    r.getMinutes(),
    r.getSeconds(),
    r.getMilliseconds()
  ), c;
}, K = (e) => {
  const [r, c] = n.useState(!1), i = H(), y = N(), h = n.useRef(void 0), a = n.useRef(null), o = n.useRef(null), g = e.updateInterval || V.updateInterval, [, R] = n.useState(!1), u = C(o, y.rtl === !0 ? "rtl" : void 0), [v] = O(), m = n.useCallback(
    () => {
      if (!v)
        return;
      const s = v.filter((t) => t.current && (e.groupIndex === void 0 || e.groupIndex === null || t.current.props.group.index === e.groupIndex) && (e.vertical ? P(/* @__PURE__ */ new Date(), /* @__PURE__ */ new Date(), t.current.props.start, t.current.props.end, !0) : $(/* @__PURE__ */ new Date(), t.current.props.start, t.current.props.end)) && !t.current.props.isAllDay);
      if (s && s.length && a.current && o.current) {
        const t = A(s);
        if (!t.current)
          return;
        const S = e.vertical ? F(s) : X(s), l = d(t.current.element), I = d(a.current), k = (e.vertical ? l.width : l.height) / (t.current.props.end.getTime() - t.current.props.start.getTime()), D = (Date.now() - Y(/* @__PURE__ */ new Date(), t.current.props.start).getTime()) * k, E = u === "rtl", b = e.vertical ? l.top : l.top + D - I.height / 2, f = E ? "right" : "left", p = e.vertical ? l[f] + D - I.width / 2 : l[f];
        e.vertical ? a.current.style[f] = `${p}px` : a.current.style.top = `${b}px`, o.current.style[f] = `${p}px`, o.current.style.top = `${b}px`, o.current.style[e.vertical ? "height" : "width"] = `${S - 1}px`, c(!0);
      } else
        c(!1);
    },
    [v, e.groupIndex, e.vertical, u]
  ), w = n.useCallback(
    () => {
      m(), R((s) => !s);
    },
    [m]
  );
  n.useEffect(
    () => {
      if (!i.current || !window)
        return;
      clearInterval(h.current), h.current = window.setInterval(w, g);
      const s = window.ResizeObserver, t = s && new s(w);
      return t && t.observe(i.current), () => {
        clearInterval(h.current), t && t.disconnect();
      };
    },
    [m, w, i, g]
  ), n.useEffect(m);
  const x = /* @__PURE__ */ n.createElement(
    "div",
    {
      ref: a,
      className: z(
        "k-current-time",
        {
          "k-current-time-arrow-right": !e.vertical && u !== "rtl",
          "k-current-time-arrow-left": !e.vertical && u === "rtl",
          "k-current-time-arrow-down": e.vertical
        }
      ),
      style: {
        transform: e.vertical ? u === "rtl" ? "translateX(50%)" : "translateX(-50%)" : "translateY(-50%)",
        visibility: r ? void 0 : "hidden"
      }
    }
  );
  return /* @__PURE__ */ n.createElement(n.Fragment, null, e.attachArrow && e.attachArrow.current ? T.createPortal(x, e.attachArrow.current) : x, /* @__PURE__ */ n.createElement(
    "div",
    {
      className: "k-current-time",
      ref: o,
      style: {
        transform: e.vertical ? "translateX(-50%)" : "translateY(-50%)",
        [e.vertical ? "width" : "height"]: "1px",
        visibility: r ? void 0 : "hidden"
      }
    }
  ));
}, V = {
  updateInterval: 6e4
};
export {
  K as CurrentTimeMarker
};
