/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const se=require("react"),Ee=require("@progress/kendo-date-math"),i=require("@progress/kendo-react-labels"),ue=require("@progress/kendo-react-intl"),a=require("@progress/kendo-react-form"),b=require("@progress/kendo-react-inputs"),h=require("@progress/kendo-react-dateinputs"),n=require("../messages/index.js"),C=require("./FilterableComboBox.js"),be=require("@progress/kendo-react-common"),Te=require("../recurrence/RecurrenceEditor.js"),ke=require("./ResourceEditor.js"),S=require("./ZonedDateTime.js"),D=require("../context/SchedulerContext.js");function ze(r){const c=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(r){for(const m in r)if(m!=="default"){const E=Object.getOwnPropertyDescriptor(r,m);Object.defineProperty(c,m,E.get?E:{enumerable:!0,get:()=>r[m]})}}return c.default=r,Object.freeze(c)}const e=ze(se),N=e.forwardRef((r,c)=>{const m=e.useRef(null),E=e.useRef(null),L=Ee.timezoneNames(),d=ue.useLocalization(),t=D.useSchedulerFieldsContext(),{resources:p,timezone:T}=D.useSchedulerPropsContext();e.useImperativeHandle(E,()=>({element:m.current&&m.current.element?m.current.element:m.current,props:r})),e.useImperativeHandle(c,()=>E.current);const{as:v=o.as,...y}=r,{titleLabel:R=o.titleLabel,titleError:x=o.titleError,titleEditor:q=o.titleEditor,startLabel:Z=o.startLabel,startError:w=o.startError,startEditor:I=o.startEditor,startTimezoneLabel:A=o.startTimezoneLabel,startTimezoneError:P=o.startTimezoneError,startTimezoneEditor:W=o.startTimezoneEditor,startTimezoneCheckedLabel:g=o.startTimezoneCheckedLabel,startTimezoneCheckedEditor:G=o.startTimezoneCheckedEditor,endLabel:M=o.endLabel,endError:O=o.endError,endEditor:j=o.endEditor,endTimezoneLabel:B=o.endTimezoneLabel,endTimezoneError:V=o.endTimezoneError,endTimezoneEditor:_=o.endTimezoneEditor,endTimezoneCheckedLabel:H=o.endTimezoneCheckedLabel,endTimezoneCheckedEditor:K=o.endTimezoneCheckedEditor,allDayLabel:J=o.allDayLabel,allDayEditor:Q=o.allDayEditor,recurrenceEditor:U=o.recurrenceEditor,descriptionLabel:X=o.descriptionLabel,descriptionEditor:Y=o.descriptionEditor,descriptionError:$=o.descriptionError,resourceLabel:ee=o.resourceLabel,resourceEditor:te=o.resourceEditor}=r,re=r.valueGetter(t.start)||new Date,ae=r.valueGetter(t.startTimezone)||T||"",ne=r.valueGetter(t.endTimezone)||T||"",f=e.useMemo(()=>d.toLanguageString(n.editorValidationRequired,n.messages[n.editorValidationRequired]),[d]),[s,oe]=e.useState(!!r.valueGetter(t.startTimezone)),[k,F]=e.useState(!!r.valueGetter(t.endTimezone)),le=e.useCallback(l=>{l.value||(r.onChange(t.startTimezone,{value:null}),r.onChange(t.endTimezone,{value:null}),F(l.value)),oe(l.value)},[r.onChange,t.startTimezone,t.endTimezone]),ie=e.useCallback(l=>{l.value||r.onChange(t.endTimezone,{value:null}),F(l.value)},[r.onChange]),u=e.useCallback(l=>l?void 0:f,[f]),de=e.useCallback((l,z)=>s?u(z(t.startTimezone)):void 0,[u,s,t.startTimezone]),me=e.useCallback((l,z)=>s&&k?u(z(t.endTimezone))||u(z(t.startTimezone)):void 0,[u,s,k,t.startTimezone,t.endTimezone]),ce=e.useMemo(()=>be.classNames("k-scheduler-edit-form",r.className),[r.className]);return e.createElement(v,{ref:v===o.as?m:void 0,...y,className:ce},e.createElement(e.Fragment,null,e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.title,component:R,editorId:"k-scheduler-editor-title",className:"k-form-label"},d.toLanguageString(n.editorEventTitle,n.messages[n.editorEventTitle])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{id:"k-scheduler-editor-title",name:t.title,field:t.title,component:q}),r.errors[t.title]&&e.createElement(a.Field,{name:t.title,component:x},r.errors[t.title]))),e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.start,component:Z,editorId:"k-scheduler-editor-start",className:"k-form-label"},d.toLanguageString(n.editorEventStart,n.messages[n.editorEventStart])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{id:"k-scheduler-editor-start",name:t.start,width:"auto",component:I,as:r.valueGetter(t.isAllDay)?h.DatePicker:h.DateTimePicker,timezone:T}),r.errors[t.start]&&e.createElement(a.Field,{name:t.start,component:w},r.errors[t.start]))),e.createElement(a.FieldWrapper,null,e.createElement(g,{className:"k-form-label"}),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(G,{id:"k-scheduler-editor-set-start-timezone",onChange:le,value:s}),e.createElement(g,{className:"k-checkbox-label",editorId:"k-scheduler-editor-set-start-timezone"},d.toLanguageString(n.editorEventTimeZone,n.messages[n.editorEventTimeZone])))),s&&e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.start,component:A,className:"k-form-label"},d.toLanguageString(n.editorEventStartTimeZone,n.messages[n.editorEventStartTimeZone])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{component:W,value:ae,validator:de,data:L,name:t.startTimezone}),r.errors[t.startTimezone]&&e.createElement(a.Field,{name:t.startTimezone,component:P},r.errors[t.startTimezone]))),e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.end,component:M,editorId:"k-scheduler-editor-end",className:"k-form-label"},d.toLanguageString(n.editorEventEnd,n.messages[n.editorEventEnd])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{id:"k-scheduler-editor-end",name:t.end,width:"auto",component:j,as:r.valueGetter(t.isAllDay)?h.DatePicker:h.DateTimePicker,timezone:T}),r.errors[t.end]&&e.createElement(a.Field,{name:t.end,component:O},r.errors[t.end]))),s&&e.createElement(a.FieldWrapper,null,e.createElement("div",{className:"k-form-field-wrap"},e.createElement(K,{id:"k-scheduler-editor-set-end-timezone",onChange:ie,value:k})),e.createElement(H,{editorId:"k-scheduler-editor-set-end-timezone",className:"k-form-label"},d.toLanguageString(n.editorEventSeparateTimeZones,n.messages[n.editorEventSeparateTimeZones]))),k&&e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.endTimezone,component:B,className:"k-form-label"},d.toLanguageString(n.editorEventEndTimeZone,n.messages[n.editorEventEndTimeZone])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{value:ne,data:L,validator:me,component:_,name:t.endTimezone}),r.errors[t.endTimezone]&&e.createElement(a.Field,{name:t.endTimezone,component:V},r.errors[t.endTimezone]))),e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.isAllDay,component:i.Label,className:"k-form-label"}),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{id:"k-is-allday-checkbox",name:t.isAllDay,component:Q}),e.createElement(a.Field,{name:t.isAllDay,field:t.isAllDay,editorId:"k-is-allday-checkbox",className:"k-checkbox-label",component:J},d.toLanguageString(n.editorEventAllDay,n.messages[n.editorEventAllDay])))),e.createElement("div",{className:"k-recurrence-editor"},e.createElement(a.Field,{component:U,field:t.recurrenceRule,name:t.recurrenceRule,start:re})),e.createElement(a.FieldWrapper,null,e.createElement(a.Field,{name:t.description,component:X,className:"k-form-label"},d.toLanguageString(n.editorEventDescription,n.messages[n.editorEventDescription])),e.createElement("div",{className:"k-form-field-wrap"},e.createElement(a.Field,{component:Y,name:t.description,rows:1,id:"k-event-description"}),r.errors[t.description]&&e.createElement(a.Field,{name:t.description,component:$},r.errors[t.description]))),(p||[]).map(l=>e.createElement(a.FieldWrapper,{key:l.field},e.createElement(a.Field,{name:l.field,component:ee,className:"k-form-label"}),e.createElement(i.Label,{className:"k-form-label"},l.name),e.createElement(a.Field,{name:l.field,component:te,resource:l,multiple:l.multiple,data:l.data,textField:l.textField,valueField:l.valueField,colorField:l.colorField})))))}),o={as:e.forwardRef((r,c)=>e.createElement(a.FormElement,{ref:c,id:r.id,style:r.style,tabIndex:r.tabIndex,className:r.className,horizontal:r.horizontal,children:r.children})),titleLabel:i.Label,titleError:i.Error,titleEditor:b.Input,startLabel:i.Label,startError:i.Error,startEditor:S.ZonedDateTime,startTimezoneLabel:i.Label,startTimezoneError:i.Error,startTimezoneEditor:C.FilterableComboBox,startTimezoneCheckedLabel:i.Label,startTimezoneCheckedEditor:b.Checkbox,endLabel:i.Label,endError:i.Error,endEditor:S.ZonedDateTime,endTimezoneLabel:i.Label,endTimezoneError:i.Error,endTimezoneEditor:C.FilterableComboBox,endTimezoneCheckedLabel:i.Label,endTimezoneCheckedEditor:b.Checkbox,allDayLabel:i.Label,allDayEditor:b.Checkbox,recurrenceEditor:Te.RecurrenceEditor,descriptionLabel:i.Label,descriptionEditor:b.TextArea,descriptionError:i.Error,resourceLabel:i.Label,resourceEditor:ke.ResourceEditor};N.displayName="KendoReactSchedulerFormEditor";exports.SchedulerFormEditor=N;exports.schedulerFormEditorDefaultProps=o;