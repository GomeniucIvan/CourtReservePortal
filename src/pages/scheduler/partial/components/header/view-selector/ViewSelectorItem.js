/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const a=require("react"),u=require("@progress/kendo-react-buttons"),r=require("@progress/kendo-react-intl"),s=require("../../../context/SchedulerContext.js");function m(e){const n=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const c=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,c.get?c:{enumerable:!0,get:()=>e[t]})}}return n.default=e,Object.freeze(n)}const i=m(a),b=e=>{const[n,t]=s.useSchedulerActiveViewContext(),c=r.useLocalization(),o=i.useMemo(()=>typeof e.view.title=="function"?e.view.title.call(void 0,c):e.view.title,[e.view.title,c]),l=i.useCallback(()=>{e.view.name&&t(e.view.name)},[t,e.view.name]);return i.createElement(u.Button,{className:"k-toolbar-button",role:"button",type:"button",tabIndex:-1,togglable:!0,selected:e.view.name===n,onClick:l},o)};exports.ViewSelectorItem=b;