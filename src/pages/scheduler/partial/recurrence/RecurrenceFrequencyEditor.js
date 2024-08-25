/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),u=require("@progress/kendo-react-buttons");function d(e){const c=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(c,t,r.get?r:{enumerable:!0,get:()=>e[t]})}}return c.default=e,Object.freeze(c)}const a=d(s),i=e=>{const{value:c,data:t,onChange:r,...o}=e,l=a.useCallback(n=>{r&&r.call(void 0,n.currentTarget.dataset.value)},[r]);return a.createElement(u.ButtonGroup,{className:"k-scheduler-recurrence-repeat",width:"100%",...o},t.map(n=>a.createElement(u.Button,{type:"button",key:n.value,selected:n.value===c,onClick:l,"data-value":n.value,togglable:!0},n.text)))};exports.RecurrenceFrequencyEditor=i;
