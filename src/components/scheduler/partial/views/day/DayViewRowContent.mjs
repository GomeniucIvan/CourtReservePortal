import * as t from "react";
import { classNames as r } from "@progress/kendo-react-common";
import { TimeHeaderCell as n } from "../../components/TimeHeaderCell.jsx";
const m = (e) => {
  const { slot: l, children: a } = e;
  return /* @__PURE__ */ t.createElement(t.Fragment, null, e.isMaster ? /* @__PURE__ */ t.createElement(
    n,
    {
      as: e.timeHeaderCell,
      date: l.zonedStart,
      start: l.zonedStart,
      end: l.zonedEnd,
      className: r(
        "k-side-cell",
        {
          "k-major-cell": !e.isLast
        }
      )
    }
  ) : /* @__PURE__ */ t.createElement("div", { className: "k-scheduler-cell k-heading-cell k-side-cell" }), a);
};
export {
  m as DayViewRowContent
};
