/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const a=require("react"),u=require("@progress/kendo-react-buttons"),l=require("@progress/kendo-react-common");function i(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const r=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,r.get?r:{enumerable:!0,get:()=>e[t]})}}return n.default=e,Object.freeze(n)}const c=i(a),f=c.forwardRef((e,n)=>{const{className:t,...r}=e,o=c.useRef(null);return c.useImperativeHandle(n,()=>({element:o.current,props:e})),c.createElement(u.ToolbarItem,{ref:s=>{s&&(o.current=s.element)},className:l.classNames("k-scheduler-navigation",t),...r},e.children)});exports.BusinessHours=f;
