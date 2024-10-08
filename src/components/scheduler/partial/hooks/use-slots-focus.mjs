/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";
var t = /* @__PURE__ */ ((r) => (r.up = "SLOT_FOCUS_UP", r.down = "SLOT_FOCUS_DOWN", r.left = "SLOT_FOCUS_LEFT", r.right = "SLOT_FOCUS_RIGHT", r))(t || {});
const f = (r) => [[], (e, c) => {
  switch (e.type) {
    case "SLOT_FOCUS_UP": {
      if (!e.slot.current || !r)
        return;
      const n = o(e.slot, r);
      n && n.current && n.current.element && (c.preventDefault(), n.current.element.focus());
      break;
    }
    case "SLOT_FOCUS_DOWN": {
      if (!e.slot || !r)
        return;
      const n = s(e.slot, r);
      n && n.current && n.current.element && (c.preventDefault(), n.current.element.focus());
      break;
    }
    case "SLOT_FOCUS_LEFT": {
      if (!e.slot || !r)
        return;
      const n = l(e.slot, r);
      n && n.current && n.current.element && (c.preventDefault(), n.current.element.focus());
      break;
    }
    case "SLOT_FOCUS_RIGHT": {
      if (!e.slot || !r)
        return;
      const n = p(e.slot, r);
      n && n.current && n.current.element && (c.preventDefault(), n.current.element.focus());
      break;
    }
  }
}], o = (r, u) => u.find((e) => e.current !== null && r.current !== null && e.current.props.row === r.current.props.row - 1 && e.current.props.col === r.current.props.col), l = (r, u) => u.find((e) => e.current !== null && r.current !== null && e.current.props.row === r.current.props.row && e.current.props.col === r.current.props.col - 1), p = (r, u) => u.find((e) => e.current !== null && r.current !== null && e.current.props.row === r.current.props.row && e.current.props.col === r.current.props.col + 1), s = (r, u) => u.find((e) => e.current !== null && r.current !== null && e.current.props.row === r.current.props.row + 1 && e.current.props.col === r.current.props.col);
export {
  t as SLOTS_FOCUS_ACTION,
  s as findDownSlot,
  l as findLeftSlot,
  p as findRightSlot,
  o as findUpSlot,
  f as useSlotsFocus
};
