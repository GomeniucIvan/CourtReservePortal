/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { useLocalization as n } from "@progress/kendo-react-intl";
import { allDay as l, messages as o } from "../../messages/index.mjs";
const i = (a) => {
  const t = n();
  return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-side-cell k-scheduler-times-all-day" }, t.toLanguageString(l, o[l])), a.children);
};
export {
  i as DayViewAllDayRowContent
};
