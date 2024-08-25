/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as c from "react";
import { DateTimePicker as i } from "@progress/kendo-react-dateinputs";
import { toLocalDate as m, ZonedDate as r } from "@progress/kendo-date-math";
import { useSchedulerPropsContext as D } from "../context/SchedulerContext.mjs";
const l = (e) => {
  const {
    as: t = d.as,
    ...o
  } = e, { timezone: n } = D(), a = (s) => {
    o.onChange && o.onChange({ value: f(s.target.value, n) });
  };
  return /* @__PURE__ */ c.createElement(
    t,
    {
      ...o,
      value: g(o.value, n),
      onChange: a
    }
  );
}, g = (e, t) => e && m(r.fromLocalDate(e, t).toUTCDate()), f = (e, t) => e && r.fromUTCDate(
  new Date(Date.UTC(
    e.getFullYear(),
    e.getMonth(),
    e.getDate(),
    e.getHours(),
    e.getMinutes(),
    e.getSeconds(),
    e.getMilliseconds()
  )),
  t
).toLocalDate(), d = {
  as: i
};
export {
  l as ZonedDateTime
};
