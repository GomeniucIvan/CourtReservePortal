/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { findNextItem as u } from "../utils/index.jsx";
var s = /* @__PURE__ */ ((t) => (t.next = "ITEMS_FOCUS_NEXT", t.prev = "ITEMS_FOCUS_PREV", t))(s || {});
const m = (t) => [[], (e, n) => {
  switch (e.type) {
    case "ITEMS_FOCUS_NEXT": {
      if (!e.item || !e.item.current || !t)
        return;
      const r = u(
        e.item,
        t,
        e.ignoreIsAllDay,
        !1
      );
      r && r.current && r.current.element && (n.preventDefault(), r.current.element.focus());
      break;
    }
    case "ITEMS_FOCUS_PREV": {
      if (!e.item || !e.item.current || !t)
        return;
      const r = u(
        e.item,
        t,
        e.ignoreIsAllDay,
        !0
      );
      r && r.current && r.current.element && (n.preventDefault(), r.current.element.focus());
      break;
    }
  }
}];
export {
  s as ITEMS_FOCUS_ACTION,
  m as useItemsFocus
};
