/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as l from "react";
import { findNextItem as m } from "../utils/index.jsx";
var _ = /* @__PURE__ */ ((E) => (E.select = "ITEMS_SELECT_SELECT", E.selectNext = "ITEMS_SELECT_SELECT_NEXT", E.selectPrev = "ITEMS_SELECT_SELECT_PREV", E.reset = "ITEMS_SELECT_RESET", E.add = "ITEMS_SELECT_ADD", E.remove = "ITEMS_SELECT_REMOVE", E))(_ || {});
const f = (E) => {
  const [s, r] = l.useState([]), T = l.useCallback(
    (e, S) => {
      switch (e.type) {
        case "ITEMS_SELECT_SELECT":
          if (!e.item)
            return;
          r([e.item]);
          break;
        case "ITEMS_SELECT_SELECT_NEXT": {
          if (!e.item || !e.item.current || !E)
            return;
          const t = m(
            e.item,
            E,
            e.ignoreIsAllDay,
            !1
          );
          t && (S.preventDefault(), r([t]));
          break;
        }
        case "ITEMS_SELECT_SELECT_PREV": {
          if (!e.item || !e.item.current || !E)
            return;
          const t = m(
            e.item,
            E,
            e.ignoreIsAllDay,
            !0
          );
          t && (S.preventDefault(), r([t]));
          break;
        }
        case "ITEMS_SELECT_RESET":
          r([]);
          break;
        case "ITEMS_SELECT_ADD":
          if (!e.item)
            return;
          s.some((t) => t === e.item) || r([...s, e.item]);
          break;
        case "ITEMS_SELECT_REMOVE":
          if (!e.item)
            return;
          r([...s.filter((t) => t !== e.item)]);
          break;
      }
    },
    [E, s]
  );
  return [s, T];
};
export {
  _ as ITEMS_SELECT_ACTION,
  f as useItemsSelection
};
