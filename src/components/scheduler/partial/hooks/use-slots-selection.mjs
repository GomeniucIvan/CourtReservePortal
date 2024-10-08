/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as l from "react";
var o = /* @__PURE__ */ ((s) => (s.select = "SLOTS_SELECT_SELECT", s.reset = "SLOTS_SELECT_RESET", s.add = "SLOTS_SELECT_ADD", s))(o || {});
const c = (s) => {
  const [t, S] = l.useState([]), r = l.useCallback(
    (e) => {
      switch (e.type) {
        case "SLOTS_SELECT_SELECT":
          if (!e.slot)
            return;
          S([e.slot]);
          break;
        case "SLOTS_SELECT_RESET":
          S([]);
          break;
        case "SLOTS_SELECT_ADD":
          if (!e.slot)
            return;
          t.some((E) => E === e.slot) || S([...t, e.slot]);
          break;
      }
    },
    [t]
  );
  return [t, r];
};
export {
  o as SLOTS_SELECT_ACTION,
  c as useSlotsSelection
};
