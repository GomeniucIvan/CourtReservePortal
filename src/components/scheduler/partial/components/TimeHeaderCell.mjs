/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { useInternationalization as u } from "@progress/kendo-react-intl";
import { classNames as f } from "@progress/kendo-react-common";
const i = e.forwardRef((t, m) => {
  const {
    as: n = l.as,
    ...s
  } = t, a = e.useRef(null), r = e.useRef(null), c = u(), o = e.useMemo(
    () => f("k-scheduler-cell k-heading-cell", t.className),
    [t.className]
  );
  return e.useImperativeHandle(r, () => ({
    element: a.current && a.current.element ? a.current.element : a.current,
    props: t
  })), e.useImperativeHandle(m, () => r.current), /* @__PURE__ */ e.createElement(
    n,
    {
      ref: n !== l.as ? void 0 : a,
      ...s,
      className: o
    },
    c.formatDate(
      t.date,
      t.format ? t.format : l.format
    )
  );
}), l = {
  as: e.forwardRef(({ as: t, format: m, start: n, end: s, ...a }, r) => /* @__PURE__ */ e.createElement("div", { ...a, ref: r })),
  format: "t"
};
i.displayName = "KendoReactSchedulerTimeHeaderCell";
export {
  i as TimeHeaderCell,
  l as timeHeaderCellDefaultProps
};
