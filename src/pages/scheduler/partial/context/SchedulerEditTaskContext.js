/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("react");function u(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const o in e)if(o!=="default"){const c=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(r,o,c.get?c:{enumerable:!0,get:()=>e[o]})}}return r.default=e,Object.freeze(r)}const t=u(i),n=t.createContext([null]),a=t.createContext([!1]),l=t.createContext([!1]),d=e=>t.createElement(n.Provider,{value:e.remove},t.createElement(a.Provider,{value:e.showRemoveDialog},t.createElement(l.Provider,{value:e.showOccurrenceDialog},e.children)));exports.SchedulerEditTaskContext=d;exports.SchedulerEditTaskRemoveItemContext=n;exports.SchedulerEditTaskShowOccurrenceDialogContext=l;exports.SchedulerEditTaskShowRemoveDialogContext=a;