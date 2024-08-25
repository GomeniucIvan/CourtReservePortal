/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const d=require("react"),i=require("@progress/kendo-react-common"),m=require("@progress/kendo-react-buttons");function f(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const c=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,c.get?c:{enumerable:!0,get:()=>e[t]})}}return n.default=e,Object.freeze(n)}const r=f(d),u=r.forwardRef((e,n)=>{const{className:t,...c}=e,a=r.useRef(null),o=r.useRef(null);r.useImperativeHandle(o,()=>({element:a.current,props:e})),r.useImperativeHandle(n,()=>o.current);const s=r.useMemo(()=>i.classNames("k-scheduler-toolbar",t),[t]);return r.createElement(m.Toolbar,{id:e.id,ref:l=>{l&&(a.current=l.element)},className:s,...c},e.children)});u.displayName="KendoReactSchedulerHeader";exports.SchedulerHeader=u;
