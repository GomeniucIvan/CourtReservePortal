/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const S=require("react"),f=require("./SchedulerSlot.js"),p=require("../hooks/useSlotExpand.js");function b(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const l in e)if(l!=="default"){const o=Object.getOwnPropertyDescriptor(e,l);Object.defineProperty(r,l,o.get?o:{enumerable:!0,get:()=>e[l]})}}return r.default=e,Object.freeze(r)}const t=b(S),s=t.forwardRef((e,r)=>{var a;const{slot:l,_ref:o,...d}=e,i=l||c.slot,u=t.useRef(null),n=t.useRef(null);return t.useImperativeHandle(u,()=>({props:e})),t.useImperativeHandle(o,()=>n.current),t.useImperativeHandle(r,()=>u.current),p.useSlotExpand(n,(a=e.expandable)!=null?a:c.expandable),t.createElement(i,{...d,_ref:n})}),c={slot:f.SchedulerSlot,expandable:!1};s.displayName="KendoReactSchedulerViewSlot";exports.SchedulerViewSlot=s;exports.schedulerViewSlotDefaultProps=c;
