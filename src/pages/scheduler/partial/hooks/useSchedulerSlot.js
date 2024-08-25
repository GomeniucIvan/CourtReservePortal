/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),l=require("@progress/kendo-react-common"),a=require("../context/SchedulerViewContext.js");function i(t){const u=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t){for(const n in t)if(n!=="default"){const e=Object.getOwnPropertyDescriptor(t,n);Object.defineProperty(u,n,e.get?e:{enumerable:!0,get:()=>t[n]})}}return u.default=t,Object.freeze(u)}const r=i(s),d=(t,u)=>{const{_ref:n}=t,e=r.useRef(null),c=r.useRef(null),[,o]=a.useSchedulerViewSlotsContext();return r.useImperativeHandle(e,()=>({element:c.current,props:t})),r.useImperativeHandle(u,()=>e.current),r.useImperativeHandle(n,()=>e.current),r.useEffect(()=>(o({type:l.COLLECTION_ACTION.add,item:e}),()=>{o({type:l.COLLECTION_ACTION.remove,item:e})})),{slot:e,element:c}};exports.useSchedulerSlot=d;
