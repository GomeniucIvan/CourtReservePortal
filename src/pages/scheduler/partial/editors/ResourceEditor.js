/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),r=require("@progress/kendo-react-dropdowns"),g=require("../utils/index.js");function v(e){const c=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const n in e)if(n!=="default"){const d=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(c,n,d.get?d:{enumerable:!0,get:()=>e[n]})}}return c.default=e,Object.freeze(c)}const l=v(s),F=e=>{const c=e.multiple?r.MultiSelect:r.DropDownList,n=l.useCallback(t=>{const a=t.target.props.dataItemKey,i=e.multiple?(t.target.value||[]).map(m=>m[a]):t.target.value[a];e.onChange.call(void 0,{value:i})},[e.multiple,e.onChange]),d=l.useCallback((t,a)=>{const i=l.createElement(l.Fragment,null,e.colorField&&l.createElement("span",{key:1,className:"k-scheduler-mark",style:{backgroundColor:a.dataItem[e.colorField],marginRight:g.isPresent(a.dataItem[e.valueField])?"8px":"4px"}}," "),l.createElement("span",{key:2},"  ",t.props.children));return l.cloneElement(t,{...t.props},i)},[e.colorField,e.valueField]),u=l.useCallback((t,a)=>{const i=l.createElement(l.Fragment,null,e.colorField&&a&&l.createElement("span",{key:1,className:"k-scheduler-mark",style:{backgroundColor:a[e.colorField],marginRight:a[e.valueField]?"8px":"4px"}}," "),t.props.children);return l.cloneElement(t,{},i)},[e.colorField,e.valueField]),o=Array.isArray(e.value)?e.data.filter(t=>e.value.some(a=>t[e.valueField]===a)):e.data.find(t=>t[e.valueField]===e.value);return l.createElement(c,{value:o,onChange:n,data:e.data,textField:e.textField,dataItemKey:e.valueField,valid:e.valid,validationMessage:e.validationMessage,itemRender:d,valueRender:u})};exports.ResourceEditor=F;