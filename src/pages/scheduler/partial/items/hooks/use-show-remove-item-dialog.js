/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const n=require("../../hooks/useControlledState.js");var s=(e=>(e.set="SHOW_REMOVE_DIALOG_SET",e.open="SHOW_REMOVE_DIALOG_OPEN",e.close="SHOW_REMOVE_DIALOG_CLOSE",e.reset="SHOW_REMOVE_DIALOG_RESET",e.toggle="SHOW_REMOVE_DIALOG_TOGGLE",e))(s||{});const a=(e,o)=>{switch(o.type){case"SHOW_REMOVE_DIALOG_RESET":return!1;case"SHOW_REMOVE_DIALOG_SET":return o.payload;case"SHOW_REMOVE_DIALOG_OPEN":return!0;case"SHOW_REMOVE_DIALOG_CLOSE":return!1;case"SHOW_REMOVE_DIALOG_TOGGLE":return!e;default:return e}},S=(e,o,E)=>{const[t,r]=n.useControlledState(e,o,E);return[t,r,O=>{const l=a(t,O);r(l)}]};exports.SHOW_REMOVE_DIALOG_ACTION=s;exports.useShowRemoveDialog=S;
