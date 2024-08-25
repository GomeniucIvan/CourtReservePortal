/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const n=require("../../constants/index.js"),l=require("../../hooks/useControlledState.js");var a=(e=>(e.set="REMOVE_ITEM_SET",e.reset="REMOVE_ITEM_RESET",e.complete="REMOVE_ITEM_COMPLETE",e))(a||{});const m=(e,s)=>{const[o,E]=l.useControlledState(...s);return[o,E,r=>{let t;switch(r.type){case"REMOVE_ITEM_SET":t=r.payload;break;case"REMOVE_ITEM_RESET":t=null;break;case"REMOVE_ITEM_COMPLETE":e.onDataAction&&o&&e.onDataAction.call(void 0,{type:n.DATA_ACTION.remove,series:e.series,dataItem:o}),t=null;break;default:t=o;break}E(t)}]};exports.REMOVE_ITEM_ACTION=a;exports.useRemoveItem=m;