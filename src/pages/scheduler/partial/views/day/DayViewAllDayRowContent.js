/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("react"),o=require("@progress/kendo-react-intl"),l=require("../../messages/index.js");function i(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const c=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,c.get?c:{enumerable:!0,get:()=>e[n]})}}return t.default=e,Object.freeze(t)}const a=i(r),s=e=>{const t=o.useLocalization();return a.createElement(a.Fragment,null,a.createElement("div",{className:"k-scheduler-cell k-heading-cell k-side-cell k-scheduler-times-all-day"},t.toLanguageString(l.allDay,l.messages[l.allDay])),e.children)};exports.DayViewAllDayRowContent=s;