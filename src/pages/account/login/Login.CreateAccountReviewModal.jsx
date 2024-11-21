import {useApp} from "../../../context/AppProvider.jsx";
import {useRef} from "react";
import {Descriptions, Divider, Typography} from 'antd';
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import ReCAPTCHA from 'react-google-recaptcha';
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {
    anyInList,
    equalString,
    isNullOrEmpty,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {isCanadaCulture} from "../../../utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "../../../utils/DateUtils.jsx";
import Modal from "../../../components/modal/Modal.jsx";
import {logFormikErrors, logInfo} from "../../../utils/ConsoleUtils.jsx";
import appService from "../../../api/app.jsx";
import {useNavigate} from "react-router-dom";
import apiService, {setRequestData} from "../../../api/api.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {getConfigValue} from "../../../config/WebConfig.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";

const {Title} = Typography;

function LoginCreateAccountReviewModal({show, setShow, formik}) {
    const {isLoading, setIsLoading, token} = useApp();

    const {
        setAuthorizationData
    } = useAuth();
    const {t} = useTranslation('login');
    let values = formik?.values;
    let membership = values?.selectedMembership;
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    let selectedFrequencyValue = '';
    const navigate = useNavigate();
    const recaptchaRef = useRef();
    
    const createAccount = async () => {
        setIsLoading(true);

        const postModel = {
            MembershipId: membership?.CostTypeId,
            PaymentFrequency: values?.paymentFrequency,
            IsMobileLayout: true,
            SsoKey: '',
            Token: await recaptchaRef.current.executeAsync(),
            SpGuideId: values?.SpGuideId,
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
                ExpiryDate: values?.card_expiryDate,
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
        
        let response = await appService.post(`/app/Online/Portal/RegisterAccount?id=${values.selectedOrgId}`, postModel);

        if (toBoolean(response?.IsValid)){
            let memberId = response.memberId;
            let requestData = await appService.get(navigate, `/app/Online/Account/RequestData?id=${values.selectedOrgId}&memberId=${memberId}`);
            
            if (requestData.IsValid) {
                const responseData = requestData.Data;
                setRequestData(responseData.RequestData);

                let authResponse = await apiService.authData(values.selectedOrgId);

                if (toBoolean(authResponse?.IsValid)) {
                    await setAuthorizationData(authResponse.Data);

                    setIsLoading(false);
                    let navigationKey = response.key.toLowerCase();
                    
                    switch (navigationKey) {
                        case 'logout':
                            navigate(AuthRouteNames.LOGIN);
                            break;

                        case 'paymymembershipfees':
                            navigate(ProfileRouteNames.PROFILE_PAYMENT_PROFILE_LIST);
                            break;

                        case 'mymembership':
                            navigate(ProfileRouteNames.PROFILE_MEMBERSHIP);
                            break;

                        case 'myclubs':
                            navigate(HomeRouteNames.MY_CLUBS);
                            break;

                        case 'dashboard':
                            navigate(HomeRouteNames.INDEX);
                            break;

                        case 'memberships':
                            navigate(HomeRouteNames.MEMBERSHIPS);
                            break;
                            
                        case 'myfamily':
                            navigate(ProfileRouteNames.PROFILE_FAMILY_LIST);
                            break;
                    }
                }
            }
        } else{
            ModalClose({
                content: response.Message,
                showIcon: false,
                onOk: () => {

                }
            });
            setIsLoading(false);
        }
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
    
    logInfo();
    console.log(values);
    
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

                    {(anyInList(ratingCategories) || anyInList(userDefinedFields)) &&
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

                    <ReCAPTCHA
                        ref={recaptchaRef}
                        size="invisible"
                        sitekey={captchaKey}
                    />
                </PaddingBlock>
            </Modal>
        </>
    )
}

export default LoginCreateAccountReviewModal
