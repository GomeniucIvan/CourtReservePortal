/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const b=require("react"),f=require("@progress/kendo-data-query"),g=require("@progress/kendo-react-dropdowns");function m(e){const o=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(o,t,n.get?n:{enumerable:!0,get:()=>e[t]})}}return o.default=e,Object.freeze(o)}const a=m(b),C=e=>{const{onChange:o,data:t,validationMessage:n,visited:p,touched:y,modified:h,...c}=e,[l,i]=a.useState(t),s=a.useCallback(r=>o(r),[o]),u=a.useCallback(r=>{const d=f.filterBy(t||[],r.filter);i(d)},[]);return a.createElement(g.ComboBox,{style:{width:"100%"},data:l,filterable:!0,onFilterChange:u,onChange:s,...c})};exports.FilterableComboBox=C;
