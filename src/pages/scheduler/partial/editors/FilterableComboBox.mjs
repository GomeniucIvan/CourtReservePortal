/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { filterBy as m } from "@progress/kendo-data-query";
import { ComboBox as f } from "@progress/kendo-react-dropdowns";
const x = (n) => {
  const { onChange: a, data: o, validationMessage: u, visited: C, touched: h, modified: b, ...r } = n, [i, l] = e.useState(o), s = e.useCallback(
    (t) => a(t),
    [a]
  ), c = e.useCallback(
    (t) => {
      const d = m(o || [], t.filter);
      l(d);
    },
    []
  );
  return /* @__PURE__ */ e.createElement(
    f,
    {
      style: { width: "100%" },
      data: i,
      filterable: !0,
      onFilterChange: c,
      onChange: s,
      ...r
    }
  );
};
export {
  x as FilterableComboBox
};
