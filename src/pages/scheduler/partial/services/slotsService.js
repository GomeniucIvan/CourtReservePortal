/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const M=require("react"),y=require("@progress/kendo-date-math"),S=require("../constants/index.js");function D(n){const e=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(n){for(const o in n)if(o!=="default"){const c=Object.getOwnPropertyDescriptor(n,o);Object.defineProperty(e,o,c.get?c:{enumerable:!0,get:()=>n[o]})}}return e.default=n,Object.freeze(e)}const R=D(M),P=(n,{step:e},{groups:o,ranges:c})=>{const a=[];return o.forEach(T=>{c.forEach(i=>{const f=i.zonedStart,d=i.zonedEnd,l=d.timezoneOffset-f.timezoneOffset;for(let t=f.clone(),u=0,m=l<0?l*S.MS_PER_MINUTE*-1:0;t.getTime()<d.getTime();u++,t=t.addTime(e)){const _=R.createRef(),r=t.clone(),s=t.addTime(e),g=(s.timezoneOffset-r.timezoneOffset)*S.MS_PER_MINUTE,E=e<=Math.abs(g);m&&E&&(m-=e,t=t.addTime(-e));const O=new Date(r.getTime()),b=new Date(s.getTime()),z={_ref:_,index:u,end:b,start:O,zonedStart:r,zonedEnd:s,range:i,group:T,items:[],isAllDay:y.MS_PER_DAY<=e};a.push(z)}})}),a};exports.toSlots=P;
