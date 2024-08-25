/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { allEvents as l, messages as n } from "../../messages/index.mjs";
import { useLocalization as i } from "@progress/kendo-react-intl";
const r = (t) => {
  const a = i();
  return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement("div", { className: "k-sticky-cell" }, /* @__PURE__ */ e.createElement("div", { className: "k-scheduler-cell k-heading-cell k-side-cell k-scheduler-times-all-day", "data-range-index": 0 }, a.toLanguageString(l, n[l]))), t.children);
};
export {
  r as TimelineViewAllEventsRowContent
};