import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {anyInList, equalString, isNullOrEmpty, oneListItem, toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Divider, Flex, QRCode, Typography} from "antd";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import Modal from "../modal/Modal.jsx";
import {useStyles} from "./styles.jsx";
import Barcode from "react-barcode";
import DrawerBottom from "./DrawerBottom.jsx";
import FormDrawerRadio from "../../form/formradio/FormDrawerRadio.jsx";

const {Title} = Typography;

const DrawerBarcode = forwardRef(({familyList = [], format}, ref) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const [barcode, setBarcode] = useState(null);
    const {styles} = useStyles();
    const { token, globalStyles } = useApp();

    if (!anyInList(familyList)){
        return '';
    }

    useImperativeHandle(ref, () => ({
        open: () => {
            if (oneListItem(familyList)){
                setBarcode(familyList[0]);
            } else{
                setShowDrawer(true);
            }
        }
    }));

    return (
        <>
            <Modal show={!isNullOrEmpty(barcode)}
                   onClose={() => {setBarcode(null)}}
                   showConfirmButton={false}
                   title={oneListItem(familyList) ? '' : barcode?.FullName}>
                <Flex align={'center'} justify={'center'} className={styles.barcodeWrapper}>

                    {!isNullOrEmpty(barcode?.MembershipNumber) &&
                        <>
                            {(isNullOrEmpty(format) || equalString(format, 1)) &&
                                <div>
                                    <Barcode value={barcode?.MembershipNumber} displayValue={false} height={120} width={4} />
                                </div>
                            }

                            {equalString(format,2) &&
                                <QRCode value={barcode?.MembershipNumber} size={260} />
                            }
                        </>
                    }
                </Flex>
            </Modal>

            <DrawerBottom
                showDrawer={toBoolean(showDrawer)}
                closeDrawer={() => {setShowDrawer(false)}}
                label={'Family Members'}
                showButton={false}
                confirmButtonText={'Close'}
                onConfirmButtonClick={() => {setShowDrawer(false)}}
            >
                <Flex vertical>
                    <>
                        {anyInList(familyList) &&
                            <>
                                {familyList.map((familyMember, index) => {
                                    let isLastItem = index === familyList.length - 1;

                                    return (
                                        <div key={familyMember.OrgMemberId} onClick={() => {
                                            setShowDrawer(false);
                                            setBarcode(familyMember);
                                        }}>
                                            <PaddingBlock>
                                                <Flex className={globalStyles.drawerRow}>
                                                    <Title level={1}>
                                                        {familyMember.FullName}
                                                    </Title>
                                                </Flex>
                                            </PaddingBlock>
                                            {!isLastItem &&
                                                <Divider className={globalStyles.noMargin}/>
                                            }
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </>
                </Flex>
            </DrawerBottom>
        </>
    )
})

export default DrawerBarcode