/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { clone as E } from "@progress/kendo-react-common";
import { useControlledState as d } from "../../hooks/useControlledState.mjs";
import { findMaster as M } from "../../utils/index.mjs";
import { DATA_ACTION as c } from "../../constants/index.mjs";
import { useSchedulerFieldsContext as T, useSchedulerDataContext as i } from "../../context/SchedulerContext.mjs";
var p = /* @__PURE__ */ ((e) => (e.set = "FORM_ITEM_SET", e.setMaster = "FORM_ITEM_SET_MASTER", e.reset = "FORM_ITEM_RESET", e.complete = "FORM_ITEM_COMPLETE", e))(p || {});
const f = (e, s) => {
  const [o, a] = d(...s), m = T(), [l] = i();
  return [o, a, (r, n) => {
    let t;
    switch (r.type) {
      case "FORM_ITEM_SET":
        t = r.payload;
        break;
      case "FORM_ITEM_RESET":
        t = null;
        break;
      case "FORM_ITEM_SET_MASTER":
        t = E(M(r.payload, m, l));
        break;
      case "FORM_ITEM_COMPLETE":
        e.onDataAction && o && (e.onDataAction.call(void 0, {
          type: c.update,
          series: e.series,
          dataItem: r.payload
        }), t = null);
        break;
      default:
        t = o;
        break;
    }
    a(t, n);
  }];
};
export {
  p as FORM_ITEM_ACTION,
  f as useFormItem
};
