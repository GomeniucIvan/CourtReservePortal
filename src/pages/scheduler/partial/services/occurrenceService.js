/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const t=require("@progress/kendo-react-common"),R=require("@progress/kendo-recurrence"),d=require("@progress/kendo-date-math"),i=require("../utils/index.js"),L=(e,{dateRange:r,fields:n,timezone:o})=>e.map(E(n)).reduce(T(r,o,n),[]).filter(a=>!i.isMaster(a.dataItem,n)),E=e=>r=>({uid:t.getter(e.id||"id")(r),start:t.getter(e.start||"start")(r),startTimezone:t.getter(e.startTimezone||"startTimezone")(r),originalStart:t.getter(e.originalStart||"originalStart")(r),end:t.getter(e.end||"end")(r),endTimezone:t.getter(e.endTimezone||"endTimezone")(r),isAllDay:t.getter(e.isAllDay||"isAllDay")(r),title:t.getter(e.title||"title")(r),description:t.getter(e.description||"description")(r),occurrenceId:t.getter("occurrenceId")(r),recurrenceRule:t.getter(e.recurrenceRule||"recurrenceRule")(r),recurrenceExceptions:t.getter(e.recurrenceExceptions||"recurrenceExceptions")(r),recurrenceId:t.getter(e.recurrenceId||"recurrenceId")(r),dataItem:t.clone(r)}),T=(e,r,n)=>(o,c)=>[...o,...c.recurrenceRule&&(c.recurrenceId===null||c.recurrenceId===void 0)&&i.isMaster(c.dataItem,n)?[...z(c,{dateRange:e,timezone:r,fields:n})]:[c]],z=(e,{dateRange:r,timezone:n,fields:o})=>{const c=e.recurrenceRule,a=R.parseRule({recurrenceRule:c});a.start||(a.start=d.ZonedDate.fromLocalDate(e.start,n)),a.end||(a.end=d.ZonedDate.fromLocalDate(e.end,n));const g=e.recurrenceExceptions;g&&(a.exceptionDates=g.map(u=>d.ZonedDate.fromLocalDate(u,n)));const S=r.zonedStart,x=r.zonedEnd,D=R.expand(a,{rangeStart:S,rangeEnd:x});return D.events.length?D.events.map((u,p)=>{const s=t.clone(e),l=t.clone(e.dataItem);return s.recurrenceId=s.uid,i.setField(l,o.recurrenceId,e.uid),s.originalStart=u.start.toLocalDate(),i.setField(l,o.originalStart,u.start.toLocalDate()),s.start=u.start.toLocalDate(),i.setField(l,o.start,u.start.toLocalDate()),s.end=u.end.toLocalDate(),i.setField(l,o.end,u.end.toLocalDate()),s.occurrenceId=String(p),i.setField(l,"occurrenceId",String(p)),s.dataItem=l,s}):[]};exports.toOccurrences=L;