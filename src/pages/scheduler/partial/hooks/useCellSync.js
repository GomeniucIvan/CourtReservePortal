/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const f=require("../views/common/utils.js"),h=require("@progress/kendo-react-common"),p=(e,b)=>{const{element:u}=e,g=()=>{if(!u||!u.current)return;let r=[],o=[],c=[];const l=u.current.querySelectorAll(e.selector);l.forEach(i=>{const n=i.getBoundingClientRect().width,t=e.explicitDepth&&e.attribute!==void 0?i.getAttribute(e.attribute):0,s=f.getPadding(i,!0),d=f.getBorders(i,!0);t!==null&&((!c[t]||d>c[t])&&(c[t]=d),(!o[t]||s>o[t])&&(o[t]=s),(!r[t]||n>r[t])&&(r[t]=n))}),l.forEach(i=>{const n=e.explicitDepth?i.getAttribute(e.attribute):0;n!==null&&(i.style.minWidth=`${r[n]-o[n]-c[n]}px`)})};h.useIsomorphicLayoutEffect(g,b)};exports.useCellSync=p;
