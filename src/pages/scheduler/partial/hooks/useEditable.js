/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("react"),d=require("../context/SchedulerContext.js");function l(t){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(t){for(const e in t)if(e!=="default"){const o=Object.getOwnPropertyDescriptor(t,e);Object.defineProperty(r,e,o.get?o:{enumerable:!0,get:()=>t[e]})}}return r.default=t,Object.freeze(r)}const f=l(i),v=t=>{const r=f.useContext(d.SchedulerPropsContext),e=t!==void 0?t:r.editable||!1,o=e===!0||e!==void 0&&e!==!1&&e.edit===!0,s=e===!0||e!==void 0&&e!==!1&&e.resize===!0,n=e===!0||e!==void 0&&e!==!1&&e.remove===!0,c=e===!0||e!==void 0&&e!==!1&&e.drag===!0,u=e===!0||e!==void 0&&e!==!1&&e.add===!0,a=e===!0||e!==void 0&&e!==!1&&e.select===!0;return{add:u,edit:o,drag:c,remove:n,resize:s,select:a}};exports.useEditable=v;