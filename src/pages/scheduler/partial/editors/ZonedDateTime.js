/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),i=require("@progress/kendo-react-dateinputs"),r=require("@progress/kendo-date-math"),u=require("../context/SchedulerContext.js");function d(e){const t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const o=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,o.get?o:{enumerable:!0,get:()=>e[n]})}}return t.default=e,Object.freeze(t)}const l=d(s),g=e=>{const{as:t=m.as,...n}=e,{timezone:o}=u.useSchedulerPropsContext(),a=c=>{n.onChange&&n.onChange({value:f(c.target.value,o)})};return l.createElement(t,{...n,value:D(n.value,o),onChange:a})},D=(e,t)=>e&&r.toLocalDate(r.ZonedDate.fromLocalDate(e,t).toUTCDate()),f=(e,t)=>e&&r.ZonedDate.fromUTCDate(new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())),t).toLocalDate(),m={as:i.DateTimePicker};exports.ZonedDateTime=g;
