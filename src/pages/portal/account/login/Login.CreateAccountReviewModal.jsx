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
import LoginJoinOrganizationModal from "@portal/account/modules/LoginJoinOrganizationModal.jsx";

const {Title} = Typography;

function LoginCreateAccountReviewModal({show, setShow, data}) {
    const {setIsLoading} = useApp();

    const { setAuthorizationData } = useAuth();
    let captchaKey = getConfigValue('GoogleCaptchaKey_V3');
    const navigate = useNavigate();
    const recaptchaRef = useRef(null);
    let signupData = data;
    let reviewData = data;
    
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
    
    return (
        <>
            <LoginJoinOrganizationModal show={show} setShow={setShow} data={data} onSubmitClick={createAccount} />
            <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={captchaKey}
            />
        </>
    )
}

export default LoginCreateAccountReviewModal
