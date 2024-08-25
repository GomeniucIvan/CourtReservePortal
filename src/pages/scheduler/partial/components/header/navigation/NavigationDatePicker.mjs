"use client";
import * as e from "react";
import { Calendar as N } from "@progress/kendo-react-dateinputs";
import { useInternationalization as A } from "@progress/kendo-react-intl";
import { Button as O } from "@progress/kendo-react-buttons";
import { ZonedDate as S, getDate as U, MS_PER_DAY as V } from "@progress/kendo-date-math";
import { Popup as W } from "@progress/kendo-react-popup";
import { useWindow as _, useAsyncFocusBlur as H } from "@progress/kendo-react-common";
import { calendarIcon as K } from "@progress/kendo-svg-icons";
import { useSchedulerPropsContext as L, useSchedulerElementContext as Y, useSchedulerDateFormatContext as Z, useSchedulerDateRangeContext as j, useSchedulerDateContext as q } from "../../../context/SchedulerContext.mjs";
import { toUTCDateTime as G } from "../../../utils/index.mjs";
const J = e.forwardRef((s, b) => {
  var k;
  const u = e.useRef(null), i = e.useRef(null);
  e.useImperativeHandle(
    b,
    () => u.current
  );
  const { timezone: d } = L(), x = S.fromLocalDate(s.value, d), z = U(x), m = Y(), n = _(m), [E, F] = e.useState("desktop"), [a, f] = e.useState(!1), [C, g] = e.useState(!1), p = A(), { dateFormat: R, shortDateFormat: w } = Z(), t = j(), [c] = q(), l = t.end.getTime() - t.start.getTime() > V * 27, M = p.format(
    R,
    l ? c : t.zonedStart,
    l ? c : t.zonedEnd.addDays(-1)
  ), T = p.format(
    w,
    l ? c : t.zonedStart,
    l ? c : t.zonedEnd.addDays(-1)
  ), B = e.useCallback(
    () => {
      f(!a);
    },
    [a]
  ), I = e.useCallback(
    () => {
      g(!0);
    },
    []
  ), P = e.useCallback(
    () => {
      f(!1), g(!1);
    },
    []
  ), y = e.useCallback(
    (o) => {
      if (s.onChange) {
        const r = S.fromUTCDate(G(o.value), d);
        s.onChange.call(void 0, {
          ...o,
          value: r
        });
      }
      f(!1);
    },
    [s.onChange, d]
  ), h = e.useCallback(() => {
    n().matchMedia && F(n().matchMedia("(min-width: 1024px)").matches ? "desktop" : "mobile");
  }, [n]);
  e.useEffect(() => {
    h();
    const o = n().ResizeObserver, r = o && new o(h);
    return r && r.observe(m.current), () => {
      o && r.disconnect();
    };
  }, [h, m, n]), e.useEffect(
    () => {
      a && C && i.current && i.current.focus();
    },
    [C, a]
  );
  const { onFocus: v, onBlur: D } = H({ onFocus: I, onBlur: P });
  return /* @__PURE__ */ e.createElement(e.Fragment, null, /* @__PURE__ */ e.createElement(
    O,
    {
      ref: u,
      onFocus: v,
      onBlur: D,
      fillMode: "flat",
      className: "k-nav-current",
      icon: "calendar",
      svgIcon: K,
      "aria-live": "polite",
      tabIndex: -1,
      onClick: B
    },
    E === "desktop" ? M : T
  ), /* @__PURE__ */ e.createElement(
    W,
    {
      anchor: (k = u.current) == null ? void 0 : k.element,
      show: a
    },
    /* @__PURE__ */ e.createElement(
      N,
      {
        ref: i,
        onFocus: v,
        onBlur: D,
        onChange: y,
        value: z
      }
    )
  ));
});
J.displayName = "KendoReactSchedulerNavigationDatePicker";
export {
  J as NavigationDatePicker
};
