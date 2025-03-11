/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as s from "react";
import { getPadding as R, getRect as b, setRect as E } from "../views/common/utilsJava.js";
import { BORDER_WIDTH as _ } from "../constants/index.mjs";
import { useIsomorphicLayoutEffect as w } from "@progress/kendo-react-common";
import { useSchedulerElementContext as x } from "../context/SchedulerContext.jsx";
const z = (e, t) => {
  const f = s.useRef(), p = s.useRef(0), a = x(), d = () => {
    if (!e.current)
      return;
    const n = e.current.element;
    n && (p.current = n.clientHeight);
  }, m = s.useCallback(() => {
    if (!t || !e.current)
      return;
    const n = e.current.element, h = e.current.props;
    if (!n)
      return;
    const u = R(n);
    let r = 0;
    const i = h.items.filter((o) => o._ref.current);
    i.forEach((o) => {
      if (!o._ref.current)
        return;
      const { height: g } = b(o._ref.current.element);
      r += g;
    });
    const c = i.length * _ * 2 + r - (u || 0) + (typeof t == "object" && t.offsetTop ? t.offsetTop : 0) + (typeof t == "object" && t.offsetBottom ? t.offsetBottom : 0);
    i.length ? c > p.current - u && E(
      n,
      { height: c },
      !0
    ) : n && (n.style.minHeight = "");
  }, [t, e]), l = s.useCallback(() => {
    f.current !== void 0 && window.cancelAnimationFrame(f.current), f.current = window.requestAnimationFrame(() => {
      m();
    });
  }, [m]);
  w(d, []), s.useEffect(m, [e, e.current && e.current.props, t]), s.useEffect(
    () => {
      if (!e.current)
        return;
      const u = e.current.props.items.filter((r) => r._ref.current).map((r) => {
        if (!r._ref.current || !r._ref.current.element || !a.current)
          return;
        const i = window.ResizeObserver, c = i && new i(l);
        return c && c.observe(r._ref.current.element), () => {
          c && c.disconnect();
        };
      });
      return () => {
        u.forEach((r) => r && r());
      };
    },
    [l, a, e]
  );
};
export {
  z as useSlotExpand
};
