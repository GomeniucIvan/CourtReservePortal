/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { useControlledState as E } from "../../hooks/useControlledState.mjs";
var s = /* @__PURE__ */ ((e) => (e.set = "SHOW_OCCURRENCE_DIALOG_SET", e.open = "SHOW_OCCURRENCE_DIALOG_OPEN", e.close = "SHOW_OCCURRENCE_DIALOG_CLOSE", e.reset = "SHOW_OCCURRENCE_DIALOG_RESET", e.toggle = "SHOW_OCCURRENCE_DIALOG_TOGGLE", e))(s || {});
const u = (e, r) => {
  switch (r.type) {
    case "SHOW_OCCURRENCE_DIALOG_RESET":
      return !1;
    case "SHOW_OCCURRENCE_DIALOG_SET":
      return r.payload;
    case "SHOW_OCCURRENCE_DIALOG_OPEN":
      return !0;
    case "SHOW_OCCURRENCE_DIALOG_CLOSE":
      return !1;
    case "SHOW_OCCURRENCE_DIALOG_TOGGLE":
      return !e;
    default:
      return e;
  }
}, S = (e, r, n) => {
  const [c, o] = E(e, r, n);
  return [c, o, (O) => {
    const t = u(c, O);
    o(t);
  }];
};
export {
  s as SHOW_OCCURRENCE_DIALOG_ACTION,
  S as useShowOccurrenceDialog
};
