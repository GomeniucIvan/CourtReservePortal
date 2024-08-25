/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const l=require("react"),o=require("@progress/kendo-react-common"),i=require("../context/SchedulerViewContext.js");function m(e){const u=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const r in e)if(r!=="default"){const c=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(u,r,c.get?c:{enumerable:!0,get:()=>e[r]})}}return u.default=e,Object.freeze(u)}const n=m(l),d=(e,u)=>{const{_ref:r,itemRef:c}=e,t=n.useRef(null),s=n.useRef(null),[,a]=i.useSchedulerViewItemsContext();return n.useImperativeHandle(t,()=>({element:s.current,props:e})),n.useImperativeHandle(u,()=>t.current),n.useImperativeHandle(r,()=>t.current),n.useImperativeHandle(c,()=>t.current),o.useIsomorphicLayoutEffect(()=>(a({type:o.COLLECTION_ACTION.add,item:t}),()=>{a({type:o.COLLECTION_ACTION.remove,item:t})})),{item:t,element:s}};exports.useSchedulerItem=d;
