/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const m=require("react"),i=require("@progress/kendo-react-common"),f=require("@progress/kendo-react-buttons");function d(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const r in e)if(r!=="default"){const o=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(n,r,o.get?o:{enumerable:!0,get:()=>e[r]})}}return n.default=e,Object.freeze(n)}const t=d(m),b=t.forwardRef((e,n)=>{const{className:r,style:o,...l}=e,c=t.useRef(null),a=t.useRef(null);t.useImperativeHandle(c,()=>({element:a.current,props:e})),t.useImperativeHandle(n,()=>c.current);const u=t.useMemo(()=>i.classNames("k-scheduler-footer",e.className),[e.className]);return t.createElement(f.Toolbar,{ref:s=>{s&&(a.current=s.element)},className:u,style:{boxShadow:"none",...o},...l},e.children)});exports.SchedulerFooter=b;
