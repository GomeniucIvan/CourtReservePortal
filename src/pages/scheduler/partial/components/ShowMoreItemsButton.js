/**
 * @license
 *-------------------------------------------------------------------------------------------
 * Copyright © 2024 Progress Software Corporation. All rights reserved.
 * Licensed under commercial license. See LICENSE.md in the package root for more information
 *-------------------------------------------------------------------------------------------
 */
"use client";"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const m=require("react"),d=require("@progress/kendo-react-buttons"),f=require("@progress/kendo-react-intl"),c=require("../messages/index.js"),g=require("@progress/kendo-svg-icons");function b(e){const r=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(e){for(const t in e)if(t!=="default"){const o=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,o.get?o:{enumerable:!0,get:()=>e[t]})}}return r.default=e,Object.freeze(r)}const n=b(m),a=n.forwardRef((e,r)=>{const t=n.useRef(null),o=n.useRef(null),l=f.useLocalization();n.useImperativeHandle(t,()=>({element:o.current&&o.current.element,...e})),n.useImperativeHandle(r,()=>t.current);const u=n.useCallback(i=>{!e.onClick||!t.current||e.onClick.call(void 0,{target:t.current,syntheticEvent:i})},[t,e.slot,e.onClick]),s=l.toLanguageString(c.moreEvents,c.messages[c.moreEvents]);return n.createElement(d.Button,{ref:o,tabIndex:-1,className:"k-more-events",onClick:u,"aria-label":s,icon:"more-horizontal",svgIcon:g.moreHorizontalIcon})});a.displayName="KendoReactSchedulerShowMoreItemsButton";exports.ShowMoreItemsButton=a;
