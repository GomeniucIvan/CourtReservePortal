﻿import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
       base: css`
           .time_picker_container {
               position: relative;
           }
           
           .react_times_button {
               user-select: none;
               position: relative;
               cursor: pointer;
               color: #343434;
               border-radius: 2px;
               background-color: #fff;
               transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -ms-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -moz-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -o-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -webkit-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               box-shadow: 2px 2px 15px 0 rgba(0, 0, 0, .15);
               -moz-box-shadow: 2px 2px 15px 0 rgba(0, 0, 0, .15);
               -webkit-box-shadow: 2px 2px 15px 0 rgba(0, 0, 0, .15);
           }

           .react_times_button.pressDown {
               box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
               -moz-box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
               -webkit-box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
           }

           .react_times_button.pressDown .wrapper {
               transform: translateY(1px);
           }

           .react_times_button .wrapper {
               transform: translateY(0);
               height: 100%;
           }

           .modal_container {
               user-select: none;
               cursor: default;
               //position: absolute;
               width: 100%;
               transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -ms-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -moz-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -o-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -webkit-transition: all 200ms cubic-bezier(0.165, 0.84, 0.44, 1);
               background-color: #fff;
               border-radius: 2px;
               top: 100%;
               left: 0;
               box-shadow: 4px 4px 30px 0 rgba(0, 0, 0, 0.2);
               -moz-box-shadow: 4px 4px 30px 0 rgba(0, 0, 0, 0.2);
               -webkit-box-shadow: 4px 4px 30px 0 rgba(0, 0, 0, 0.2);

               opacity: 0;
               z-index: -1;
               visibility: hidden;
               backface-visibility: hidden;
               transform: scale(0.7) translateY(20px);
               -ms-transform: scale(0.7) translateY(20px);
               -moz-transform: scale(0.7) translateY(20px);
               -o-transform: scale(0.7) translateY(20px);
               -webkit-transform: scale(0.7) translateY(20px);
           }

           .outside_container.active .modal_container {
               opacity: 1;
               z-index: 2;
               visibility: visible;
               transform: scale(1) translateY(20px);
               -ms-transform: scale(1) translateY(20px);
               -moz-transform: scale(1) translateY(20px);
               -o-transform: scale(1) translateY(20px);
               -webkit-transform: scale(1) translateY(20px);
           }

           .time_picker_modal_container {
           }

           .time_picker_modal_header,
           .time_picker_modal_footer,
           .timezone_picker_modal_header {
               height: 75px;
               line-height: 75px;
               text-align: center;
               margin-bottom: 30px;
               background-color: #3498db;
               color: #FFFFFF;
               font-size: 2.5em;
               border-radius: 2px 2px 0 0;
           }

           .timezone_picker_modal_header {
               line-height: initial;
           }

           .time_picker_header_delivery {
               opacity: 0.5;
           }
           .time_picker_modal_header .time_picker_header {
               cursor: pointer;
               opacity: 0.5;
               transition: opacity 0.3s;
           }
           .time_picker_modal_header .time_picker_header.active {
               cursor: default;
               opacity: 1;
           }
           .time_picker_modal_header .time_picker_header:hover {
               opacity: 1;
           }
           .time_picker_modal_header .time_picker_header.meridiem {
               font-size: 0.8em;
           }

           .time_picker_modal_footer {
               font-size: 1em;
               margin-bottom: 0;
           }

           .time_picker_modal_footer.clickable {
               cursor: pointer;
           }

           .picker_container {
               width: 260px;
               height: 260px;
               margin: 0 20px 20px;
               border-radius: 50%;
               background-color: #f0f0f0;
               position: relative;
           }

           .picker_pointer_container {
               opacity: 1;
               transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -ms-transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -moz-transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -o-transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -webkit-transition: all 300ms cubic-bezier(0.165, 0.84, 0.44, 1);
           }

           .picker_pointer_container.animation {
               opacity: 0;
               transform: scale3d(0.85, 0.85, 1);
               -o-transform: scale3d(0.85, 0.85, 1);
               -ms-transform: scale3d(0.85, 0.85, 1);
               -moz-transform: scale3d(0.85, 0.85, 1);
               -webkit-transform: scale3d(0.85, 0.85, 1);
           }

           .picker_center {
               position: absolute;
               top: 50%;
               left: 50%;
               width: 10px;
               height: 10px;
               border-radius: 50%;
               background-color: #3498db;
               transform: translate(-50%, -50%);
               -ms-transform: translate(-50%, -50%);
               -moz-transform: translate(-50%, -50%);
               -o-transform: translate(-50%, -50%);
               -webkit-transform: translate(-50%, -50%);
           }

           .picker_point {
               left: 50%;
               cursor: pointer;
               position: absolute;
               width: 30px;
               height: 30px;
               text-align: center;
               line-height: 30px;
               border-radius: 50%;
           }
           .picker_point.point_outter {
               top: 5px;
               color: #5d5d5d;
               transform-origin: center 125px;
               -o-transform-origin: center 125px;
               -ms-transform-origin: center 125px;
               -moz-transform-origin: center 125px;
               -webkit-transform-origin: center 125px;
           }

           .picker_point.point_inner {
               top: 40px;
               color: #a7a7a7;
               transform-origin: center 90px;
               -o-transform-origin: center 90px;
               -ms-transform-origin: center 90px;
               -moz-transform-origin: center 90px;
               -webkit-transform-origin: center 90px;
           }

           .picker_minute_point {
               left: 50%;
               cursor: pointer;
               position: absolute;
               top: 15px;
               color: #5d5d5d;
               transform-origin: center 115px;
               -o-transform-origin: center 115px;
               -ms-transform-origin: center 115px;
               -moz-transform-origin: center 115px;
               -webkit-transform-origin: center 115px;
               width: 2px;
               height: 2px;
               border-radius: 50%;
               background-color: #3498db;
           }

           .picker_pointer {
               position: absolute;
               width: 4px;
               height: 110px;
               left: 50%;
               top: 20px;
               background-color: #3498db;
               transform-origin: center bottom;
           }

           .picker_pointer.animation {
               transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -ms-transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -moz-transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -o-transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
               -webkit-transition: all 400ms cubic-bezier(0.165, 0.84, 0.44, 1);
           }

           .picker_pointer .pointer_drag {
               position: absolute;
               width: 35px;
               height: 35px;
               border-radius: 50%;
               top: -17.5px;
               left: -15.5px;
               background-color: #3498db;
               color: #fff;
               text-align: center;
               line-height: 35px;
           }

           .picker_pointer .pointer_drag.draggable {
               cursor: move;
           }

           .buttons_wrapper {
               float: right;
               margin-top: 5px;
           }

           .time_picker_button {
               padding: 5px 10px;
               background-color: transparent;
               display: inline-block;
               color: #949494;
               opacity: 0.6;
               transition: opacity 0.2s;
               box-shadow: none;
           }

           .time_picker_button:hover {
               opacity: 1;
           }

           .dark .time_picker_preview {
           }

           .dark .time_picker_preview .preview_container svg {
           }

           .dark .time_picker_preview.active {
           }

           .dark .time_picker_modal_container {
               background-color: #4a4a4a;
           }

           .dark .time_picker_modal_header,
           .dark .time_picker_modal_footer {
               background-color: #343434;
           }

           .dark .time_picker_modal_header .time_picker_header.active,
           .dark .time_picker_modal_header .time_picker_header:hover {
           }

           .dark .picker_container {
               background-color: #4a4a4a;
           }

           .dark .picker_container .picker_center,
           .dark .picker_container .picker_pointer,
           .dark .picker_container .picker_pointer .pointer_drag{
               background-color: #F4511E;
           }

           .dark .picker_minute_point,
           .dark .picker_point.point_outter {
               color: #fff;
           }

           .dark .picker_point.point_inner {
               color: #D0D0D0;
           }


           .timezone_picker_modal_container {
               user-select: none;
               cursor: default;
               position: absolute;
               z-index: 3;
               background-color: #fff;
               border-radius: 2px;
               top: 0;
               width: 100%;
               box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.08);
               -moz-box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.08);
               -webkit-box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.12), 0 0 4px 0 rgba(0, 0, 0, 0.08);
           }

           .timezone_picker_modal_container-enter {
               right: -100%;
               opacity: 0.5;
           }

           .timezone_picker_modal_container-enter.timezone_picker_modal_container-enter-active {
               right: 0;
               opacity: 1;
               transition: right 100ms ease-out, opacity 100ms ease-out;
               -ms-transition: right 100ms ease-out, opacity 100ms ease-out;
               -moz-transition: right 100ms ease-out, opacity 100ms ease-out;
               -o-transition: right 100ms ease-out, opacity 100ms ease-out;
               -webkit-transition: right 100ms ease-out, opacity 100ms ease-out;
           }

           .timezone_picker_modal_container-exit {
               right: 0;
               opacity: 1;
           }

           .timezone_picker_modal_container-exit.timezone_picker_modal_container-exit-active {
               right: -100%;
               opacity: 0.5;
               transition: right 100ms ease-in, opacity 100ms ease-in;
               -ms-transition: right 100ms ease-in, opacity 100ms ease-in;
               -moz-transition: right 100ms ease-in, opacity 100ms ease-in;
               -o-transition: right 100ms ease-in, opacity 100ms ease-in;
               -webkit-transition: right 100ms ease-in, opacity 100ms ease-in;
           }

           .timezone_picker_modal_header {
               font-size: 1em;
               position: relative;
               display: flex;
               flex-direction: row;
               justify-content: center;
               align-items: center;
           }

           .timezone_picker_header_title {
               flex: 1;
               text-align: left;
           }

           .timezone_picker_modal_header span.icon {
               height: 25px;
               width: 50px;
           }

           .timezone_picker_modal_header svg {
               width: 25px;
               height: 25px;
               fill: #fff;
               cursor: pointer;
           }

           .timezone_picker_container {
               min-width: 260px;
               min-height: 300px;
               display: flex;
               margin: 0 20px 20px;
               position: relative;
           }

           .timezone_picker_search {
               padding: 0 10px;
               position: relative;
               width: 100%;
           }

           .timezone_picker_search input {
               box-sizing: border-box;
               margin-bottom: 1%;
               padding: 10px 10px;
               width: 100%;
               height: 100%;

               font-size: 0.9rem;
               line-height: 2;
               border: none;
               border-bottom: 1px solid #adb5bd;
               outline: none;
               border-radius: 2px;
               transition: border .2s;
           }

           .timezone_picker_search input::-webkit-input-placeholder,
           .timezone_picker_search input::-moz-input-placeholder,
           .timezone_picker_search input:-ms-input-placeholder,
           .timezone_picker_search input:-moz-input-placeholder {
               color: #c6cace;
           }

           .timezone_picker_search .bootstrap-typeahead-input-main {
               color: #757575;
           }

           .timezone_picker_search input:focus {
               color: #4b4b4b;
               border-bottom: 1px solid #3498db;
           }

           /**
           * The react-bootstrap-typeahead library sort of assumes bootstrap is already in use for styling
           * so it refers to some bootstrap classes.  We don't need to use bootstrap just for a few classes so
           * the relevant styles have been copied here
           */
           .clearfix:before,
           .clearfix:after {
               display: table;
               content: " ";
           }
           .clearfix:after {
               clear: both;
           }

           .open > .dropdown-menu {
               display: block;
           }
           .open > a {
               outline: 0;
           }

           .dropdown-menu {
               position: absolute;
               top: 100%;
               left: 0;
               z-index: 1000;
               display: none;
               float: left;
               min-width: 160px;
               padding: 5px 0;
               margin: 2px 0 0;
               font-size: 14px;
               text-align: left;
               list-style: none;
               background-color: #fff;
               -webkit-background-clip: padding-box;
               background-clip: padding-box;
               border: 1px solid #ccc;
               border: 1px solid rgba(0, 0, 0, .15);
               border-radius: 4px;
               -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
               box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
           }

           .dropdown-menu > li > a {
               display: block;
               padding: 3px 20px;
               clear: both;
               font-weight: normal;
               line-height: 1.42857143;
               color: #333;
               white-space: nowrap;
           }
           .dropdown-menu > li > a:hover,
           .dropdown-menu > li > a:focus {
               color: #262626;
               text-decoration: none;
               background-color: #f5f5f5;
           }
           .dropdown-menu > .active > a,
           .dropdown-menu > .active > a:hover,
           .dropdown-menu > .active > a:focus {
               color: #fff;
               text-decoration: none;
               background-color: #337ab7;
               outline: 0;
           }
           .dropdown-menu > .disabled > a,
           .dropdown-menu > .disabled > a:hover,
           .dropdown-menu > .disabled > a:focus {
               color: #777;
           }
           .dropdown-menu > .disabled > a:hover,
           .dropdown-menu > .disabled > a:focus {
               text-decoration: none;
               cursor: not-allowed;
               background-color: transparent;
               background-image: none;
               filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);
           }

       `
    };
});