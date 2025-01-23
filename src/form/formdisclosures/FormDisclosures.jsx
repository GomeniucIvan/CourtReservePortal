import {Button, Checkbox, Descriptions, Divider, Flex, Radio, Skeleton, Typography} from 'antd';
import {anyInList, calculateSkeletonLabelWidth, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormInput from "../input/FormInput.jsx";
import FormTextArea from "../formtextarea/FormTextArea.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {cx} from "antd-style";
import {useApp} from "../../context/AppProvider.jsx";
import React, {useEffect, useRef, useState} from "react";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import SVG from "@/components/svg/SVG.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Title, Text} = Typography;
import {useStyles} from "./styles.jsx";
import Modal from "@/components/modal/Modal.jsx";
import {isCanadaCulture} from "@/utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "@/utils/DateUtils.jsx";
import ReCAPTCHA from "react-google-recaptcha";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";

const FormDisclosures = ({ formik, disclosureHtml, dateTimeDisplay }) => {
    const [showCheckboxModal, setShowCheckboxModal] = useState(false);
    const [agreementIndexToShow, setAgreementIndexToShow] = useState(null);
    const [checkboxError, setCheckboxError] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const sigCanvasRef = useRef(null);
    const {token} = useApp();
    const {styles} = useStyles();
    
    useEffect(() => {
        if (toBoolean(formik?.values?.disclosureAgree)) {
            setCheckboxError('');
        }

    }, [formik?.values?.disclosureAgree])

    const displayCheckboxDescriptionWithStatus = (itemHasError) => {
        let status = <Text>Please review and agree to this organization's terms of use.</Text>;

        if (toBoolean(formik?.values?.disclosureAgree)) {
            status = <Text><SVG icon='fa-solid fa-circle-check' style={{ color: '#389E0D', fontSize: '16px' }} /> Completed</Text>;
        }
        else if (!isNullOrEmpty(formik?.values?.disclosureAgreeErrorStatus)) {
            status = <Text style={{color: token.colorError}}><SVG icon='fa-solid fa-triangle-exclamation' style={{ fontSize: '16px' }} /> Please review and agree to this organization's Terms of Use.</Text>;
        }

        return status;
    }

    const displayWaiverDescriptionWithStatus = (item, itemHasError) => {
        let status = <Text>Please review and sign this Membership Agreement.</Text>

        if (equalString(item.Status, 'Success') || (!isNullOrEmpty(item.SignatureDataUrl) && toBoolean(item.AcceptAgreement))) {
            status = <Text><SVG icon='fa-solid fa-circle-check' style={{ color: '#389E0D', fontSize: '16px' }} /> Completed</Text>;
        }
        else if (equalString(item.Status, 'error') || itemHasError) {
            status = <Text style={{color: token.colorError}}><SVG icon='fa-solid fa-triangle-exclamation' style={{ fontSize: '16px' }} /> Please review and sign this Membership Agreement.</Text>;
        }

        return status;
    }

    return (
        <>
            {(!isNullOrEmpty(disclosureHtml) || (anyInList(formik?.values?.disclosures))) &&
                <Flex vertical={true} gap={token.paddingXXL}>

                    <Title level={1}>Agreements</Title>
                    
                    <Flex vertical={true} gap={token.padding}>
                        {!isNullOrEmpty(disclosureHtml) &&
                            <Flex vertical={true} gap={20} className={styles.disclosureCard}>
                                <Flex vertical={true} gap={4}>
                                    <Title level={3}>Disclosure <Text style={{color: token.colorError}}>*</Text></Title>

                                    {displayCheckboxDescriptionWithStatus()}
                                </Flex>

                                <Button onClick={() => {setShowCheckboxModal(true)}} block={true}>
                                    Review & Agree
                                </Button>

                                <Modal show={showCheckboxModal}
                                       onClose={() => {setShowCheckboxModal(false)}}
                                       customFooter={<Flex vertical={true} gap={8}>
                                           <FormSwitch formik={formik} name={'disclosureAgree'} label={'I have read and agreed to the Terms and Conditions above'} rows={2} />
                                           
                                           <Button type={'primary'} onClick={() => {setShowCheckboxModal(false)}} block={true}>
                                               Confirm
                                           </Button>
                                       </Flex>}
                                       title={'Terms and Conditions'}>

                                    <IframeContent content={disclosureHtml} id={'login-disclosure'}/>
                                </Modal>
                            </Flex>
                        }

                        {(anyInList(formik?.values?.disclosures)) &&
                            <>
                                {formik?.values?.disclosures.map((disclosure, index) => {
                                    let isSignedWaiver = toBoolean(disclosure.AcceptAgreement) && !isNullOrEmpty(disclosure.SignatureDataUrl);
                                    let memberFullName = `${formik?.values?.signFirstName} ${formik?.values?.signLastName}`;
                                    let isErrorState = !isSignedWaiver && equalString(disclosure?.Status, 'error');


                                    return (
                                        <Flex vertical={true} gap={20} className={styles.disclosureCard}>
                                            <Flex vertical={true} gap={4}>
                                                <Title level={3}>Membership Agreement: {disclosure?.Name} <Text style={{color: token.colorError}}>*</Text></Title>
                                                {displayWaiverDescriptionWithStatus(disclosure)}
                                            </Flex>

                                            <Flex gap={16}>
                                                <Button htmlType='button'
                                                        icon={<SVG icon='fa-regular fa-file-lines' />}>
                                                    Review Membership Agreement
                                                </Button>

                                                <Button onClick={() => {setAgreementIndexToShow(index)}} block={true}>
                                                    Review
                                                </Button>
                                            </Flex>

                                            <DrawerBottom showDrawer={equalString(agreementIndexToShow, index)}
                                                          maxHeightVh={60}
                                                          customFooter={<Flex>
                                                              {!isNullOrEmpty(disclosure.ReadAgreementMessage) &&
                                                                  <Checkbox checked={toBoolean(disclosure.AcceptAgreement)}
                                                                            onChange={(e) => {
                                                                                formik.setFieldValue(`disclosures[${index}].AcceptAgreement`, e.target.checked)
                                                                            }}>
                                                                      <>By signing I agree to the terms and conditions of this Membership Agreement <Text>*</Text></>
                                                                  </Checkbox>
                                                              }
                                                          </Flex>}
                                                          label={'Terms and Conditions'}>
                                                {!isNullOrEmpty(disclosure?.RuleInstructions) &&
                                                    <Text>
                                                        <div dangerouslySetInnerHTML={{__html: disclosure?.RuleInstructions}}/>
                                                    </Text>
                                                }
                                            </DrawerBottom>
                                        </Flex>
                                    )
                                })}
                            </>
                        }
                    </Flex>
                </Flex>
            }

        </>
    );
};


export default FormDisclosures;