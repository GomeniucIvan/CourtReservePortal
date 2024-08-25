/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const d=require("react"),f=require("./SchedulerTask.js");function k(e){const a=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const r in e)if(r!=="default"){const s=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(a,r,s.get?s:{enumerable:!0,get:()=>e[r]})}}return a.default=e,Object.freeze(a)}const t=k(d),u=t.forwardRef((e,a)=>{const{task:r,_ref:s,...o}=e,n=t.useRef(null),c=t.useRef(null);t.useImperativeHandle(c,()=>({props:e,element:n.current&&n.current.element})),t.useImperativeHandle(s,()=>n.current),t.useImperativeHandle(a,()=>c.current);const i=r||l.task;return t.createElement(i,{...o,_ref:n})}),l={task:f.SchedulerTask};u.displayName="KendoReactSchedulerViewTask";exports.SchedulerViewTask=u;exports.schedulerViewTaskDefaultProps=l;
