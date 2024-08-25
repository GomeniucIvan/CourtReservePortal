/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const d=require("@progress/kendo-date-math"),D=(n,{step:o,timezone:a})=>{const c=[],g=d.ZonedDate.fromLocalDate(n.start,a),i=d.ZonedDate.fromLocalDate(n.end,a);for(let e=g.clone(),r=0;e.getTime()<i.getTime();r++,e=e.addTime(o)){const t=e.clone(),s=t.clone().addTime(o),l=new Date(t.getTime()),m=new Date(s.getTime()),u={index:r,end:m,start:l,zonedStart:t,zonedEnd:s};c.push(u)}return c};exports.toRanges=D;
