import {Button, Checkbox, Flex, Radio, Skeleton, Typography} from 'antd';
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
const {Title} = Typography;

const FormDisclosures = ({ formik, disclosureHtml, dateTimeDisplay }) => {
    const [showCheckboxModal, setShowCheckboxModal] = useState(false);
    const [agreementIndexToShow, setAgreementIndexToShow] = useState(null);
    const [checkboxError, setCheckboxError] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const sigCanvasRef = useRef(null);

    useEffect(() => {
        if (toBoolean(formik?.values?.disclosureAgree)) {
            setCheckboxError('');
        }

    }, [formik?.values?.disclosureAgree])

    const displayCheckboxDescriptionWithStatus = (itemHasError) => {
        let status = <Text className={styles.descriptionDefault}>Please review and agree to this organization's terms of use.</Text>;

        if (toBoolean(formik?.values?.disclosureAgree)) {
            status = <Text className={styles.descriptionDefault}><HtmlFontAwesomeIcon icon='fa-solid fa-circle-check' style={{ color: '#389E0D', fontSize: '16px' }} /> Completed</Text>;
        }
        else if (!isNullOrEmpty(formik?.values?.disclosureAgreeErrorStatus)) {
            status = <Text className={cx(styles.errorMessage, web && styles.maxWidth100)}><HtmlFontAwesomeIcon icon='fa-solid fa-triangle-exclamation' style={{ fontSize: '16px' }} /> Please review and agree to this organization's Terms of Use.</Text>;
        }

        return status;
    }

    const displayWaiverDescriptionWithStatus = (item, itemHasError) => {
        let status = <Text>Please review and sign this Membership Agreement.</Text>

        if (equalString(item.Status, 'Success') || (!isNullOrEmpty(item.SignatureDataUrl) && toBoolean(item.AcceptAgreement))) {
            status = <Text><SVG icon='fa-solid fa-circle-check' style={{ color: '#389E0D', fontSize: '16px' }} /> Completed</Text>;
        }
        else if (equalString(item.Status, 'error') || itemHasError) {
            status = <Text className={cx(styles.errorMessage)}><SVG icon='fa-solid fa-triangle-exclamation' style={{ fontSize: '16px' }} /> Please review and sign this Membership Agreement.</Text>;
        }

        return status;
    }

    return (
        <>
            {!isNullOrEmpty(disclosureHtml) &&
                <Flex vertical={true} gap={20}>
                    <Flex vertical={true} gap={4}>
                        <Text className={styles.title}>Disclosure <Text className={styles.required}>*</Text></Text>

                        {displayCheckboxDescriptionWithStatus()}
                    </Flex>

                    <Flex gap={16}>
                        <Button onClick={() => {setShowCheckboxModal(true)}} block={true}>
                            Review
                        </Button>
                    </Flex>

                    <DrawerBottom showDrawer={showCheckboxModal}
                                  maxHeightVh={60}
                                  customFooter={<Flex>
                                      <Checkbox checked={toBoolean(formik?.values?.disclosureAgree)}
                                                onChange={(e) => {
                                                    formik.setFieldValue('disclosureAgree', e.target.checked);
                                                }}>
                                          <>I have read and agreed to the Terms and Conditions above <Text>*</Text></>
                                      </Checkbox>
                                  </Flex>}
                                  label={'Terms and Conditions'}>
                        <IframeContent content={formik?.values?.disclosures} id={'login-disclosure'}/>
                    </DrawerBottom>
                </Flex>
            }

            {(anyInList(formik?.values?.disclosures)) &&
                <>
                    {formik?.values?.disclosures.map((disclosure, index) => {
                        let isSignedWaiver = toBoolean(disclosure.AcceptAgreement) && !isNullOrEmpty(disclosure.SignatureDataUrl);
                        let memberFullName = `${formik?.values?.signFirstName} ${formik?.values?.signLastName}`;
                        let isErrorState = !isSignedWaiver && equalString(disclosure?.Status, 'error');


                        return (
                            <Flex vertical={true} gap={20}>
                                <Flex vertical={true} gap={4}>
                                    <Text>Membership Agreement: {disclosure?.Name} <Text className={styles.required}>*</Text></Text>
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
        </>
    );
};


export default FormDisclosures;