/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { useControlledState as O } from "../../hooks/useControlledState.mjs";
var a = /* @__PURE__ */ ((e) => (e.set = "SHOW_REMOVE_DIALOG_SET", e.open = "SHOW_REMOVE_DIALOG_OPEN", e.close = "SHOW_REMOVE_DIALOG_CLOSE", e.reset = "SHOW_REMOVE_DIALOG_RESET", e.toggle = "SHOW_REMOVE_DIALOG_TOGGLE", e))(a || {});
const l = (e, o) => {
  switch (o.type) {
    case "SHOW_REMOVE_DIALOG_RESET":
      return !1;
    case "SHOW_REMOVE_DIALOG_SET":
      return o.payload;
    case "SHOW_REMOVE_DIALOG_OPEN":
      return !0;
    case "SHOW_REMOVE_DIALOG_CLOSE":
      return !1;
    case "SHOW_REMOVE_DIALOG_TOGGLE":
      return !e;
    default:
      return e;
  }
}, R = (e, o, E) => {
  const [t, r] = O(e, o, E);
  return [t, r, (s) => {
    const n = l(t, s);
    r(n);
  }];
};
export {
  a as SHOW_REMOVE_DIALOG_ACTION,
  R as useShowRemoveDialog
};
