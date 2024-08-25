/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const Q=require("react"),p=require("../../components/BaseView.js"),l=require("@progress/kendo-date-math"),j=require("../common/HorizontalResourceIterator.js"),ee=require("./TimelineViewRowContent.js"),te=require("./TimelineViewAllEventsRowContent.js"),Z=require("../common/VerticalResourceIterator.js"),n=require("../../utils/index.js"),re=require("@progress/kendo-react-common"),ne=require("../../services/rangeService.js"),ae=require("../../services/slotsService.js"),oe=require("../../services/occurrenceService.js"),ie=require("../../services/itemsService.js"),se=require("../../slots/SchedulerEditSlot.js"),ce=require("../../constants/index.js"),le=require("@progress/kendo-react-intl"),ue=require("../../items/SchedulerEditItem.js"),E=require("../../context/SchedulerContext.js"),H=require("../../context/SchedulerResourceIteratorContext.js"),B=require("../../components/CurrentTimeMarket.js"),de=require("../../components/DateHeaderCell.js"),me=require("../../components/TimeHeaderCell.js"),De=require("../../hooks/useCellSync.js"),Te=require("../../hooks/useRowSync.js");function Se(e){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const a in e)if(a!=="default"){const u=Object.getOwnPropertyDescriptor(e,a);Object.defineProperty(s,a,u.get?u:{enumerable:!0,get:()=>e[a]})}}return s.default=e,Object.freeze(s)}const t=Se(Q),ge="t",we=0,ke=e=>{const{group:s,timezone:a,resources:u}=E.useSchedulerPropsContext(),w=t.useRef(null),z=t.useRef(null),f=e.editItem||ue.SchedulerEditItem,C=e.editSlot||se.SchedulerEditSlot,k=t.useRef(null),[v]=E.useSchedulerDataContext(),h=E.useSchedulerOrientationContext(),R=E.useSchedulerGroupsContext(),d=E.useSchedulerDateRangeContext(),A=E.useSchedulerFieldsContext(),I=le.useInternationalization(),M=e.showWorkHours,V=e.slotDivisions||c.slotDivisions,q=e.slotDuration||c.slotDuration,G=e.workWeekStart||c.workWeekStart,L=e.workWeekEnd||c.workWeekEnd,W=I.parseDate(e.workDayStart||e.isWorkDayStart||c.isWorkDayStart),x=I.parseDate(e.workDayEnd||e.isWorkDayEnd||c.isWorkDayEnd),N=I.parseDate(e.startTime||c.startTime),_=I.parseDate(e.endTime||c.endTime),D=t.useMemo(()=>M?W:N,[M,W,N]),T=t.useMemo(()=>M?x:_,[M,x,_]),o=t.useMemo(()=>ne.toRanges(d,{step:l.MS_PER_DAY,timezone:a}),[d.start.getTime(),d.end.getTime(),a]),m=t.useMemo(()=>ae.toSlots(d,{step:q/V*l.MS_PER_MINUTE},{groups:R,ranges:o}).filter(r=>n.isInTimeRange(r.zonedStart,D,T)||D.getTime()===T.getTime()),[R,o,d.start.getTime(),d.end.getTime(),a,q,V,D.getTime(),T.getTime()]),O=t.useMemo(()=>oe.toOccurrences(v,{dateRange:d,fields:A,timezone:a}),[v,d.start.getTime(),d.end.getTime(),A,a]),S=t.useMemo(()=>ie.toItems(O,{timezone:a},{groups:R,ranges:o}).filter(r=>D.getTime()===T.getTime()||n.isInTimeRange(r.zonedStart,D,T)||n.isInTimeRange(r.zonedEnd,D,T)||n.isInTimeRange(new Date(r.zonedEnd.getTime()-(r.zonedEnd.getTime()-r.zonedStart.getTime())/2),D,T)),[O,a,R,o,D.getTime(),T.getTime()]);t.useMemo(()=>n.mapItemsToSlots(S,m,!0),[S,m]),t.useMemo(()=>n.mapSlotsToItems(S,m,!0),[S,m]);const $=(h==="horizontal"?m.length:m.length/R.length)*((e.columnWidth||c.columnWidth)+ce.BORDER_WIDTH),F=t.createElement(H.SchedulerResourceIteratorContext.Consumer,null,()=>t.createElement(t.Fragment,null,t.createElement("div",{className:"k-scheduler-row"},o.map((r,y)=>t.createElement(de.DateHeaderCell,{as:e.dateHeaderCell,key:y,date:r.zonedStart,start:r.start,end:r.end,format:"m"}))),t.createElement("div",{className:"k-scheduler-row",ref:w},o.map((r,y)=>m.filter(i=>i.group.index===we&&i.range.index===y).map(i=>i.zonedStart.getMinutes()%q===0?t.createElement(me.TimeHeaderCell,{key:i.index,as:e.timeHeaderCell,format:ge,date:i.zonedStart,start:i.zonedStart,end:i.zonedEnd}):null))))),P=t.createElement(H.SchedulerResourceIteratorContext.Consumer,null,({groupIndex:r})=>t.createElement("div",{className:"k-scheduler-row"},o.map((y,i)=>m.filter(g=>g.group.index===r&&g.range.index===i).map((g,U,b)=>{const J=l.ZonedDate.fromUTCDate(n.toUTCDateTime(g.zonedStart),a),K=n.isInDaysRange(J.getDay(),G,L);return t.createElement(C,{key:`${g.start.getTime()}:${g.group.index}`,slot:e.slot,viewSlot:e.viewSlot,...g,form:e.form,onDataAction:e.onDataAction,isWorkHour:n.isInTimeRange(g.zonedStart,W,x),isWorkDay:K,col:h==="horizontal"?i*b.length+U+b.length*o.length*(r||0):i*b.length+U,row:h==="horizontal"?0:r||0,expandable:!0,editable:e.editable})})))),X=t.useMemo(()=>re.classNames("k-scheduler-timeline-view",e.className),[e.className]);De.useCellSync({element:k,selector:".k-resource-cell",attribute:"data-depth-index",explicitDepth:!0});const Y=k.current?k.current.closest(".k-scheduler-layout"):null;return Te.useRowSync({element:Y,selector:".k-resource-row",horizontalAttribute:"data-depth-index",verticalAttribute:"data-resource-index",applyTo:".k-resource-cell",syncHeight:S&&!S.length}),t.createElement(t.Fragment,null,t.createElement(p.BaseView,{ref:k,id:e.id,style:{...e.style},className:X,props:e,slots:m,ranges:o},t.createElement("div",{className:"k-scheduler-head",style:{width:$}},h==="horizontal"?t.createElement(j.HorizontalResourceIterator,{nested:!0,group:s,resources:u,rowContent:ee.TimelineViewRowContent},F):t.createElement(Z.VerticalResourceIterator,{wrapGroup:!0,group:s,resources:u},F)),t.createElement("div",{className:"k-scheduler-body",style:{width:$},ref:z},h==="horizontal"?t.createElement(j.HorizontalResourceIterator,{group:s,resources:u,rowContent:te.TimelineViewAllEventsRowContent},P,t.createElement(H.SchedulerResourceIteratorContext.Consumer,null,({groupIndex:r})=>e.currentTimeMarker&&n.intersects(n.first(o).start,n.last(o).end,new Date,new Date,!0)&&t.createElement(B.CurrentTimeMarker,{groupIndex:r,attachArrow:w,vertical:!0}))):t.createElement(Z.VerticalResourceIterator,{nested:!0,wrapGroup:!0,group:s,resources:u},P),h==="vertical"&&e.currentTimeMarker&&n.intersects(n.first(o).start,n.last(o).end,new Date,new Date,!0)&&t.createElement(B.CurrentTimeMarker,{attachArrow:w,vertical:!0}),S.sort(n.orderSort).map((r,y)=>t.createElement(f,{key:r.isRecurring?`${r.uid}:${r.group.index}:${r.range.index}:${r.originalStart}`:`${r.uid}:${r.group.index}:${r.range.index}`,...r,format:"t",form:e.form,onDataAction:e.onDataAction,item:e.item,viewItem:e.viewItem,editable:e.editable,ignoreIsAllDay:!0,vertical:!1,isLast:y===S.length-1})))))},he=({date:e,numberOfDays:s=1,timezone:a})=>{const u=l.ZonedDate.fromLocalDate(e,a),w=l.getDate(u),z=l.addDays(w,s),f=l.ZonedDate.fromUTCDate(n.toUTCDateTime(w),a),C=l.ZonedDate.fromUTCDate(n.toUTCDateTime(z),a),k=new Date(f.getTime()),v=new Date(C.getTime());return{start:k,end:v,zonedStart:f,zonedEnd:C}},c={name:"multi-day-timeline",title:"Multi Day Timeline",currentTimeMarker:!0,dateRange:he,selectedDateFormat:"{0:D} - {1:D}",selectedShortDateFormat:"{0:d} - {1:d}",step:1,numberOfDays:1,startTime:"00:00",endTime:"00:00",isWorkDayStart:"8:00",isWorkDayEnd:"17:00",workWeekStart:l.Day.Monday,workWeekEnd:l.Day.Friday,slotDivisions:2,slotDuration:60,defaultShowWorkHours:!0,columnWidth:100};exports.MultiDayTimelineView=ke;exports.multiDayTimelineViewDefaultProps=c;
