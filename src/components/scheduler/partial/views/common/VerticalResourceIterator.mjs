/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as r from "react";
import { toGroupResources as p } from "./utilsJava.js";
import { SchedulerResourceIteratorContext as i } from "../../context/SchedulerResourceIteratorContext.mjs";
const g = (c) => {
  const { nested: t, wrapGroup: e, children: n } = c, a = c.cellContent || R, l = p(c.group, c.resources), s = 0, o = 0;
  return /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-group" }, t ? e ? /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement("div", { className: "k-sticky-cell" }, h({ resources: l, children: n, cellContent: a, depth: s, groupIndex: o })), /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-cell k-group-content" }, m({ resources: l, children: n, cellContent: a, depth: s, groupIndex: o }, !1))) : m({ resources: l, children: n, cellContent: a, depth: s, groupIndex: o }, !0) : e ? /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement("div", { className: "k-sticky-cell" }, v({ resources: l, children: n, cellContent: a, depth: s, groupIndex: o })), /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-cell k-group-content" }, n)) : E({ resources: l, children: n, cellContent: a, depth: s, groupIndex: o }));
}, v = (c) => /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, c.resources.map((t, e) => /* @__PURE__ */ r.createElement("div", { key: e, className: "k-scheduler-cell k-resource-cell k-heading-cell", "data-depth-index": e })))), m = (c, t = !0) => {
  const { resources: e, children: n, cellContent: a, groupIndex: l, depth: s } = c, o = e.length > 0;
  if (s === e.length || !o)
    return /* @__PURE__ */ r.createElement(
      i.Provider,
      {
        value: { resource: e[s], groupIndex: o ? l : 0 }
      },
      n
    );
  const d = e[s].data.length;
  return e[s].data.map((k, u) => /* @__PURE__ */ r.createElement("div", { key: u, className: "k-scheduler-row" }, t && /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-cell k-group-cell k-heading-cell", "data-depth-index": s }, k.text), /* @__PURE__ */ r.createElement(
    "div",
    {
      className: "k-scheduler-cell k-group-content k-resource-row",
      "data-depth-index": s,
      "data-resource-index": d * l + u
    },
    m(
      {
        resources: e,
        children: n,
        cellContent: a,
        groupIndex: d * l + u,
        depth: s + 1
      },
      t
    )
  )));
}, h = (c) => {
  const { resources: t, children: e, cellContent: n, groupIndex: a, depth: l } = c, s = t.length ? t[l].data.length : 0;
  return t[l] ? t[l].data.map((o, d) => /* @__PURE__ */ r.createElement("div", { key: d, className: "k-scheduler-row" }, /* @__PURE__ */ r.createElement(
    "div",
    {
      className: "k-scheduler-cell k-resource-cell k-resource-row k-heading-cell",
      "data-depth-index": l,
      "data-resource-index": s * a + d
    },
    o.text
  ), l + 1 !== t.length && /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-cell k-resource-content" }, h({
    resources: t,
    children: e,
    cellContent: n,
    groupIndex: s * a + d,
    depth: l + 1
  })))) : null;
}, E = (c) => {
  const { resources: t, children: e, groupIndex: n, cellContent: a } = c;
  return /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-row" }, x(t), a, N(e, t, n));
}, N = (c, t, e) => {
  const n = t.length > 0;
  return /* @__PURE__ */ r.createElement("div", { className: "k-scheduler-cell k-group-content" }, /* @__PURE__ */ r.createElement(
    i.Provider,
    {
      value: { resource: t[e], groupIndex: n ? e : void 0 }
    },
    c
  ));
}, x = (c) => c.map((t, e) => /* @__PURE__ */ r.createElement("div", { key: e, className: "k-scheduler-cell k-group-cell k-heading-cell", "data-depth-index": e }));
g.displayName = "KendoReactSchedulerVerticalResourceIterator";
const R = null;
export {
  g as VerticalResourceIterator
};
