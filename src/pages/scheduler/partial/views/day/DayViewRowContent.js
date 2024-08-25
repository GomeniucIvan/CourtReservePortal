/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("react"),c=require("@progress/kendo-react-common"),o=require("../../components/TimeHeaderCell.js");function s(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const l=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,l.get?l:{enumerable:!0,get:()=>e[n]})}}return t.default=e,Object.freeze(t)}const a=s(r),i=e=>{const{slot:t,children:n}=e;return a.createElement(a.Fragment,null,e.isMaster?a.createElement(o.TimeHeaderCell,{as:e.timeHeaderCell,date:t.zonedStart,start:t.zonedStart,end:t.zonedEnd,className:c.classNames("k-side-cell",{"k-major-cell":!e.isLast})}):a.createElement("div",{className:"k-scheduler-cell k-heading-cell k-side-cell"}),n)};exports.DayViewRowContent=i;