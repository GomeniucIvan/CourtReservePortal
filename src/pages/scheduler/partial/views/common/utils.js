/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=(t,e=0,o=0,n=[])=>{if(t.length<=e)return[n];let i=[];return t[e].data.map(f=>{i.push(...s(t,e+1,o+1,[...n,{...f,field:t[e].field,valueField:t[e].valueField,colorField:t[e].colorField,multiple:t[e].multiple}]))}),i};function l(t,e){const o=[];if(!e||!e.length)return o;if(t&&t.resources&&t.resources.length){const n=t.resources;for(let i=0;i<n.length;i++){const f=e.find(h=>h.name===n[i]);o.push(f)}}return o}const a=(t,e=t.length-1)=>{const o=Math.max(0,e),n=[];t&&t.length||(t=[{}]);const i=(t[o].data||[]).map(d=>({...d,text:d[t[o].textField]}))||[],f=i.length;let h=1;for(let d=0;d<=o;d++)h*=(t[d].data||[]).length||1;for(let d=0;d<h;d++)i[d%f]&&n.push(i[d%f]);return n},g=t=>{if(!t)return{top:0,left:0,width:0,height:0,right:0};const e=t.offsetTop,o=t.offsetLeft,n=t.offsetParent?t.offsetParent.offsetWidth-(t.offsetLeft+t.offsetWidth):0,i=t.offsetWidth,f=t.offsetHeight;return{top:e,left:o,right:n,width:i,height:f}},p=(t,e=!1)=>parseFloat(window.getComputedStyle(t)[e?"paddingLeft":"paddingTop"]||"0")+parseFloat(window.getComputedStyle(t)[e?"paddingRight":"paddingBottom"]||"0"),u=(t,e=!1)=>parseFloat(window.getComputedStyle(t)[e?"borderLeftWidth":"borderTopWidth"]||"0")+parseFloat(window.getComputedStyle(t)[e?"borderRightWidth":"borderBottomWidth"]||"0"),r=(t,e,o=!1)=>{t&&(e.top!==void 0&&(t.style.top=`${e.top}px`),e.left!==void 0&&(t.style.left=`${e.left}px`),e.width!==void 0&&(t.style.width=`${e.width}px`),e.height!==void 0&&!o&&(t.style.height=typeof e.height=="number"?`${e.height}px`:e.height),o&&(t.style.minHeight=e.height!==void 0&&e.height>0?`${e.height}px`:""))};exports.expandResources=a;exports.getBorders=u;exports.getPadding=p;exports.getRect=g;exports.setRect=r;exports.toFlatGroupResources=s;exports.toGroupResources=l;
