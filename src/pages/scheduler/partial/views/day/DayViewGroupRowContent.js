/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const a=require("react");function l(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const c=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,c.get?c:{enumerable:!0,get:()=>e[t]})}}return n.default=e,Object.freeze(n)}const r=l(a),o=e=>r.createElement(r.Fragment,null,r.createElement("div",{className:"k-scheduler-cell k-side-cell","data-range-index":e.rangeIndex}),e.children);exports.DayViewGroupRowContent=o;
