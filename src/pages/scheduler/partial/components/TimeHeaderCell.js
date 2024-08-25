/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("react"),d=require("@progress/kendo-react-intl"),f=require("@progress/kendo-react-common");function g(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const a in e)if(a!=="default"){const l=Object.getOwnPropertyDescriptor(e,a);Object.defineProperty(r,a,l.get?l:{enumerable:!0,get:()=>e[a]})}}return r.default=e,Object.freeze(r)}const t=g(i),s=t.forwardRef((e,r)=>{const{as:a=o.as,...l}=e,n=t.useRef(null),c=t.useRef(null),u=d.useInternationalization(),m=t.useMemo(()=>f.classNames("k-scheduler-cell k-heading-cell",e.className),[e.className]);return t.useImperativeHandle(c,()=>({element:n.current&&n.current.element?n.current.element:n.current,props:e})),t.useImperativeHandle(r,()=>c.current),t.createElement(a,{ref:a!==o.as?void 0:n,...l,className:m},u.formatDate(e.date,e.format?e.format:o.format))}),o={as:t.forwardRef(({as:e,format:r,start:a,end:l,...n},c)=>t.createElement("div",{...n,ref:c})),format:"t"};s.displayName="KendoReactSchedulerTimeHeaderCell";exports.TimeHeaderCell=s;exports.timeHeaderCellDefaultProps=o;
