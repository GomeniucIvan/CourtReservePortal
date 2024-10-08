/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
import { noop as t } from "@progress/kendo-react-common";
const o = e.createContext([null]), S = () => e.useContext(o);
o.displayName = "SchedulerEditItemPropsContext";
const r = e.createContext([null, t, t]), v = () => e.useContext(r);
r.displayName = "SchedulerEditItemFormItemContext";
const n = e.createContext([null, t, t]), p = () => e.useContext(n);
n.displayName = "SchedulerEditItemDragItemContext";
const c = e.createContext([null, t, t]), P = () => e.useContext(c);
c.displayName = "SchedulerEditItemResizeItemContext";
const l = e.createContext([null, t, t]), R = () => e.useContext(l);
l.displayName = "SchedulerEditItemRemoveItemContext";
const m = e.createContext([!1, t, t]), g = () => e.useContext(m);
m.displayName = "SchedulerEditItemShowRemoveDialogContext";
const d = e.createContext([!1, t, t]), D = () => e.useContext(d);
d.displayName = "SchedulerEditItemShowOccurrenceDialogContext";
const y = ({
  props: u,
  form: a,
  drag: i,
  resize: s,
  remove: x,
  showRemoveDialog: C,
  showOccurrenceDialog: I,
  children: E
}) => /* @__PURE__ */ e.createElement(o.Provider, { value: u }, /* @__PURE__ */ e.createElement(r.Provider, { value: a }, /* @__PURE__ */ e.createElement(n.Provider, { value: i }, /* @__PURE__ */ e.createElement(c.Provider, { value: s }, /* @__PURE__ */ e.createElement(l.Provider, { value: x }, /* @__PURE__ */ e.createElement(m.Provider, { value: C }, /* @__PURE__ */ e.createElement(d.Provider, { value: I }, E)))))));
export {
  y as SchedulerEditItemContext,
  n as SchedulerEditItemDragItemContext,
  r as SchedulerEditItemFormItemContext,
  o as SchedulerEditItemPropsContext,
  l as SchedulerEditItemRemoveItemContext,
  c as SchedulerEditItemResizeItemContext,
  d as SchedulerEditItemShowOccurrenceDialogContext,
  m as SchedulerEditItemShowRemoveDialogContext,
  p as useSchedulerEditItemDragItemContext,
  v as useSchedulerEditItemFormItemContext,
  S as useSchedulerEditItemPropsContext,
  R as useSchedulerEditItemRemoveItemContext,
  P as useSchedulerEditItemResizeItemContext,
  D as useSchedulerEditItemShowOccurrenceDialogContext,
  g as useSchedulerEditItemShowRemoveDialogContext
};
