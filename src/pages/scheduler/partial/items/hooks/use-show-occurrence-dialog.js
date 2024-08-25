/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("../../hooks/useControlledState.js");var t=(e=>(e.set="SHOW_OCCURRENCE_DIALOG_SET",e.open="SHOW_OCCURRENCE_DIALOG_OPEN",e.close="SHOW_OCCURRENCE_DIALOG_CLOSE",e.reset="SHOW_OCCURRENCE_DIALOG_RESET",e.toggle="SHOW_OCCURRENCE_DIALOG_TOGGLE",e))(t||{});const E=(e,r)=>{switch(r.type){case"SHOW_OCCURRENCE_DIALOG_RESET":return!1;case"SHOW_OCCURRENCE_DIALOG_SET":return r.payload;case"SHOW_OCCURRENCE_DIALOG_OPEN":return!0;case"SHOW_OCCURRENCE_DIALOG_CLOSE":return!1;case"SHOW_OCCURRENCE_DIALOG_TOGGLE":return!e;default:return e}},l=(e,r,O)=>{const[c,o]=s.useControlledState(e,r,O);return[c,o,n=>{const u=E(c,n);o(u)}]};exports.SHOW_OCCURRENCE_DIALOG_ACTION=t;exports.useShowOccurrenceDialog=l;
