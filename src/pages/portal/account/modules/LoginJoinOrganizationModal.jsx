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

function LoginJoinOrganizationModal({show, setShow, data, onSubmitClick}) {
    const {isLoading, token} = useApp();
    
    const {t} = useTranslation('login');
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    let selectedFrequencyValue = '';
    const recaptchaRef = useRef(null);
    let signupData = data;
    let reviewData = data;
    let selectedRatingCategoryWithRatings = [];
    let ratingCategories = [];
    let userDefinedFields = [];
    let membership = reviewData?.selectedMembership;
    let uiCulture = reviewData?.UiCulture;
    
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
                   onConfirm={onSubmitClick}
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

export default LoginJoinOrganizationModal
