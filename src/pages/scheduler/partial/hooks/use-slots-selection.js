/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const n=require("react");function u(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const s in e)if(s!=="default"){const l=Object.getOwnPropertyDescriptor(e,s);Object.defineProperty(t,s,l.get?l:{enumerable:!0,get:()=>e[s]})}}return t.default=e,Object.freeze(t)}const S=u(n);var o=(e=>(e.select="SLOTS_SELECT_SELECT",e.reset="SLOTS_SELECT_RESET",e.add="SLOTS_SELECT_ADD",e))(o||{});const a=e=>{const[t,s]=S.useState([]),l=S.useCallback(r=>{switch(r.type){case"SLOTS_SELECT_SELECT":if(!r.slot)return;s([r.slot]);break;case"SLOTS_SELECT_RESET":s([]);break;case"SLOTS_SELECT_ADD":if(!r.slot)return;t.some(c=>c===r.slot)||s([...t,r.slot]);break}},[t]);return[t,l]};exports.SLOTS_SELECT_ACTION=o;exports.useSlotsSelection=a;
