/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as r from "react";
import { toGroupResources as C, expandResources as h } from "./utilsJava.js";
import { EMPTY_RESOURCE as w } from "../../constants/index.mjs";
import { SchedulerResourceIteratorContext as g } from "../../context/SchedulerResourceIteratorContext.mjs";
const E = (o) => {
  const { nested: e, children: n, rowContentProps: c } = o, s = o.rowContent || k, t = o.childRowContent || s, l = C(o.group, o.resources), a = 0;
  return /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-group k-group-horizontal" }, e ? R({ resources: l, children: n, nested: e, groupIndex: a, rowContent: s, rowContentProps: c, childRowContent: t }) : p({ resources: l, children: n, rowContent: s, nested: !!e, groupIndex: a, rowContentProps: c, childRowContent: t }));
}, R = (o) => {
  const { resources: e, rowContent: n, nested: c, children: s, groupIndex: t, rowContentProps: l, childRowContent: a } = o;
  if (t === e.length)
    return p({ resources: e, rowContent: n, children: s, nested: c, groupIndex: t, rowContentProps: l, childRowContent: a });
  const u = h(e, t), d = n;
  return /* @__PURE__ */ r.createElement(r.Fragment, null, c ? /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement(d, { resources: e, groupIndex: t, ...l }, u.map((m, i) => /* @__PURE__ */ r.createElement("div", { key: i, className: "k-scheduler-cell k-heading-cell" }, m.text)))) : /* @__PURE__ */ r.createElement(d, { resources: e, groupIndex: t, ...l }, u.map((m, i) => /* @__PURE__ */ r.createElement("div", { key: i, className: "k-scheduler-cell k-heading-cell" }, m.text))), R({
    resources: e,
    children: s,
    nested: c,
    rowContent: n,
    childRowContent: a,
    groupIndex: t + 1
  }));
}, p = (o) => {
  const { resources: e, childRowContent: n, children: c, rowContentProps: s } = o, t = h(e, e.length - 1), l = n, a = e.length > 0;
  return /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement(l, { resources: e, ...s }, (t.length ? t : w).map((u, d) => /* @__PURE__ */ r.createElement("div", { key: d, className: "k-scheduler-cell k-group-cell" }, /* @__PURE__ */ r.createElement(g.Provider, { value: { resource: u, groupIndex: a ? d : 0 } }, c)))));
};
E.displayName = "KendoReactSchedulerHorizontalResourceIterator";
const k = (o) => o.children;
export {
  k as DefaultRowContent,
  E as HorizontalResourceIterator
};
