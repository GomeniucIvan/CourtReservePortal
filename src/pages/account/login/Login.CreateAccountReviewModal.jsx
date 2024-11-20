import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Descriptions, Divider, Flex, QRCode, Skeleton, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {
    anyInList,
    equalString,
    focus,
    isNullOrEmpty,
    isValidEmail,
    nullToEmpty, oneListItem,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {isCanadaCulture} from "../../../utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "../../../utils/DateUtils.jsx";
import Modal from "../../../components/modal/Modal.jsx";
import {logInfo} from "../../../utils/ConsoleUtils.jsx";

const {Paragraph, Link, Title} = Typography;

function LoginCreateAccountReviewModal({show, setShow, formik}) {
    const {isLoading, setIsLoading, token} = useApp();
    const {t} = useTranslation('login');
    let values = formik?.values;
    let membership = values?.selectedMembership;
    let selectedFrequencyValue = '';
    
    console.log(values)
    
    const createAccount = async () => {
        setIsLoading(true);

        const postModel = {
            MembershipId: membership?.CostTypeId,
            PaymentFrequency: membership?.paymentFrequency,
            IsMobileLayout: true,
            SsoKey: '',
            //Token: await reviewFormRef.current.getCaptchaToken(),
            SpGuideId: formik?.values?.SpGuideId,
            IsNewAuth: true,
            OrgFields: {
                MembershipId: membership?.CostTypeId,
                CustomFields: values?.userDefinedFields,
                RatingCategories: values?.ratingCategories,
                PhoneNumber: {
                    PhoneNumber: values?.phoneNumber,
                    Include: toBoolean(values?.formIncludes?.IncludePhoneNumber)
                },
                MemberGender: {
                    Gender: values?.gender,
                    Include: toBoolean(values?.formIncludes?.IncludeGender)
                },
                Address: {
                    Address: values?.streetAddress,
                    City: values?.city,
                    State: values?.state,
                    ZipCode: values?.zipCode,
                    Include: toBoolean(values?.formIncludes?.IncludeAddressBlock)
                },
                Membership: {
                    MembershipNumber: values?.membershipNumber,
                    Include: toBoolean(values?.formIncludes?.IncludeMembershipNumber)
                },
                DateOfBirth: {
                    DateOfBirthString: values?.dateOfBirthString,
                    Include: toBoolean(values?.formIncludes?.IncludeDateOfBirthBlock)
                },
                DisclosureAgree: values?.disclosureAgree,
                FirstName: values?.firstName,
                LastName: values?.lastName,
                Email: values?.email,
                PaymentFrequency: values?.paymentFrequency,
                //AdditionalFamilyMembers: getFamilyMembersList(familyMembersFormValues),
            },
            SelectedMemberIdToJoin: "",
            UserAccount: {
                FirstName: values?.firstName,
                LastName: values?.lastName,
                Email: values?.email,
                Password: values?.password,
                RepeatPassword: values?.confirmPassword,
                FindOrgId: values?.selectedOrgId,
            },
            CardDetails: {
                //Number: "",
                CardNumber: values?.card_number,
                Cvv: values?.card_securityCode,
                ExpiryDate: values?.expiryDate,
                StripeBankAccountToken: values?.card_number,
                AccountType: values?.card_accountType,
                AccountNumber: values?.card_accountNumber,
                RoutingNumber: values?.card_routingNumber,
                FirstName: values?.card_firstName,
                LastName: values?.card_lastName,
                Address: values?.card_streetAddress,
                City: values?.card_city,
                State: values?.card_state,
                ZipCode: values?.card_zipCode,
                HiddenFortisTokenId: values?.hiddenFortisTokenId
            },
            Country: values?.card_country
        }
        
        console.log(postModel)
    }
    
    let selectedRatingCategoryWithRatings = [];
    let ratingCategories = [];
    let userDefinedFields = [];
    
    if (anyInList(values?.ratingCategories)){
        selectedRatingCategoryWithRatings = values?.ratingCategories.filter(ratingCategory => (!isNullOrEmpty(ratingCategory.SelectedRatingId) || anyInList(ratingCategory.SelectedRatingsIds)));

        selectedRatingCategoryWithRatings.forEach(ratingCategory => {
            let selectedRatingIds = [];
            
            if (ratingCategory.AllowMultipleRatingValues) {
                selectedRatingIds = ratingCategory.SelectedRatingsIds;
            } else{
                if (!isNullOrEmpty(ratingCategory.SelectedRatingId)){
                    selectedRatingIds.push(ratingCategory.SelectedRatingId)
                }
            }
            console.log(selectedRatingIds)
            if (anyInList(selectedRatingIds)) {
                let selectedOptions = ratingCategory.Ratings
                    .filter(rating => selectedRatingIds.includes(rating.Id))
                    .map(rating => rating.Name);

                if (anyInList(selectedOptions)) {
                    ratingCategories.push({
                        Text: ratingCategory.Name,
                        Value: selectedOptions.join(', ')
                    });
                }
            }
        })
    }
    
    if (anyInList(values?.userDefinedFields)){
        userDefinedFields = values.userDefinedFields
            .filter(udf => !isNullOrEmpty(udf.Value))
    }
    
    logInfo(membership);
    
    if (!isNullOrEmpty(membership)){
        let selectedPaymentFrequency = values?.paymentFrequency;
        if (!isNullOrEmpty(selectedPaymentFrequency)){
            let selectedOption = membership.PaymentOptions.find(paymentOption => equalString(paymentOption.Value, selectedPaymentFrequency));
            selectedFrequencyValue = selectedOption.Text;
        }
    }
    
    return (
        <>
            <Modal show={show}
                   onClose={() => {setShow(false)}}
                   onConfirm={createAccount}
                   loading={isLoading}
                   showConfirmButton={true}
                   title={t('review.modalTitle')}>
                
                <PaddingBlock>
                    <Title level={4} style={{paddingBottom: token.padding}}>
                        {!isNullOrEmpty(values?.reviewModalTitle) ? 
                            (<>{values?.reviewModalTitle}</>):(
                            <>{t('review.confirmMessage')}</>
                        )}
                    </Title>

                    <Descriptions title={t('review.orgInfo')} >
                        <Descriptions.Item label={t(`searchOrganization.drawer.name`)}>{values?.selectedOrgName}</Descriptions.Item>

                        {!isNullOrEmpty(values?.OrgFullAddress) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.fullAddress`)}>{values?.selectedOrgFullAddress}</Descriptions.Item>
                        }
                    </Descriptions>

                    <Divider />
                    <Descriptions title={t('review.profileInfo')}>
                        <Descriptions.Item label={t(`getStarted.form.email`)}>{values?.email}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.firstName`)}>{values?.firstName}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.lastName`)}>{values?.lastName}</Descriptions.Item>


                        {!isNullOrEmpty(values?.streetAddress) &&
                            <Descriptions.Item label={t(`additionalInfo.form.streetAddress`)}>{values?.streetAddress}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.city) &&
                            <Descriptions.Item label={t(`additionalInfo.form.city`)}>{values?.city}</Descriptions.Item>
                        }

                        {!isNullOrEmpty(values?.state) &&
                            <Descriptions.Item label={t(isCanadaCulture(values?.UiCulture) ? 'additionalInfo.form.province' : 'additionalInfo.form.state')}>{values?.state}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.zipCode) &&
                            <Descriptions.Item label={t(isNonUsCulture(values?.UiCulture) ? 'additionalInfo.form.postalCode' : 'additionalInfo.form.zipCode')}>{values?.zipCode}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.phoneNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.phoneNumber`)}>{values?.phoneNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.dateOfBirthString) &&
                            <Descriptions.Item label={t(`additionalInfo.form.dateOfBirth`)}>{values?.dateOfBirthString}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.membershipNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.membershipNumber`)}>{values?.membershipNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.gender) &&
                            <Descriptions.Item label={t(`additionalInfo.form.gender`)}>{values?.gender}</Descriptions.Item>
                        }
                    </Descriptions>

                    {(anyInList(ratingCategories) || anyInList(values?.userDefinedFields)) &&
                        <>
                            <Divider />

                            <Descriptions title={t('review.additionalInfo')}>
                                {anyInList(ratingCategories) &&
                                    <>
                                        {ratingCategories.map((ratingCategory, index) => {
                                            return (
                                                <Descriptions.Item key={`rating_${index}`} label={ratingCategory.Text}>{ratingCategory.Value}</Descriptions.Item>
                                            )
                                        })}
                                    </>
                                }
                                {anyInList(userDefinedFields) &&
                                    <>
                                        {userDefinedFields.map((udf, index) => {
                                            return (
                                                <Descriptions.Item key={`udf_${index}`} label={udf.Label}>{udf.Value}</Descriptions.Item>
                                            )
                                        })}
                                    </>
                                }
                            </Descriptions>
                        </>
                    }

                    {!isNullOrEmpty(values?.selectedMembership?.CostTypeId) &&
                        <>
                            <Divider />

                            <Descriptions title={t('review.membershipInfo')}>
                                <Descriptions.Item label={t('review.membershipName')}>{membership?.Name}</Descriptions.Item>
                                {!isNullOrEmpty(selectedFrequencyValue) &&
                                    <Descriptions.Item label={t('review.frequency')}>{selectedFrequencyValue}</Descriptions.Item>
                                }
                            </Descriptions>
                        </>
                    }
                </PaddingBlock>
            </Modal>
        </>
    )
}

export default LoginCreateAccountReviewModal
