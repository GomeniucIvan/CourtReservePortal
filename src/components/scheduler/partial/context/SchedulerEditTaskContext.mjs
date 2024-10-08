/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as e from "react";
const o = e.createContext([null]), r = e.createContext([!1]), c = e.createContext([!1]), a = (t) => /* @__PURE__ */ e.createElement(o.Provider, { value: t.remove }, /* @__PURE__ */ e.createElement(r.Provider, { value: t.showRemoveDialog }, /* @__PURE__ */ e.createElement(c.Provider, { value: t.showOccurrenceDialog }, t.children)));
export {
  a as SchedulerEditTaskContext,
  o as SchedulerEditTaskRemoveItemContext,
  c as SchedulerEditTaskShowOccurrenceDialogContext,
  r as SchedulerEditTaskShowRemoveDialogContext
};
