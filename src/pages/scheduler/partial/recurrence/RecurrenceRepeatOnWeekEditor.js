/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const g=require("react"),l=require("@progress/kendo-react-buttons"),f=require("./common.js");function m(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const a in e)if(a!=="default"){const c=Object.getOwnPropertyDescriptor(e,a);Object.defineProperty(t,a,c.get?c:{enumerable:!0,get:()=>e[a]})}}return t.default=e,Object.freeze(t)}const o=m(g),b=e=>{const{value:t,data:a,onChange:c,...d}={...i,...e},s=n=>{const r=Number(n.currentTarget.dataset.key);e.onChange&&e.onChange.call(void 0,t.some(u=>u===r)?t.filter(u=>u!==r):[...t,r])};return o.createElement(o.Fragment,null,o.createElement(l.ButtonGroup,{width:"auto",...d},(e.data||i.data).map(n=>o.createElement(l.Button,{type:"button",key:n.value,"data-key":n.value,selected:t.some(r=>r===n.value),togglable:!0,onClick:s},f.capitalize(n.text)))))},i={data:[],value:[]};exports.RecurrenceRepeatOnWeekEditor=b;
