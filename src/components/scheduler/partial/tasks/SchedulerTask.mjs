import * as e from "react";
import { useLocalization as R } from "../intl/index.mjs";
import { deleteTitle as m, messages as g } from "../messages/index.mjs";
import { classNames as I, IconWrap as r } from "@progress/kendo-react-common";
import { arrowRotateCwIcon as b, arrowsNoRepeatIcon as E, xIcon as N } from "@progress/kendo-svg-icons";
import { useEditable as w } from "../hooks/useEditable.mjs";
const x = e.forwardRef((t, d) => {
  const {
    _ref: u,
    onRemoveClick: n
  } = t, a = e.useRef(null), i = e.useRef(null);
  e.useImperativeHandle(a, () => ({ props: t, element: i.current })), e.useImperativeHandle(d, () => a.current), e.useImperativeHandle(u, () => a.current);
  const k = w(t.editable), s = R().toLanguageString(m, g[m]), o = t.group.resources.find((l) => !!(l.colorField && l[l.colorField] !== void 0)), c = o && o.colorField && o[o.colorField], f = e.useCallback(
    (l) => {
      n && n.call(void 0, {
        syntheticEvent: l,
        target: a.current
      });
    },
    [n, a]
  ), v = e.useMemo(
    () => I("k-task", t.className),
    [t.className]
  );
  return /* @__PURE__ */ e.createElement(
    "div",
    {
      id: t.id,
      ref: i,
      style: t.style,
      className: v,
      tabIndex: t.tabIndex || void 0
    },
    c && /* @__PURE__ */ e.createElement(
      "span",
      {
        className: "k-scheduler-mark",
        style: { color: c, backgroundColor: c }
      }
    ),
    t.isRecurring && /* @__PURE__ */ e.createElement(r, { name: "arrow-rotate-cw", icon: b }),
    t.isException && /* @__PURE__ */ e.createElement(r, { name: "arrows-no-repeat", icon: E }),
    t.title,
    k.remove && /* @__PURE__ */ e.createElement(
      "a",
      {
        className: "k-link k-event-delete",
        title: s,
        "aria-label": s,
        onClick: f
      },
      /* @__PURE__ */ e.createElement(r, { name: "x", icon: N })
    )
  );
});
x.displayName = "KendoReactSchedulerTask";
export {
  x as SchedulerTask
};
