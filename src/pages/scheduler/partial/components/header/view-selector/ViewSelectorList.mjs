/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
import * as t from "react";
import { useLocalization as f } from "@progress/kendo-react-intl";
import { DropDownButton as w } from "@progress/kendo-react-buttons";
import { useWindow as k, classNames as b, IconWrap as h } from "@progress/kendo-react-common";
import { caretAltDownIcon as v } from "@progress/kendo-svg-icons";
import { ViewSelectorItem as g } from "./ViewSelectorItem.mjs";
import { useSchedulerViewsContext as E, useSchedulerActiveViewContext as S } from "../../../context/SchedulerContext.mjs";
const V = t.forwardRef(() => {
  const s = t.useRef(null), [o, u] = t.useState("desktop"), n = E(), l = k(s), [a, c] = S(), r = n.find((e) => e.props.name === a), p = f(), d = t.useCallback(
    (e) => {
      c && (e.syntheticEvent.preventDefault(), c(e.item.name));
    },
    [c]
  ), m = () => {
    l().matchMedia && u(l().matchMedia("(min-width: 1024px)").matches ? "desktop" : "mobile");
  };
  return t.useEffect(() => {
    m();
    const e = l().ResizeObserver, i = e && new e(m);
    return i && i.observe(s.current), () => {
      i && i.disconnect();
    };
  }, []), /* @__PURE__ */ t.createElement(
    "div",
    {
      className: b(
        "k-toolbar-button-group k-button-group k-button-group-solid",
        {
          "k-scheduler-views": o === "desktop",
          "k-scheduler-tools": o === "mobile"
        }
      ),
      role: "group",
      ref: s
    },
    r && o === "mobile" && /* @__PURE__ */ t.createElement(
      w,
      {
        className: "k-views-dropdown",
        onItemClick: d,
        popupSettings: { popupClass: "k-scheduler-toolbar" },
        textField: "title",
        items: n.map((e) => ({
          ...e.props,
          selected: e.props.name === a,
          title: typeof e.props.title == "function" ? e.props.title.call(void 0, p) : e.props.title
        })),
        text: /* @__PURE__ */ t.createElement(t.Fragment, null, typeof r.props.title == "function" ? r.props.title.call(void 0, p) : r.props.title, /* @__PURE__ */ t.createElement(h, { name: "caret-alt-down", icon: v }))
      }
    ),
    o === "desktop" && /* @__PURE__ */ t.createElement(t.Fragment, null, n.map((e) => /* @__PURE__ */ t.createElement(g, { key: e.props.name, view: e.props })))
  );
});
V.displayName = "KendoReactSchedulerViewSelectorList";
export {
  V as ViewSelectorList
};
