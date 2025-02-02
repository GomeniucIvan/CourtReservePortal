import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
    return {
       base: css`
           .time_picker_container {
               position: relative;
           }

           .outside_container.active .modal_container {
               opacity: 1;
               z-index: 2;
               visibility: visible;
           }

           .time_picker_modal_header {
               height: 75px;
               line-height: 75px;
               text-align: center;
               margin-bottom: 30px;
               background-color: ${token.colorPrimary};
               color: ${token.colorOrgText};
               font-size: 36px;
               display: flex;
               justify-content: center;
               border-top-left-radius: ${token.borderRadius}px;
               border-top-right-radius: ${token.borderRadius}px;
               
               .time_picker_modal_header_centered {
                   position: relative;
                   .time_picker_header_meridiem_time {
                       font-size: 32px;
                       position: absolute;
                       
                       &.am {
                           top: -1px;
                           opacity: 1;
                       }
                       &.pm {
                           top: 32px;
                           opacity: 0.5;
                       }
                   }

                   .time_picker_header.meridiem {
                       position: absolute;
                       transition: top 2s ease 0s;

                       &.pm-selection {
                           top: -30px;

                           .am {
                               opacity: 0.5;
                           }
                           .pm {
                               opacity: 1;
                           }
                       }
                   }
               }
           }

           .picker_container {
               width: 260px;
               height: 260px;
               margin: 0 20px 20px;
               border-radius: 50%;
               background-color: ${token.colorBgContainerDisabled};
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
               background-color: ${token.colorPrimary};
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
               color: ${token.colorText};
               transform-origin: center 125px;
               -o-transform-origin: center 125px;
               -ms-transform-origin: center 125px;
               -moz-transform-origin: center 125px;
               -webkit-transform-origin: center 125px;
           }

           .picker_point.point_inner {
               top: 40px;
               color: ${token.colorText};
               opacity: 0.7;
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
               background-color: ${token.colorPrimary};
           }

           .picker_pointer {
               position: absolute;
               width: 4px;
               height: 110px;
               left: 50%;
               top: 20px;
               background-color: ${token.colorPrimary};
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
               background-color: ${token.colorPrimary};
               color: ${token.colorOrgText};
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
       `
    };
});