/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { ToolbarItem as m } from "@progress/kendo-react-buttons";
import { classNames as o } from "@progress/kendo-react-common";
const i = e.forwardRef((r, s) => {
  const {
    className: a,
    ...l
  } = r, t = e.useRef(null);
  return e.useImperativeHandle(s, () => ({ element: t.current, props: r })), /* @__PURE__ */ e.createElement(
    m,
    {
      ref: (n) => {
        n && (t.current = n.element);
      },
      className: o("k-scheduler-navigation", a),
      ...l
    },
    r.children
  );
});
export {
  i as BusinessHours
};
