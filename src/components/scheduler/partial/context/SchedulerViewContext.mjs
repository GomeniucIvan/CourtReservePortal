/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { noop as t } from "../utils/index.jsx";
const d = e.createContext({});
d.displayName = "SchedulerViewPropsContext";
const o = e.createContext([]), p = () => e.useContext(o);
o.displayName = "SchedulerViewRangesContext";
const c = e.createContext([[], t]), P = () => e.useContext(c);
c.displayName = "SchedulerViewSlotsContext";
const n = e.createContext([[], t]), I = () => e.useContext(n);
n.displayName = "SchedulerViewItemsContext";
const s = e.createContext([[], t]), y = () => e.useContext(s);
s.displayName = "SchedulerViewSelectedSlotsContext";
const r = e.createContext([[], t]), E = () => e.useContext(r);
r.displayName = "SchedulerViewSelectedItemsContext";
const l = e.createContext([[], t]), N = () => e.useContext(l);
l.displayName = "SchedulerViewFocusedItemsContext";
const u = e.createContext([[], t]), F = () => e.useContext(u);
u.displayName = "SchedulerViewFocusedSlotsContext";
const R = ({
  children: a,
  // Static
  props: i,
  ranges: x,
  // Ref
  slots: C,
  items: S,
  // State
  // State.Selection
  selectedSlots: m,
  selectedItems: h,
  // State.Focus
  focusedItems: w,
  focusedSlots: V
}) => /* @__PURE__ */ e.createElement(d.Provider, { value: i }, /* @__PURE__ */ e.createElement(o.Provider, { value: x }, /* @__PURE__ */ e.createElement(c.Provider, { value: C }, /* @__PURE__ */ e.createElement(n.Provider, { value: S }, /* @__PURE__ */ e.createElement(s.Provider, { value: m }, /* @__PURE__ */ e.createElement(r.Provider, { value: h }, /* @__PURE__ */ e.createElement(l.Provider, { value: w }, /* @__PURE__ */ e.createElement(u.Provider, { value: V }, a))))))));
export {
  R as SchedulerViewContext,
  l as SchedulerViewFocusedItemsContext,
  u as SchedulerViewFocusedSlotsContext,
  n as SchedulerViewItemsContext,
  d as SchedulerViewPropsContext,
  o as SchedulerViewRangesContext,
  r as SchedulerViewSelectedItemsContext,
  s as SchedulerViewSelectedSlotsContext,
  c as SchedulerViewSlotsContext,
  N as useSchedulerViewFocusedItemsContext,
  F as useSchedulerViewFocusedSlotsContext,
  I as useSchedulerViewItemsContext,
  p as useSchedulerViewRangesContext,
  E as useSchedulerViewSelectedItemsContext,
  y as useSchedulerViewSelectedSlotsContext,
  P as useSchedulerViewSlotsContext
};
