/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as n from "react";
import { SchedulerPropsContext as a } from "../context/SchedulerContext.jsx";
const f = (t) => {
  const o = n.useContext(a), e = t !== void 0 ? t : o.editable || !1, r = e === !0 || e !== void 0 && e !== !1 && e.edit === !0, s = e === !0 || e !== void 0 && e !== !1 && e.resize === !0, d = e === !0 || e !== void 0 && e !== !1 && e.remove === !0, u = e === !0 || e !== void 0 && e !== !1 && e.drag === !0, i = e === !0 || e !== void 0 && e !== !1 && e.add === !0, c = e === !0 || e !== void 0 && e !== !1 && e.select === !0;
  return {
    add: i,
    edit: r,
    drag: u,
    remove: d,
    resize: s,
    select: c
  };
};
export {
  f as useEditable
};
