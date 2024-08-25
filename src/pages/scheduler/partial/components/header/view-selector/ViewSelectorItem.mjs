/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import { Button as c } from "@progress/kendo-react-buttons";
import { useLocalization as m } from "@progress/kendo-react-intl";
import { useSchedulerActiveViewContext as u } from "../../../context/SchedulerContext.mjs";
const s = (e) => {
  const [l, i] = u(), o = m(), n = t.useMemo(
    () => typeof e.view.title == "function" ? e.view.title.call(void 0, o) : e.view.title,
    [e.view.title, o]
  ), a = t.useCallback(
    () => {
      e.view.name && i(e.view.name);
    },
    [i, e.view.name]
  );
  return /* @__PURE__ */ t.createElement(
    c,
    {
      className: "k-toolbar-button",
      role: "button",
      type: "button",
      tabIndex: -1,
      togglable: !0,
      selected: e.view.name === l,
      onClick: a
    },
    n
  );
};
export {
  s as ViewSelectorItem
};
