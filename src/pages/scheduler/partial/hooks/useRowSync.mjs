/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as f from "react";
import { getPadding as h, setRect as m } from "../views/common/utilsJava.js";
import { BORDER_WIDTH as y } from "../constants/index.mjs";
const A = (t) => t.slice(1, t.length), R = (t, l) => {
  const { element: c } = t, s = () => {
    if (!c || !t.syncHeight)
      return;
    let i = [[]];
    Array.from(c.querySelectorAll(t.selector)).filter((e) => !e.classList.contains(A(t.applyTo))).forEach((e) => {
      const r = e.clientHeight, o = e.getAttribute(t.horizontalAttribute), n = e.getAttribute(t.verticalAttribute);
      o === null || n === null || (i[o] || (i[o] = []), (!i[o][n] || r > i[o][n]) && (i[o][n] = r - y));
    }), Array.from(c.querySelectorAll(t.applyTo)).forEach((e) => {
      const r = e.getAttribute(t.horizontalAttribute), o = e.getAttribute(t.verticalAttribute);
      if (r === null || o === null)
        return;
      const n = h(e), u = i[r][o] - n;
      m(e, { height: u }, !0);
    });
  };
  f.useEffect(s, l);
};
export {
  R as useRowSync
};
