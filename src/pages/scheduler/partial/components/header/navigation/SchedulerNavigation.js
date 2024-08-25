/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const u=require("react"),s=require("@progress/kendo-react-buttons"),i=require("@progress/kendo-react-common");function d(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,r.get?r:{enumerable:!0,get:()=>e[t]})}}return n.default=e,Object.freeze(n)}const c=d(u),l=c.forwardRef((e,n)=>{const{className:t,...r}=e,a=c.useRef(null);return c.useImperativeHandle(n,()=>({element:a.current,props:e})),c.createElement(s.ToolbarItem,{ref:o=>{o&&(a.current=o.element)},className:i.classNames(t),...r},e.children)});l.displayName="KendoReactSchedulerSchedulerNavigation";exports.SchedulerNavigation=l;
