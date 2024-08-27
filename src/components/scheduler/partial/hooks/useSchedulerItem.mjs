import * as t from "react";
import { useIsomorphicLayoutEffect as a, COLLECTION_ACTION as m } from "@progress/kendo-react-common";
import { useSchedulerViewItemsContext as i } from "../context/SchedulerViewContext.mjs";
const I = (r, s) => {
  const { _ref: c, itemRef: o } = r, e = t.useRef(null), n = t.useRef(null), [, u] = i();
  return t.useImperativeHandle(e, () => ({ element: n.current, props: r })), t.useImperativeHandle(s, () => e.current), t.useImperativeHandle(c, () => e.current), t.useImperativeHandle(o, () => e.current), a(
    () => (u({
      type: m.add,
      item: e
    }), () => {
      u({
        type: m.remove,
        item: e
      });
    })
  ), {
    item: e,
    element: n
  };
};
export {
  I as useSchedulerItem
};
