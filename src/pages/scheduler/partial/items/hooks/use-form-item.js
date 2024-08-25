/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const E=require("@progress/kendo-react-common"),m=require("../../hooks/useControlledState.js"),M=require("../../utils/index.js"),i=require("../../constants/index.js"),a=require("../../context/SchedulerContext.js");var n=(e=>(e.set="FORM_ITEM_SET",e.setMaster="FORM_ITEM_SET_MASTER",e.reset="FORM_ITEM_RESET",e.complete="FORM_ITEM_COMPLETE",e))(n||{});const T=(e,l)=>{const[o,s]=m.useControlledState(...l),c=a.useSchedulerFieldsContext(),[u]=a.useSchedulerDataContext();return[o,s,(r,d)=>{let t;switch(r.type){case"FORM_ITEM_SET":t=r.payload;break;case"FORM_ITEM_RESET":t=null;break;case"FORM_ITEM_SET_MASTER":t=E.clone(M.findMaster(r.payload,c,u));break;case"FORM_ITEM_COMPLETE":e.onDataAction&&o&&(e.onDataAction.call(void 0,{type:i.DATA_ACTION.update,series:e.series,dataItem:r.payload}),t=null);break;default:t=o;break}s(t,d)}]};exports.FORM_ITEM_ACTION=n;exports.useFormItem=T;
