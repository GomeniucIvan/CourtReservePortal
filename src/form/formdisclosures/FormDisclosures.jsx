import {Button, Checkbox, Descriptions, Divider, Flex, Radio, Skeleton, Typography} from 'antd';
import {
    anyInList,
    equalString,
    focus,
    isNullOrEmpty,
    toBoolean
} from "../../utils/Utils.jsx";
import {cx} from "antd-style";
import {useApp} from "../../context/AppProvider.jsx";
import React, {useEffect, useRef, useState} from "react";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import SVG from "@/components/svg/SVG.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Title, Text} = Typography;
import {useStyles} from "./styles.jsx";
import Modal from "@/components/modal/Modal.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import DisclosureBlock from "@/components/disclosureBlock/DisclosureBlock.jsx";

const FormDisclosures = ({ formik, disclosureHtml, dateTimeDisplay }) => {
    const [showCheckboxModal, setShowCheckboxModal] = useState(false);
    const {token} = useApp();
    const {styles} = useStyles();

    const displayCheckboxDescriptionWithStatus = () => {
        let status = <Text>Please review and agree to this organization's terms of use.</Text>;

        if (toBoolean(formik?.values?.disclosureAgree)) {
            status = <Flex gap={token.paddingSM}><SVG icon='circle-check' preventFill={true} /> Completed</Flex>;
        }
        else if (!isNullOrEmpty(formik?.values?.disclosureAgreeErrorStatus)) {
            status = <Flex gap={token.paddingSM} style={{color: token.colorError}}><SVG icon='alert-triangle' preventFill={true} /> Please review and agree to this organization's Terms of Use.</Flex>;
        }

        return status;
    }

    const displayWaiverDescriptionWithStatus = (item, itemHasError) => {
        let status = <Text>Please review and sign this Membership Agreement.</Text>

        if (equalString(item.Status, 'Success') || (!isNullOrEmpty(item.SignatureDataUrl) && toBoolean(item.AcceptAgreement))) {
            status = <Flex gap={token.paddingSM}><SVG icon='circle-check' preventFill={true} /> Completed</Flex>;
        }
        else if (equalString(item.Status, 'error') || itemHasError) {
            status = <Flex gap={token.paddingSM} style={{color: token.colorError}}><SVG icon='alert-triangle' preventFill={true} /> Please review and sign this Membership Agreement.</Flex>;
        }

        return status;
    }

    const isErrorCheckbox = !isNullOrEmpty(formik?.values?.disclosureAgreeErrorStatus) && !toBoolean(formik?.values?.disclosureAgree);
    
    return (
        <>
            <Flex vertical={true} gap={token.paddingXXL}>
                <Title level={1}>Agreements</Title>

                {(!isNullOrEmpty(disclosureHtml) || (anyInList(formik?.values?.disclosures))) &&
                    <Flex vertical={true} gap={token.padding}>
                        {!isNullOrEmpty(disclosureHtml) &&
                            <Flex vertical={true} gap={20} className={cx(styles.disclosureBlock,isErrorCheckbox && styles.errorBlock ) }>
                                <Flex vertical={true} gap={4}>
                                    <Title level={3}>Disclosure <Text style={{color: token.colorError}}>*</Text></Title>

                                    {displayCheckboxDescriptionWithStatus()}
                                </Flex>

                                <Button onClick={() => {setShowCheckboxModal(true)}} block={true}>
                                    Review & Agree
                                </Button>

                                <Modal show={showCheckboxModal}
                                       onClose={() => {setShowCheckboxModal(false)}}
                                       customFooter={<PaddingBlock topBottom={true}>
                                           <Flex vertical={true} gap={8}>
                                               <Flex vertical={true} gap={4}>
                                                   <FormSwitch formik={formik} name={'disclosureAgree'} label={'I have read and agreed to the Terms and Conditions above'} rows={2} />
                                               </Flex>
                                               <Button type={'primary'} onClick={() => {
                                                   if (toBoolean(formik?.values?.disclosureAgree)) {
                                                       setShowCheckboxModal(false)
                                                   } else {
                                                       displayMessageModal({
                                                           title: 'Error',
                                                           html: (onClose) => 'Please review the Agreements section.',
                                                           type: "warning",
                                                           buttonType: modalButtonType.DEFAULT_CLOSE,
                                                           onClose: () => {

                                                           },
                                                       })
                                                   }
                                               }} block={true}>
                                                   Confirm
                                               </Button>
                                           </Flex>
                                       </PaddingBlock>}
                                       title={'Terms and Conditions'}>

                                    <PaddingBlock>
                                        <IframeContent content={disclosureHtml} id={'login-disclosure'}/>
                                    </PaddingBlock>
                                </Modal>
                            </Flex>
                        }
                    </Flex>
                }

                {(anyInList(formik?.values?.disclosures)) &&
                    <Flex vertical={true} gap={token.padding}>
                        <>
                            {(anyInList(formik?.values?.disclosures)) &&
                                <>
                                    {formik?.values?.disclosures.map((disclosure, index) => {
                                        let isSignedWaiver = toBoolean(disclosure.AcceptAgreement) && !isNullOrEmpty(disclosure.SignatureDataUrl);
                                        let isErrorState = !isSignedWaiver && equalString(disclosure?.Status, 'error');
                                        
                                        let memberFullName = `${formik?.values?.firstName} ${formik?.values?.lastName}`;

                                        return (
                                            <Flex vertical={true} gap={20} className={cx(styles.disclosureBlock, isErrorState && styles.errorBlock)} key={index}>
                                                <Flex vertical={true} gap={4}>
                                                    <Title level={3}>Membership Agreement: {disclosure?.Name} <Text style={{color: token.colorError}}>*</Text></Title>
                                                    {displayWaiverDescriptionWithStatus(disclosure)}
                                                </Flex>


                                                <DisclosureBlock memberFullName={memberFullName}
                                                                 disclosure={disclosure}
                                                                 dateTimeDisplay={dateTimeDisplay}
                                                                 formik={formik}
                                                                 onSign={(dataUrl) => {
                                                                     formik.setFieldValue(
                                                                         `disclosures[${index}].SignatureDataUrl`,
                                                                         dataUrl
                                                                     );
                                                                 }}
                                                                 onClear={() => {
                                                                     formik.setFieldValue(
                                                                         `disclosures[${index}].SignatureDataUrl`,
                                                                         ''
                                                                     );
                                                                 }}
                                                                 onAcceptAgreementChange={(e) => {
                                                                     formik.setFieldValue(
                                                                         `disclosures[${index}].AcceptAgreement`,
                                                                         toBoolean(e)
                                                                     );
                                                                 }}

                                                />
                                            </Flex>
                                        )
                                    })}
                                </>
                            }
                        </>
                    </Flex>
                }
            </Flex>
        </>
    );
};


export default FormDisclosures;