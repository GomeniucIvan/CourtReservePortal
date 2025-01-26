import {useApp} from "@/context/AppProvider.jsx";
import {useRef} from "react";
import {Descriptions, Divider, Typography} from 'antd';
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import ReCAPTCHA from 'react-google-recaptcha';
import {
    anyInList,
    equalString,
    isNullOrEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {isCanadaCulture} from "@/utils/OrganizationUtils.jsx";
import {isNonUsCulture} from "@/utils/DateUtils.jsx";
import Modal from "@/components/modal/Modal.jsx";
import appService from "@/api/app.jsx";
import {useNavigate} from "react-router-dom";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import portalService from "@/api/portal.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {getGlobalSpGuideId} from "@/utils/AppUtils.jsx";
import {navigationClearHistory} from "@/toolkit/HistoryStack.js";

const {Title} = Typography;

function LoginCreateAccountReviewModal({show, setShow, data}) {
    const {isLoading, setIsLoading, token} = useApp();

    const {
        setAuthorizationData
    } = useAuth();
    const {t} = useTranslation('login');
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    let selectedFrequencyValue = '';
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    let signupData = data;
    let reviewData = data;
    let selectedRatingCategoryWithRatings = [];
    let ratingCategories = [];
    let userDefinedFields = [];
    let membership = reviewData?.selectedMembership;
    let uiCulture = reviewData?.UiCulture;
    
    const createAccount = async () => {
        setIsLoading(true);

        let membership = reviewData?.selectedMembership;
        let orgIdToCreateAccount = data?.OrganizationId;
        
        const postModel = {
            MembershipId: membership?.Id,
            PaymentFrequency: reviewData?.paymentFrequency,
            IsMobileLayout: true,
            SsoKey: '',
            Token: await recaptchaRef.current.executeAsync(),
            SpGuideId: getGlobalSpGuideId(),
            IsNewAuth: true,
            OrgFields: {
                MembershipId: membership?.Id,
                CustomFields: signupData?.Udfs,
                RatingCategories: signupData?.RatingCategories,
                PhoneNumber: {
                    PhoneNumber: signupData?.phoneNumber,
                    Include: toBoolean(signupData?.IncludePhoneNumber)
                },
                MemberGender: {
                    Gender: signupData?.gender,
                    Include: toBoolean(signupData?.IncludeGender)
                },
                Address: {
                    Address: signupData?.streetAddress,
                    City: signupData?.city,
                    State: signupData?.state,
                    ZipCode: signupData?.zipCode,
                    Include: toBoolean(signupData?.IncludeAddressBlock)
                },
                Membership: {
                    MembershipNumber: signupData?.membershipNumber,
                    Include: toBoolean(signupData?.IncludeMembershipNumber)
                },
                DateOfBirth: {
                    DateOfBirthString: signupData?.dateOfBirthString,
                    Include: toBoolean(signupData?.IncludeDateOfBirthBlock)
                },
                DisclosureAgree: reviewData?.disclosureAgree,
                FirstName: reviewData?.firstName,
                LastName: reviewData?.lastName,
                Email: reviewData?.email,
                PaymentFrequency: reviewData?.paymentFrequency,
                //AdditionalFamilyMembers: getFamilyMembersList(familyMembersFormValues),
            },
            SelectedMemberIdToJoin: "",
            UserAccount: {
                FirstName: signupData?.firstName,
                LastName: signupData?.lastName,
                Email: signupData?.email,
                Password: signupData?.password,
                RepeatPassword: signupData?.confirmPassword,
                FindOrgId: orgIdToCreateAccount,
            },
            CardDetails: {
                //Number: "",
                CardNumber: reviewData?.card_number,
                Cvv: reviewData?.card_securityCode,
                ExpiryDate: reviewData?.card_expiryDate,
                StripeBankAccountToken: reviewData?.card_number,
                AccountType: reviewData?.card_accountType,
                AccountNumber: reviewData?.card_accountNumber,
                RoutingNumber: reviewData?.card_routingNumber,
                FirstName: reviewData?.card_firstName,
                LastName: reviewData?.card_lastName,
                Address: reviewData?.card_streetAddress,
                City: reviewData?.card_city,
                State: reviewData?.card_state,
                ZipCode: reviewData?.card_zipCode,
                HiddenFortisTokenId: reviewData?.hiddenFortisTokenId
            },
            Country: reviewData?.card_country,
            DisclosuresToSign: reviewData?.disclosures,
            SaveDataForFutureUse: reviewData?.card_savePaymentProfile,
        }
        
        let response = await appService.post(`/app/Online/Portal/RegisterAccount?id=${orgIdToCreateAccount}`, postModel);

        if (toBoolean(response?.IsValid)){
            let requestData = await portalService.requestData(navigate, orgIdToCreateAccount);

            if (toBoolean(requestData?.IsValid)) {
                await setAuthorizationData(requestData.OrganizationData);

                setIsLoading(false);
                let navigationKey = response.key.toLowerCase();

                navigationClearHistory();
                
                switch (navigationKey) {
                    case 'logout':
                        navigate(AuthRouteNames.LOGIN);
                        break;

                    case 'paymymembershipfees':
                        let paymentOptions = toRoute(ProfileRouteNames.PROFILE_PAYMENT_PROFILE_LIST, 'id', orgIdToCreateAccount);
                        navigate(paymentOptions);
                        break;

                    case 'mymembership':
                        let profileRoute = toRoute(ProfileRouteNames.PROFILE_MEMBERSHIP, 'id', orgIdToCreateAccount);
                        navigate(profileRoute);
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
                        let familyRoute = toRoute(ProfileRouteNames.PROFILE_FAMILY_LIST, 'id', orgIdToCreateAccount);
                        navigate(familyRoute);
                        break;
                }
            }
        } else if (toBoolean(response?.Data?.UnathorizeAccess)){
            navigate(AuthRouteNames.LOGIN);
        }
        else{
            displayMessageModal({
                title: "Create Account Error",
                html: (onClose) => response.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {},
            })
            setIsLoading(false);
        }
    }
    
    if (anyInList(signupData?.RatingCategories)){
        selectedRatingCategoryWithRatings = signupData?.RatingCategories.filter(ratingCategory => (!isNullOrEmpty(ratingCategory.SelectedRatingId) || anyInList(ratingCategory.SelectedRatingsIds)));

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
    
    if (anyInList(signupData?.Udfs)){
        userDefinedFields = signupData?.Udfs
            .filter(udf => !isNullOrEmpty(udf.Value))
    }
    
    if (!isNullOrEmpty(membership)){
        let selectedPaymentFrequency = reviewData?.paymentFrequency;
        if (!isNullOrEmpty(selectedPaymentFrequency) && anyInList(membership.Prices)){
            let selectedOption = membership.Prices.find(paymentOption => equalString(paymentOption.CostTypeFrequency, selectedPaymentFrequency));
            selectedFrequencyValue = selectedOption.FullPriceDisplay;
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
                        {!isNullOrEmpty(signupData?.reviewModalTitle) ? 
                            (<div style={{fontWeight: 'initial'}} dangerouslySetInnerHTML={{__html: signupData?.reviewModalTitle}}/>):(
                            <>{t('review.confirmMessage')}</>
                        )}
                    </Title>

                    <Descriptions title={t('review.orgInfo')} >
                        <Descriptions.Item label={t(`searchOrganization.drawer.name`)}>{signupData?.selectedOrgName}</Descriptions.Item>

                        {!isNullOrEmpty(signupData?.OrgFullAddress) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.fullAddress`)}>{signupData?.selectedOrgFullAddress}</Descriptions.Item>
                        }
                    </Descriptions>

                    <Divider />
                    <Descriptions title={t('review.profileInfo')}>
                        <Descriptions.Item label={t(`getStarted.form.email`)}>{signupData?.email}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.firstName`)}>{signupData?.firstName}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.lastName`)}>{signupData?.lastName}</Descriptions.Item>


                        {!isNullOrEmpty(signupData?.streetAddress) &&
                            <Descriptions.Item label={t(`additionalInfo.form.streetAddress`)}>{signupData?.streetAddress}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.city) &&
                            <Descriptions.Item label={t(`additionalInfo.form.city`)}>{signupData?.city}</Descriptions.Item>
                        }

                        {!isNullOrEmpty(signupData?.state) &&
                            <Descriptions.Item label={t(isCanadaCulture(signupData?.UiCulture) ? 'additionalInfo.form.province' : 'additionalInfo.form.state')}>{signupData?.state}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.zipCode) &&
                            <Descriptions.Item label={t(isNonUsCulture(signupData?.UiCulture) ? 'additionalInfo.form.postalCode' : 'additionalInfo.form.zipCode')}>{signupData?.zipCode}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.phoneNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.phoneNumber`)}>{signupData?.phoneNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.dateOfBirthString) &&
                            <Descriptions.Item label={t(`additionalInfo.form.dateOfBirth`)}>{signupData?.dateOfBirthString}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.membershipNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.membershipNumber`)}>{signupData?.membershipNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(signupData?.gender) &&
                            <Descriptions.Item label={t(`additionalInfo.form.gender`)}>{signupData?.gender}</Descriptions.Item>
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

                    {!isNullOrEmpty(reviewData?.selectedMembership?.Id) &&
                        <>
                            <Divider />

                            <Descriptions title={t('review.membershipInfo')}>
                                <Descriptions.Item label={t('review.membershipName')}>{reviewData?.selectedMembership?.Name}</Descriptions.Item>
                                {!isNullOrEmpty(selectedFrequencyValue) &&
                                    <Descriptions.Item label={t('review.frequency')}>{selectedFrequencyValue}</Descriptions.Item>
                                }
                            </Descriptions>
                        </>
                    }

                    {!isNullOrEmpty(reviewData?.card_firstName) &&
                        <>
                            <Divider />

                            <Descriptions title='Billing Info'>
                                {!isNullOrEmpty(signupData?.card_firstName) &&
                                    <Descriptions.Item label={'First Name'}>{signupData?.card_firstName}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.card_lastName) &&
                                    <Descriptions.Item label={'Last Name'}>{signupData?.card_lastName}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.card_streetAddress) &&
                                    <Descriptions.Item label={'Street Address'}>{signupData?.card_streetAddress}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.city) &&
                                    <Descriptions.Item label={'City'}>{signupData?.city}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.card_state) &&
                                    <Descriptions.Item label={t(isCanadaCulture(uiCulture) ? 'additionalInfo.form.province' : 'additionalInfo.form.state')}>{signupData?.card_state}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.card_zipCode) &&
                                    <Descriptions.Item label={isNonUsCulture(uiCulture) ? t(`additionalInfo.form.postalCode`) : t(`additionalInfo.form.zipCode`)}>{signupData?.card_zipCode}</Descriptions.Item>
                                }
                                {!isNullOrEmpty(signupData?.card_accountType) &&
                                    <Descriptions.Item label={'Payment Type'}>{equalString(signupData?.card_accountType, 2) ? 'eCheck' : 'Credit Card'}</Descriptions.Item>
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
