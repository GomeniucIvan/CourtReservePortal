/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { DATA_ACTION as m } from "../../constants/index.mjs";
import { useControlledState as s } from "../../hooks/useControlledState.mjs";
var l = /* @__PURE__ */ ((e) => (e.set = "REMOVE_ITEM_SET", e.reset = "REMOVE_ITEM_RESET", e.complete = "REMOVE_ITEM_COMPLETE", e))(l || {});
const I = (e, r) => {
  const [o, E] = s(...r);
  return [o, E, (a) => {
    let t;
    switch (a.type) {
      case "REMOVE_ITEM_SET":
        t = a.payload;
        break;
      case "REMOVE_ITEM_RESET":
        t = null;
        break;
      case "REMOVE_ITEM_COMPLETE":
        e.onDataAction && o && e.onDataAction.call(void 0, {
          type: m.remove,
          series: e.series,
          dataItem: o
        }), t = null;
        break;
      default:
        t = o;
        break;
    }
    E(t);
  }];
};
export {
  l as REMOVE_ITEM_ACTION,
  I as useRemoveItem
};
