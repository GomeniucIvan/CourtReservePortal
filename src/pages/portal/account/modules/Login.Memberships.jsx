import {useFormik} from 'formik';
import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import {Button, Descriptions, Divider, Empty, Flex, Input, Skeleton, Tag, Typography} from 'antd';
import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, nullToEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import apiService from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {cx} from "antd-style";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Card} from "antd-mobile";
import {useStyles} from "./../styles.jsx";
import * as React from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import LoginCreateAccountReviewModal from "@portal/account/login/Login.CreateAccountReviewModal.jsx";
import JoinOrganizationReviewModal from "@portal/account/joinorganization/JoinOrganization.ReviewModal.jsx";
import MembershipCard from "@/components/modules/membershipcard/MembershipCard.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";

const {Text, Title, Link} = Typography;

function LoginMemberships({ mainFormik, onMembershipSelect, onSkip, page = 'create-account' }) {
    const {setHeaderTitleKey} = useHeader();
    const {setIsLoading, token, setIsFooterVisible, setFooterContent } = useApp();
    const {spGuideId} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const [memberships, setMemberships] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(null);

    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');
        setHeaderTitleKey('loginMembership');
    }, []);
    
    useEffect(() => {
        loadMemberships();
    }, []);

    const loadMemberships = async () => {
        if (isNullOrEmpty(memberships)) {
            setIsFetching(true);
            setIsLoading(true);
            const response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${nullToEmpty(mainFormik?.values?.selectedOrgId)}&spGuideId=${nullToEmpty(spGuideId)}&checkHasWaiverToSign=true&flowName=mobile-create-account`);

            if (response.IsValid) {
                setMemberships(response.MembershipsData);
            }

            setIsFetching(false);
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
       
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            let costType = values.selectedMembership;

            onSkip(values);
        },
    });
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(2).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `240px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <>
                    {!anyInList(memberships) ? (
                        <EmptyBlock description={'No memberships found.'} />
                    ) : (
                        <Flex vertical={true} gap={token.padding}>
                            {memberships.map((membership, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <MembershipCard membership={membership} onMembershipSelect={onMembershipSelect}/>
                                    </React.Fragment>
                                )
                            })}
                        </Flex>
                    )}
                </>
            }
            
            {equalString(page, 'create-account') &&
                <LoginCreateAccountReviewModal data={mainFormik.values} show={showReviewModal} setShow={setShowReviewModal}/>    
            }

            {equalString(page, 'join-organization') &&
                <JoinOrganizationReviewModal data={mainFormik.values} show={showReviewModal} setShow={setShowReviewModal}/>
            }
        </PaddingBlock>
    )
}

export default LoginMemberships
