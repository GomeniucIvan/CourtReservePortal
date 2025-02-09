import React, {useEffect, useRef, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {equalString, isNullOrEmpty, notValidScroll, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Divider, Flex, Skeleton} from "antd";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import * as Yup from "yup";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {orgCardCountryCode} from "@/utils/OrganizationUtils.jsx";
import {validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";

function ProfileCreatePaymentProfile({}) {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const {isLoading, setIsFooterVisible, shouldFetch, resetFetch, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const {orgId} = useAuth();
    const paymentProfileRef = useRef(null);
    const [modelData, setModelData] = useState(null);
    const { t } = useTranslation('login');
    
    const initialValues = {
        ...CardConstants
    };

    const validationSchema = Yup.object({

    });
    
    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validation: () => {
            let isValidPaymentProfile = validatePaymentProfile(t, formik, true, modelData);
            return isValidPaymentProfile;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            if (paymentProfileRef.current) {
                setIsLoading(true);
                
                let isValidTokenObj = await paymentProfileRef.current.submitCreateToken();

                if (!isValidTokenObj.isValid) {
                    setIsLoading(false);
                    displayMessageModal({
                        title: 'Error',
                        html: (onClose) => `${isValidTokenObj?.errorMessage}`,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {
                            notValidScroll();
                        },
                    })

                    return;
                }

                let postModel = {
                    AccountType: values?.card_accountType,
                    Country: values?.card_country,
                    StripeBankAccountToken: values?.card_number,
                    CardNumber: values?.card_number,
                    FirstName: values?.card_firstName,
                    LastName: values?.card_lastName,
                    PhoneNumber: values?.card_phoneNumber,
                    Address1: values?.card_streetAddress,
                    City: values?.card_city,
                    State: values?.card_state,
                    OrganizationId: orgId,
                    AccountNumber: values?.card_accountNumber,
                    RoutingNumber: values?.card_routingNumber,
                    Cvv: values?.card_securityCode,
                    ExpiryDate: values?.card_expiryDate,
                    OrganizationMemberId: modelData.OrganizationMemberId,
                    ZipCode: values?.card_zipCode,
                }

                let response = await appService.post(`/app/Online/PaymentOptions/AddPaymentOption?id=${orgId}`, postModel);
                if (toBoolean(response?.IsValid)) {
                    removeLastHistoryEntry();
                    pNotify('Payment Profile Created.')
                    navigate(response.Data.RedirectUrl);
                } else {
                    displayMessageModal({
                        title: "Error",
                        html: (onClose) => response.Message,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {},
                    })
                }

                setIsLoading(false);
            }
        },
    });
    
    const loadData = async () => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/PaymentOptions/AddPaymentOption?id=${orgId}`);

        if (response.IsValid){
            let data = response.Data;
            formik.setFieldValue('card_firstName', data.FirstName);
            formik.setFieldValue('card_lastName', data.LastName);
            formik.setFieldValue('card_phoneNumber', data.PhoneNumber);
            formik.setFieldValue('card_zipCode', data.ZipCode);
            formik.setFieldValue('card_city', data.City);
            formik.setFieldValue('card_state', data.State);
            formik.setFieldValue('card_streetAddress', data.Address1);
            formik.setFieldValue('card_country', orgCardCountryCode(data.PartialUiCulture));
            setModelData(data);
        }
        setIsLoading(false);
        setIsFetching(false);
        resetFetch();
    }

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    onClick={() => {
                        formik.handleSubmit();
                    }}
                    disabled={isFetching}
                    loading={isLoading}>
                Create Payment Profile
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData()
    }, [])
    
    return (
        <PaddingBlock topBottom={true}>

            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(6).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `${token.Input.controlHeight}px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <FormPaymentProfile formik={formik}
                                    includeCustomerDetails={true}
                                    allowToSavePaymentProfile={false}
                                    ref={paymentProfileRef}
                                    showStatesDropdown={toBoolean(modelData?.ShowStatesDropdown)}
                                    hideFields={{
                                        firstLastName: false,
                                        address2: true,
                                        phoneNumber: false,
                                        accountType: false
                                    }}
                                    paymentProviderData={{
                                        ...modelData,
                                        SelectedSegment: !toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) ? 'Credit Card' : toBoolean(modelData.AllowMembersToCreateAchProfiles) ? 'eCheck' : '',
                                        ShowSegment: (!toBoolean(modelData.PreventPlayersFromCreatingACreditCardPaymentProfile) && toBoolean(modelData.AllowMembersToCreateAchProfiles))
                                    }}
                                    paymentTypes={modelData?.AccountTypesSelectListItems}
                />
            }
        </PaddingBlock>
    )
}

export default ProfileCreatePaymentProfile