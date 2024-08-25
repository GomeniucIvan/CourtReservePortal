/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("../../hooks/useControlledState.js");var S=(e=>(e.reset="SERIES_RESET",e.set="SERIES_SET",e.toggle="SERIES_TOGGLE",e))(S||{});const c=(e,r)=>{switch(r.type){case"SERIES_RESET":return null;case"SERIES_SET":return r.payload;case"SERIES_TOGGLE":return!e;default:return e}},i=(e,r,n)=>{const[t,s]=o.useControlledState(e,r,n);return[t,s,u=>{const E=c(t,u);s(E)}]};exports.SERIES_ACTION=S;exports.useSeries=i;
