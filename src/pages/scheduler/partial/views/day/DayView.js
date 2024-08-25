/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),o=require("./MultiDayView.js"),i=require("../../messages/index.js");function l(e){const a=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(a,t,r.get?r:{enumerable:!0,get:()=>e[t]})}}return a.default=e,Object.freeze(a)}const c=l(s),n=e=>c.createElement(o.MultiDayView,{...e}),u={...o.multiDayViewDefaultProps,name:"day",title:e=>e.toLanguageString(i.dayViewTitle,i.messages[i.dayViewTitle]),step:1,numberOfDays:1,slotDuration:60,slotDivisions:2,selectedDateFormat:"{0:D}",selectedShortDateFormat:"{0:d}"};n.displayName="KendoReactSchedulerDayView";exports.DayView=n;exports.dayViewDefaultProps=u;
