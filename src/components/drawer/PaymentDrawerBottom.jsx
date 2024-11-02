import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {equalString, focus, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Flex, Typography, Button, Input, Card} from "antd";
import {CloseOutline, SearchOutline} from "antd-mobile-icons";
import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {SvgIcon} from "@progress/kendo-react-common";
import SVG from "../svg/SVG.jsx";
import {costDisplay} from "../../utils/CostUtils.jsx";
import {cx} from "antd-style";
import {setPage, toRoute} from "../../utils/RouteUtils.jsx";
import {ProfileRouteNames} from "../../routes/ProfileRoutes.jsx";
import {ModalClose} from "../../utils/ModalUtils.jsx";

const {Title, Text} = Typography;

const PaymentDrawerBottom = forwardRef(({
                                            showDrawer,
                                            closeDrawer,
                                            children,
                                            label,
                                            maxHeightVh = 60,
                                            paymentData ,
                                            fullHeight = false
                                        }, ref) => {
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const drawerOpenerAndClose = useRef(null);
    const [topBottomHeight, setTopBottomHeight] = useState('');
    const [startY, setStartY] = useState(null);

    useImperativeHandle(ref, () => ({
        setValue: (incValue) => {

        },
    }));

    useEffect(() => {
        if (toBoolean(paymentData?.show)){
            const footerHeight = footerRef.current ? footerRef.current.offsetHeight + (token.padding * 3) : 0;
            setTopBottomHeight(footerHeight);
        }
    }, [paymentData?.show, footerRef.current]);

    useEffect(() => {
        if (drawerOpenerAndClose){
            const handleMouseDown = (event) => {
                setStartY(event.clientY || event.touches[0].clientY);
            };

            const handleMouseMove = (event) => {
                if (startY === null) return;

                const currentY = event.clientY || event.touches[0].clientY;
                const deltaY = startY - currentY;

                if (!isDrawerOpen && deltaY > 30) {
                    setIsDrawerOpen(true);
                } else if (isDrawerOpen && deltaY < -30) {
                    setIsDrawerOpen(false);
                }
            };

            const handleMouseUp = () => setStartY(null);

            const openerElem = drawerOpenerAndClose.current;

            if (openerElem){
                openerElem.addEventListener('mousedown', handleMouseDown);
                openerElem.addEventListener('mousemove', handleMouseMove);
                openerElem.addEventListener('mouseup', handleMouseUp);
                openerElem.addEventListener('touchstart', handleMouseDown);
                openerElem.addEventListener('touchmove', handleMouseMove);
                openerElem.addEventListener('touchend', handleMouseUp);

                return () => {
                    openerElem.removeEventListener('mousedown', handleMouseDown);
                    openerElem.removeEventListener('mousemove', handleMouseMove);
                    openerElem.removeEventListener('mouseup', handleMouseUp);
                    openerElem.removeEventListener('touchstart', handleMouseDown);
                    openerElem.removeEventListener('touchmove', handleMouseMove);
                    openerElem.removeEventListener('touchend', handleMouseUp);
                };
            }
        }
    }, [isDrawerOpen, startY, paymentData]);

    return (
        <>
            {toBoolean(paymentData?.show) &&
               <div style={{height: `${topBottomHeight}px`}}>
                   <Popup
                       visible={true}
                       mask={isDrawerOpen}
                       onMaskClick={() => {setIsDrawerOpen(false)}}
                       onClose={() => {setIsDrawerOpen(false)}}
                       bodyStyle={{
                           height: toBoolean(fullHeight) ? '100%' : 'auto',
                           maxHeight: `${maxHeightVh}vh`,
                           display: 'flex',
                           flexDirection: 'column',
                           overflowY: 'auto',
                           boxShadow: token.boxShadow
                       }}
                   >
                       <PaddingBlock topBottom={true}>
                           <Flex justify={'center'} style={{position: "relative", paddingBottom: '10px'}}>
                               <div
                                   ref={drawerOpenerAndClose}
                                   style={{
                                       width: '40vw',
                                       height: '5px',
                                       backgroundColor: token.colorText,
                                       opacity: '0.3',
                                       borderRadius: '6px',
                                       position: 'absolute',
                                       top: '-8px',
                                       display: 'flex',
                                       justifyContent: 'center',
                                       cursor: 'pointer'
                                   }}
                               >
                                   {(!isDrawerOpen && 1 == 2) && (
                                       <div style={{marginTop: '-8px'}}>
                                           <SVG icon={'drawer-up'} size={14} color={token.colorText}/>
                                       </div>
                                   )}
                               </div>
                           </Flex>

                           {isDrawerOpen &&
                               <>
                                   {1 == 2 &&
                                       <div ref={headerRef} style={{padding: `${token.padding}px`}}>
                                           <Flex justify={'space-between'} align={'center'}>
                                               <Title level={4} style={{margin: 0}}>{label}</Title>
                                               <Button type="default" icon={<CloseOutline/>} size={'middle'}
                                                       onClick={() => setIsDrawerOpen(false)}/>
                                           </Flex>
                                       </div>
                                   }


                                   <div style={{ overflowY: 'auto', flex: '1'}}>
                                       <Flex vertical={true} gap={token.padding /2}>
                                           <Title level={4}>Payment Details</Title>

                                           <Card className={cx(globalStyles.card,globalStyles.cardSMPadding)} style={{marginTop: token.padding/2, marginBottom: token.padding/2}}>
                                               {paymentData.list.map((paymentListItem, index) => {
                                                   return (
                                                       <Flex key={index} vertical={true}>
                                                           <Text level={5} style={{color: token.colorTextSecondary}}>{paymentListItem.label}</Text>

                                                           {paymentListItem.items.map((paymentItem, paymentItemIndex) => {
                                                               return (
                                                                   <div key={paymentItemIndex}>
                                                                       <Flex align={'center'} justify={'space-between'} gap={2}>
                                                                           <Text><strong>{paymentItem.label}</strong></Text>
                                                                           <Text>{costDisplay(paymentItem.price)}</Text>
                                                                       </Flex>
                                                                   </div>
                                                               )
                                                           })}
                                                       </Flex>
                                                   )
                                               })}
                                           </Card>
                                       </Flex>
                                   </div>
                               </>
                           }

                           <div ref={footerRef} style={{position: 'sticky', bottom: 0, width: '100%'}}>
                               <Flex vertical={true} gap={token.padding}>
                                   <Flex align={'center'} justify={'space-between'}>
                                       <Title level={5}>Total Due</Title>

                                       <Flex align={'center'} gap={4} onClick={() => {
                                           if (toBoolean(paymentData?.requireOnlinePayment)) {
                                               ModalClose({
                                                   title: 'Payment Required',
                                                   content: `After registration you have ${isNullOrEmpty(paymentData?.holdTimeForReservation) ? '15' : paymentData?.holdTimeForReservation} minutes to pay before your registration will be canceled.`,
                                                   showIcon: false,
                                                   onOk: () => {

                                                   }
                                               });
                                           }
                                       }}>

                                           <Title level={5}>{costDisplay(paymentData?.totalDue)}</Title>
                                           {(toBoolean(paymentData?.requireOnlinePayment)) &&
                                               <div>
                                                   <SVG icon={'question-mark'} size={16} color={token.colorError} preventStroke={false}/>
                                               </div>
                                           }
                                       </Flex>
                                   </Flex>
                                   {children}
                               </Flex>
                           </div>
                       </PaddingBlock>
                   </Popup>
               </div>
            }

            {!toBoolean(paymentData?.show) &&
                <PaddingBlock topBottom={true}>
                    {children}
                </PaddingBlock>
            }
        </>
    )
})

export default PaymentDrawerBottom