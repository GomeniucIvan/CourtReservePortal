/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as r from "react";
import { ButtonGroup as d, Button as i } from "@progress/kendo-react-buttons";
import { capitalize as m } from "./common.mjs";
const h = (a) => {
  const { value: n, data: s, onChange: g, ...u } = { ...l, ...a }, c = (e) => {
    const t = Number(e.currentTarget.dataset.key);
    a.onChange && a.onChange.call(void 0, n.some((o) => o === t) ? n.filter((o) => o !== t) : [...n, t]);
  };
  return /* @__PURE__ */ r.createElement(r.Fragment, null, /* @__PURE__ */ r.createElement(d, { width: "auto", ...u }, (a.data || l.data).map((e) => /* @__PURE__ */ r.createElement(
    i,
    {
      type: "button",
      key: e.value,
      "data-key": e.value,
      selected: n.some((t) => t === e.value),
      togglable: !0,
      onClick: c
    },
    m(e.text)
  ))));
}, l = {
  data: [],
  value: []
};
export {
  h as RecurrenceRepeatOnWeekEditor
};
