/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import { ZonedDate as t } from "@progress/kendo-date-math";
import { MS_PER_DAY as M } from "@progress/kendo-date-math";
const r = 1e3, c = 60 * r, s = 1, d = 7, _ = [{}], D = {
  index: 0,
  resources: []
}, o = new Date(1900, 0, 1), n = new Date(2099, 11, 31);
t.fromLocalDate(o), t.fromLocalDate(n);
var E = /* @__PURE__ */ ((e) => (e[e.create = 0] = "create", e[e.update = 1] = "update", e[e.remove = 2] = "remove", e))(E || {});
export {
  s as BORDER_WIDTH,
  E as DATA_ACTION,
  d as DAYS_IN_WEEK_COUNT,
  D as DEFAULT_GROUP,
  _ as EMPTY_RESOURCE,
  n as MAX_DATE,
  o as MIN_DATE,
  M as MS_PER_DAY,
  c as MS_PER_MINUTE,
  r as MS_PER_SECOND
};
