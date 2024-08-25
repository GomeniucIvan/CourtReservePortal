/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as a from "react";
import { ButtonGroup as o, Button as s } from "@progress/kendo-react-buttons";
const p = (r) => {
  const { value: l, data: c, onChange: t, ...u } = r, n = a.useCallback(
    (e) => {
      t && t.call(void 0, e.currentTarget.dataset.value);
    },
    [t]
  );
  return /* @__PURE__ */ a.createElement(
    o,
    {
      className: "k-scheduler-recurrence-repeat",
      width: "100%",
      ...u
    },
    c.map((e) => /* @__PURE__ */ a.createElement(
      s,
      {
        type: "button",
        key: e.value,
        selected: e.value === l,
        onClick: n,
        "data-value": e.value,
        togglable: !0
      },
      e.text
    ))
  );
};
export {
  p as RecurrenceFrequencyEditor
};