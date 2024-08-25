/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const o=require("react"),r=require("./MultiDayTimelineView.js"),n=require("../../messages/index.js");function s(e){const i=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const l=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(i,t,l.get?l:{enumerable:!0,get:()=>e[t]})}}return i.default=e,Object.freeze(i)}const c=s(o),a=e=>c.createElement(r.MultiDayTimelineView,{...e}),u={...r.multiDayTimelineViewDefaultProps,name:"timeline",title:e=>e.toLanguageString(n.timelineViewTitle,n.messages[n.timelineViewTitle]),step:1,slotDuration:60,slotDivisions:2,numberOfDays:1,selectedDateFormat:"{0:D}",selectedShortDateFormat:"{0:d}"};a.displayName="KendoReactSchedulerTimelineView";exports.TimelineView=a;exports.timeLineViewDefaultProps=u;