/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const u=require("../utils/index.js");var s=(r=>(r.next="ITEMS_FOCUS_NEXT",r.prev="ITEMS_FOCUS_PREV",r))(s||{});const c=r=>[[],(e,n)=>{switch(e.type){case"ITEMS_FOCUS_NEXT":{if(!e.item||!e.item.current||!r)return;const t=u.findNextItem(e.item,r,e.ignoreIsAllDay,!1);t&&t.current&&t.current.element&&(n.preventDefault(),t.current.element.focus());break}case"ITEMS_FOCUS_PREV":{if(!e.item||!e.item.current||!r)return;const t=u.findNextItem(e.item,r,e.ignoreIsAllDay,!0);t&&t.current&&t.current.element&&(n.preventDefault(),t.current.element.focus());break}}}];exports.ITEMS_FOCUS_ACTION=s;exports.useItemsFocus=c;
