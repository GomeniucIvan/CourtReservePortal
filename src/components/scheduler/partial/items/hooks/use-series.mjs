/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { useControlledState as o } from "../../hooks/useControlledState.mjs";
var c = /* @__PURE__ */ ((e) => (e.reset = "SERIES_RESET", e.set = "SERIES_SET", e.toggle = "SERIES_TOGGLE", e))(c || {});
const u = (e, r) => {
  switch (r.type) {
    case "SERIES_RESET":
      return null;
    case "SERIES_SET":
      return r.payload;
    case "SERIES_TOGGLE":
      return !e;
    default:
      return e;
  }
}, a = (e, r, n) => {
  const [s, t] = o(e, r, n);
  return [s, t, (S) => {
    const E = u(s, S);
    t(E);
  }];
};
export {
  c as SERIES_ACTION,
  a as useSeries
};
