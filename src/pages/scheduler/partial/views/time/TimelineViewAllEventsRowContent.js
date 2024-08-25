/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("react"),a=require("../../messages/index.js"),i=require("@progress/kendo-react-intl");function o(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const c=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,c.get?c:{enumerable:!0,get:()=>e[n]})}}return t.default=e,Object.freeze(t)}const l=o(r),s=e=>{const t=i.useLocalization();return l.createElement(l.Fragment,null,l.createElement("div",{className:"k-sticky-cell"},l.createElement("div",{className:"k-scheduler-cell k-heading-cell k-side-cell k-scheduler-times-all-day","data-range-index":0},t.toLanguageString(a.allEvents,a.messages[a.allEvents]))),e.children)};exports.TimelineViewAllEventsRowContent=s;