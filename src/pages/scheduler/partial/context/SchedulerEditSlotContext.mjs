/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
const t = e.createContext([null]), c = () => e.useContext(t);
t.displayName = "SchedulerEditSlotPropsContext";
const o = e.createContext([null]), d = () => e.useContext(o);
o.displayName = "SchedulerEditSlotFormItemContext";
const u = ({
  props: r,
  form: l,
  children: n
}) => /* @__PURE__ */ e.createElement(t.Provider, { value: r }, /* @__PURE__ */ e.createElement(o.Provider, { value: l }, n));
export {
  u as SchedulerEditSlotContext,
  o as SchedulerEditSlotFormItemContext,
  t as SchedulerEditSlotPropsContext,
  d as useSchedulerEditSlotFormItemContext,
  c as useSchedulerEditSlotPropsContext
};
