/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { getPadding as h, getBorders as p } from "../views/common/utilsJava.js";
import { useIsomorphicLayoutEffect as b } from "@progress/kendo-react-common";
const x = (e, f) => {
  const { element: l } = e;
  b(() => {
    if (!l || !l.current)
      return;
    let r = [], o = [], c = [];
    const u = l.current.querySelectorAll(e.selector);
    u.forEach((i) => {
      const n = i.getBoundingClientRect().width, t = e.explicitDepth && e.attribute !== void 0 ? i.getAttribute(e.attribute) : 0, d = h(i, !0), s = p(i, !0);
      t !== null && ((!c[t] || s > c[t]) && (c[t] = s), (!o[t] || d > o[t]) && (o[t] = d), (!r[t] || n > r[t]) && (r[t] = n));
    }), u.forEach((i) => {
      const n = e.explicitDepth ? i.getAttribute(e.attribute) : 0;
      n !== null && (i.style.minWidth = `${r[n] - o[n] - c[n]}px`);
    });
  }, f);
};
export {
  x as useCellSync
};
