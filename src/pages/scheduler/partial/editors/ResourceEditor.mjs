/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as a from "react";
import { MultiSelect as o, DropDownList as v } from "@progress/kendo-react-dropdowns";
import { isPresent as F } from "../utils/index.mjs";
const s = (e) => {
  const i = e.multiple ? o : v, d = a.useCallback(
    (l) => {
      const t = l.target.props.dataItemKey, n = e.multiple ? (l.target.value || []).map((m) => m[t]) : l.target.value[t];
      e.onChange.call(void 0, { value: n });
    },
    [e.multiple, e.onChange]
  ), c = a.useCallback(
    (l, t) => {
      const n = /* @__PURE__ */ a.createElement(a.Fragment, null, e.colorField && /* @__PURE__ */ a.createElement(
        "span",
        {
          key: 1,
          className: "k-scheduler-mark",
          style: {
            backgroundColor: t.dataItem[e.colorField],
            marginRight: F(t.dataItem[e.valueField]) ? "8px" : "4px"
          }
        },
        " "
      ), /* @__PURE__ */ a.createElement("span", { key: 2 }, "  ", l.props.children));
      return a.cloneElement(l, { ...l.props }, n);
    },
    [e.colorField, e.valueField]
  ), r = a.useCallback(
    (l, t) => {
      const n = /* @__PURE__ */ a.createElement(a.Fragment, null, e.colorField && t && /* @__PURE__ */ a.createElement(
        "span",
        {
          key: 1,
          className: "k-scheduler-mark",
          style: {
            backgroundColor: t[e.colorField],
            marginRight: t[e.valueField] ? "8px" : "4px"
          }
        },
        " "
      ), l.props.children);
      return a.cloneElement(l, {}, n);
    },
    [e.colorField, e.valueField]
  ), u = Array.isArray(e.value) ? e.data.filter((l) => e.value.some((t) => l[e.valueField] === t)) : e.data.find((l) => l[e.valueField] === e.value);
  return /* @__PURE__ */ a.createElement(
    i,
    {
      value: u,
      onChange: d,
      data: e.data,
      textField: e.textField,
      dataItemKey: e.valueField,
      valid: e.valid,
      validationMessage: e.validationMessage,
      itemRender: c,
      valueRender: r
    }
  );
};
export {
  s as ResourceEditor
};
