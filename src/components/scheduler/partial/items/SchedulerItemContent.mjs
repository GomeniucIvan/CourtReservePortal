/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import { classNames as s } from "@progress/kendo-react-common";
const r = t.forwardRef((e, a) => {
  const m = t.useMemo(
    () => s(
      "k-event-template",
      e.className
    ),
    [e.className]
  );
  return /* @__PURE__ */ t.createElement("div", { ref: a, ...e, className: m });
});
export {
  r as SchedulerItemContent
};
