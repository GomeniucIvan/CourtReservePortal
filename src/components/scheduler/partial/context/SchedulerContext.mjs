import * as e from "react";
import {defaultModelFields as R, noop as t} from "../utils/index.jsx";
import {DEFAULT_GROUP as A} from "../constants/index.mjs";
import {ZonedDate as i} from "@progress/kendo-date-math";

const o = e.createContext({current: null}), L = () => e.useContext(o);
o.displayName = "SchedulerElementContext";
const n = e.createContext({}), z = () => e.useContext(n);
n.displayName = "SchedulerPropsContext";
const r = e.createContext([]), I = () => e.useContext(r);
r.displayName = "SchedulerViewsContext";
const a = e.createContext(R), U = () => e.useContext(a);
a.displayName = "SchedulerFieldsContext";
const c = e.createContext({dateFormat: "{0:D}", shortDateFormat: "{0:d}"}), M = () => e.useContext(c);
c.displayName = "SchedulerDateFormatContext";
const l = e.createContext([A]), T = () => e.useContext(l);
l.displayName = "SchedulerGroupsContext";
const u = e.createContext({
    start: /* @__PURE__ */ new Date(),
    end: /* @__PURE__ */ new Date(),
    zonedStart: i.fromLocalDate(/* @__PURE__ */ new Date()),
    zonedEnd: i.fromLocalDate(/* @__PURE__ */ new Date())
}), Z = () => e.useContext(u);
u.displayName = "SchedulerDateRangeContext";
const s = e.createContext(null), _ = () => e.useContext(s);
s.displayName = "SchedulerOrientationContext";
const d = e.createContext([/* @__PURE__ */ new Date(), t]), b = () => e.useContext(d);
d.displayName = "SchedulerDateContext";
const x = e.createContext([[], t]), j = () => e.useContext(x);
x.displayName = "SchedulerDataContext";
const C = e.createContext(["day", t]), k = () => e.useContext(C);
C.displayName = "SchedulerActiveViewContext";
const m = e.createContext([null, () => {
}]);
m.displayName = "SchedulerItemSelectionContext";
const q = ({
               children: S,
               element: h,
               props: v,
               views: p,
               fields: D,
               groups: E,
               dateRange: P,
               dateFormat: y,
               orientation: N,
               date: w,
               data: F,
               activeView: f,
               selection: V
           }) => /* @__PURE__ */ e.createElement(o.Provider, {value: h}, /* @__PURE__ */ e.createElement(n.Provider, {value: v}, /* @__PURE__ */ e.createElement(r.Provider, {value: p}, /* @__PURE__ */ e.createElement(a.Provider, {value: D}, /* @__PURE__ */ e.createElement(c.Provider, {value: y}, /* @__PURE__ */ e.createElement(l.Provider, {value: E}, /* @__PURE__ */ e.createElement(u.Provider, {value: P}, /* @__PURE__ */ e.createElement(s.Provider, {value: N}, /* @__PURE__ */ e.createElement(d.Provider, {value: w}, /* @__PURE__ */ e.createElement(x.Provider, {value: F}, /* @__PURE__ */ e.createElement(C.Provider, {value: f}, /* @__PURE__ */ e.createElement(m.Provider, {value: V}, S))))))))))));
export {
    C as SchedulerActiveViewContext,
    q as SchedulerContext,
    x as SchedulerDataContext,
    d as SchedulerDateContext,
    c as SchedulerDateFormatContext,
    u as SchedulerDateRangeContext,
    o as SchedulerElementContext,
    a as SchedulerFieldsContext,
    l as SchedulerGroupsContext,
    m as SchedulerItemSelectionContext,
    s as SchedulerOrientationContext,
    n as SchedulerPropsContext,
    r as SchedulerViewsContext,
    k as useSchedulerActiveViewContext,
    j as useSchedulerDataContext,
    b as useSchedulerDateContext,
    M as useSchedulerDateFormatContext,
    Z as useSchedulerDateRangeContext,
    L as useSchedulerElementContext,
    U as useSchedulerFieldsContext,
    T as useSchedulerGroupsContext,
    _ as useSchedulerOrientationContext,
    z as useSchedulerPropsContext,
    I as useSchedulerViewsContext
};
