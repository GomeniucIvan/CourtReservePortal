/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const u=require("react");function d(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const c=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,c.get?c:{enumerable:!0,get:()=>e[t]})}}return r.default=e,Object.freeze(r)}const o=d(u),l=o.createContext([null]),i=()=>o.useContext(l);l.displayName="SchedulerEditSlotPropsContext";const n=o.createContext([null]),s=()=>o.useContext(n);n.displayName="SchedulerEditSlotFormItemContext";const S=({props:e,form:r,children:t})=>o.createElement(l.Provider,{value:e},o.createElement(n.Provider,{value:r},t));exports.SchedulerEditSlotContext=S;exports.SchedulerEditSlotFormItemContext=n;exports.SchedulerEditSlotPropsContext=l;exports.useSchedulerEditSlotFormItemContext=s;exports.useSchedulerEditSlotPropsContext=i;
