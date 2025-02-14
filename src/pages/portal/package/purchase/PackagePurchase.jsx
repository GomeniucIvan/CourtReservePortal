import {useLocation, useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, isNullOrEmpty, notValidScroll, toBoolean} from "@/utils/Utils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {emptyArray, stringToJson} from "@/utils/ListUtils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import apiService from "@/api/api.jsx";
import {cx} from "antd-style";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import PackagePartialDetails from "@portal/profile/billing/packages/modules/PackagePartialDetails.jsx";
import PublicPackageDetails from "@portal/package/modules/PublicPackageDetails.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import SVG from "@/components/svg/SVG.jsx";
import PublicPackageEligibleItems from "@portal/package/modules/PublicPackageEligibleItems.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {genderList} from "@/utils/SelectUtils.jsx";
import {useFormik} from "formik";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {setFormikError, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {navigationClearHistory} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";

const {Title, Text}  = Typography ;

function PackagePurchase() {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, shouldFetch, resetFetch, token, setIsLoading, isLoading, setFooterContent} = useApp();
    const [pack, setPack] = useState(null);
    const {orgId,authData} = useAuth();
    const [familyMembership, setFamilyMembership] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const packageId = queryParams.get("packageId");
    const guid = queryParams.get("guid");
    const {t} = useTranslation('');
    
    const initialValues = {
        FamilyMemberIds: [],
        FamilyMemberId: ''
    };

    const validationSchema = Yup.object({
       
    });
    
    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validate: () => {
            let isValid = true;
            
            if (stringToJson(authData?.FamilyMembersJson)){
                if (toBoolean(pack.EligibleAssignByFamily)){
                    if (!anyInList(formik?.values?.FamilyMemberIds)) {
                        isValid = false;
                        setFormikError(t, formik, 'FamilyMemberIds', '', 'Family Member is required.' )
                    }
                } else {
                    if (isNullOrEmpty(formik?.values?.FamilyMemberId)) {
                        isValid = false;
                        setFormikError(t, formik, 'FamilyMemberId', '', 'Family Member is required.' )
                    }
                }
            }
            
            return isValid;

        },
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);

            let selectedMemberIds =[];
            if (stringToJson(authData?.FamilyMembersJson)) {
                if (toBoolean(pack.EligibleAssignByFamily)) {
                    selectedMemberIds = values.FamilyMemberIds;
                } else {
                    selectedMemberIds.push(values.FamilyMemberId);
                }
            }
            
            let postModel = {
                PackageId: packageId,
                MembersFamilySelected: selectedMemberIds.join(',')
            }

            let response = await apiService.post(`/api/member-portal/packages/purchase-package?id=${orgId}`, postModel);
            if (toBoolean(response.IsValid)) {
                const data = response.data;
                navigationClearHistory();
                
                pNotify('Package successfully purchased.');
                
                if (toBoolean(data.IsRequireOnlinePayment)) {
                    let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                    navigate(`${route}?psId=${data.PackageSaleId}`);
                } else {
                    let route = toRoute(ProfileRouteNames.PROCESS_TRANSACTION_PAYMENT, 'id', orgId);
                    navigate(`${route}?payments=${data.TransactionFeeId}`);
                }
            } else {
                displayMessageModal({
                    title: 'Error',
                    html: (onClose) => `${response.Message}`,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        notValidScroll();
                    },
                })
            }
            
            setIsLoading(false);
        },
    });
    
    const loadData = async () => {
        setIsFetching(true);
        let response = await apiService.get(`/api/member-portal/packages/get-package-details?id=${orgId}&packageId=${packageId}&guid=${guid}`);

        if (toBoolean(response?.IsValid)) {
            setPack(response.Data);
            if (stringToJson(authData?.FamilyMembersJson)) {
                let responseFamilyMembers = await apiService.get(`/api/member-portal/packages/get-my-eligible-family-members-to-purchase-package?id=${orgId}&packageId=${packageId}`); 
           
                if (toBoolean(responseFamilyMembers.IsValid)) {
                    setFamilyMembership(responseFamilyMembers.Data);
                }
            }
        }
        
        setIsFetching(false);
    }
    
    useEffect(() => {
        setHeaderRightIcons('');
        setIsFooterVisible(true);
        loadData();
    }, []);

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={() => {formik.submitForm()}}>
                Purchase Package
            </Button>
        </FooterBlock>);
    }, [isFetching, isLoading]);
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching && 
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(6).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        <Flex vertical={true} gap={token.paddingMD}>
                            <PublicPackageDetails pack={pack} page={'puchase'} />
                        </Flex>

                        {!toBoolean(pack.AllowUsageWhileUnpaid) &&
                            <Flex justify={'center'} vertical={true} gap={8}>
                                <AlertBlock
                                    type={'warning'}
                                    removePadding={true}
                                    description={'This Package requires online payment. After moving to the payment step, you would need to pay for the package within the next 15 minutes'}
                                />  
                            </Flex>
                        }
                        
                        {(anyInList(familyMembership)) &&
                            <>
                                <FormSelect
                                    formik={formik}
                                    name={toBoolean(pack.EligibleAssignByFamily) ? `FamilyMemberIds` : 'FamilyMemberId'}
                                    label={ toBoolean(pack.EligibleAssignByFamily) ? 'Eligible Player(s) for This Package' : 'Eligible Player for This Package'}
                                    multi={toBoolean(pack.EligibleAssignByFamily)}
                                    options={familyMembership}
                                    propText='NameToDisplay'
                                    propValue='OrgMemberId'
                                    placeholder={toBoolean(pack.EligibleAssignByFamily) ? 'All' : 'Select Player'}
                                    required={!toBoolean(pack.EligibleAssignByFamily)}
                                />
                            </>
                        } 
                        
                        <PublicPackageEligibleItems pack={pack} page={'details'} />
                    </Flex>
                </>
            }
        </PaddingBlock>
    )
}

export default PackagePurchase
