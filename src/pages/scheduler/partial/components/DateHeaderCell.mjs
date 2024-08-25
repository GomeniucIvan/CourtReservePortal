/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { useInternationalization as d } from "@progress/kendo-react-intl";
import { classNames as u } from "@progress/kendo-react-common";
const f = e.forwardRef((t, s) => {
  const {
    as: n = l.as,
    ...m
  } = t, a = e.useRef(null), r = e.useRef(null), c = d(), o = e.useMemo(
    () => u("k-scheduler-cell k-heading-cell", t.className),
    [t.className]
  );
  return e.useImperativeHandle(r, () => ({
    element: a.current && a.current.element ? a.current.element : a.current,
    props: t
  })), e.useImperativeHandle(s, () => r.current), /* @__PURE__ */ e.createElement(
    n,
    {
      ref: n !== l.as ? void 0 : a,
      ...m,
      className: o
    },
    /* @__PURE__ */ e.createElement("span", { className: "k-link k-nav-day" }, c.formatDate(
      t.date,
      t.format ? t.format : l.format
    ))
  );
}), l = {
  as: e.forwardRef(({ as: t, format: s, start: n, end: m, ...a }, r) => /* @__PURE__ */ e.createElement("div", { ...a, ref: r })),
  format: "d"
};
f.displayName = "KendoReactSchedulerDateHeaderCell";
export {
  f as DateHeaderCell,
  l as dateHeaderCellDefaultProps
};
