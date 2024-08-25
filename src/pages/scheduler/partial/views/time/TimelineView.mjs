/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import { MultiDayTimelineView as m, multiDayTimelineViewDefaultProps as a } from "./MultiDayTimelineView.mjs";
import { timelineViewTitle as i, messages as l } from "../../messages/index.mjs";
const o = (e) => /* @__PURE__ */ t.createElement(m, { ...e }), r = {
  ...a,
  name: "timeline",
  title: (e) => e.toLanguageString(i, l[i]),
  step: 1,
  slotDuration: 60,
  slotDivisions: 2,
  numberOfDays: 1,
  selectedDateFormat: "{0:D}",
  selectedShortDateFormat: "{0:d}"
};
o.displayName = "KendoReactSchedulerTimelineView";
export {
  o as TimelineView,
  r as timeLineViewDefaultProps
};
