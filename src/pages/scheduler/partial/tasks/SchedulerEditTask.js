/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const G=require("react"),J=require("./SchedulerViewTask.js"),f=require("../hooks/useControlledState.js"),L=require("../utils/index.js"),Q=require("../constants/index.js"),U=require("../components/SchedulerRemoveDialog.js"),W=require("../components/SchedulerOccurrenceDialog.js"),k=require("../context/SchedulerContext.js"),X=require("../context/SchedulerEditTaskContext.js"),Y=require("../hooks/useEditable.js");function Z(o){const d=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(o){for(const s in o)if(s!=="default"){const m=Object.getOwnPropertyDescriptor(o,s);Object.defineProperty(d,s,m.get?m:{enumerable:!0,get:()=>o[s]})}}return d.default=o,Object.freeze(d)}const t=Z(G),v=t.forwardRef((o,d)=>{const{_ref:s,onDataAction:m,viewTask:R,removeDialog:w,removeItem:b,onRemoveItemChange:O,occurrenceDialog:T,showOccurrenceDialog:I,onShowOccurrenceDialogChange:E,showRemoveDialog:p,onShowRemoveDialogChange:q,...x}=o,i=t.useRef(null);t.useImperativeHandle(i,()=>({props:o,element:i.current&&i.current.element})),t.useImperativeHandle(s,()=>i.current),t.useImperativeHandle(d,()=>i.current);const y=R||g.viewTask,P=T||g.occurrenceDialog,_=w||g.removeDialog,j=Y.useEditable(o.editable),C=k.useSchedulerFieldsContext(),[A,H]=k.useSchedulerDataContext(),[M,u]=t.useState(null),[c,r]=f.useControlledState(null,b,O),[D,a]=f.useControlledState(!1,p,q),[S,l]=f.useControlledState(!1,I,E),N=t.useCallback(e=>{j.remove&&(r(o.dataItem,e),o.isRecurring?l(!0,e):a(!0,e))},[r,o.dataItem,o.isRecurring,l,a]),h=t.useCallback(e=>{u(null),r(null,e),a(!1,e),l(!1,e)},[u,r,a,l]),V=t.useCallback(e=>{m&&c&&m.call(void 0,{type:Q.DATA_ACTION.remove,series:M,dataItem:c}),r(null,e),a(!1,e)},[c,H,a]),z=t.useCallback((e,n)=>{r&&r(e,n)},[r]),F=t.useCallback((e,n)=>{a&&a(e,n)},[a]),K=t.useCallback((e,n)=>{l&&l(e,n)},[l]),$=t.useCallback(e=>{c&&(u(!1),r(o.dataItem,e),a(!0,e)),l(!1,e)},[u,o.dataItem,c,r,a]),B=t.useCallback(e=>{if(c){u(!0);const n=L.findMaster(c,C,A);r(n,e),a(!0,e)}l(!1,e)},[C,c,u,r,a,l]);return t.createElement(X.SchedulerEditTaskContext,{remove:[c,z],showRemoveDialog:[D,F],showOccurrenceDialog:[S,K]},t.createElement(y,{_ref:i,...x,onRemoveClick:N}),S&&t.createElement(P,{dataItem:c,isRemove:c!==null,onClose:h,onOccurrenceClick:$,onSeriesClick:B}),D&&t.createElement(_,{dataItem:c,onClose:h,onCancel:h,onConfirm:V}))}),g={viewTask:J.SchedulerViewTask,occurrenceDialog:W.SchedulerOccurrenceDialog,removeDialog:U.SchedulerRemoveDialog};v.displayName="KendoReactSchedulerEditTask";exports.SchedulerEditTask=v;exports.schedulerEditTaskDefaultProps=g;
