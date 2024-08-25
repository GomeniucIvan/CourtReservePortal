/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const f=require("react"),s=require("../views/common/utils.js"),y=require("../constants/index.js");function b(t){const i=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t){for(const r in t)if(r!=="default"){const u=Object.getOwnPropertyDescriptor(t,r);Object.defineProperty(i,r,u.get?u:{enumerable:!0,get:()=>t[r]})}}return i.default=t,Object.freeze(i)}const g=b(f),h=t=>t.slice(1,t.length),d=(t,i)=>{const{element:r}=t,u=()=>{if(!r||!t.syncHeight)return;let c=[[]];Array.from(r.querySelectorAll(t.selector)).filter(e=>!e.classList.contains(h(t.applyTo))).forEach(e=>{const l=e.clientHeight,n=e.getAttribute(t.horizontalAttribute),o=e.getAttribute(t.verticalAttribute);n===null||o===null||(c[n]||(c[n]=[]),(!c[n][o]||l>c[n][o])&&(c[n][o]=l-y.BORDER_WIDTH))}),Array.from(r.querySelectorAll(t.applyTo)).forEach(e=>{const l=e.getAttribute(t.horizontalAttribute),n=e.getAttribute(t.verticalAttribute);if(l===null||n===null)return;const o=s.getPadding(e),a=c[l][n]-o;s.setRect(e,{height:a},!0)})};g.useEffect(u,i)};exports.useRowSync=d;
