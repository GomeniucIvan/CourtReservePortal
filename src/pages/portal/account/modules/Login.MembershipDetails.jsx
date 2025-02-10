import {useEffect, useState} from "react";
import {Button, Divider, Flex, Skeleton, Tag, Typography} from 'antd';
import * as React from "react";
import {anyInList, isNullOrEmpty, nullToEmpty} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import ExpanderBlock from "@/components/expanderblock/ExpanderBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import apiService from "@/api/api.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useTranslation} from "react-i18next";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import MembershipDetailedDetails from "@/components/modules/membership/MembershipDetailedDetails.jsx";
const {Text, Title} = Typography;

function LoginMembershipDetails({ mainFormik, isLastStep, onNext }) {
    const [isFetching, setIsFetching] = useState(true);
    const [membership, setMembership] = useState(null);
    const {isLoading, globalStyles, token, setIsFooterVisible, setFooterContent } = useApp();
    const {setHeaderTitleKey} = useHeader();
    const {t} = useTranslation('login');

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    onClick={onNext}>
                {isLastStep ? 'Create Account' : 'Review'}
            </Button>
        </FooterBlock>);
        setHeaderTitleKey('loginMembershipDetails');
    }, [isFetching, isLoading]);

    const loadMembershipData = async () => {
        const response = await apiService.get(`/api/membership-member-portal/get-list?orgId=${nullToEmpty(mainFormik?.values?.selectedOrgId)}&membershipId=${mainFormik?.values?.selectedMembershipId}&flowName=review-and-finalize`);

        if (response.IsValid) {
            setMembership(response.MembershipsData[0]);

            let mData = response.MembershipsData[0];
            mData.AllowCreditCard = response.AllowCreditCard;
            mData.AllowECheck = response.AllowECheck;
            mData.AllowSaveCreditCardProfile = response.AllowSaveCreditCardProfile;

            //update agreements data
            mainFormik.setFieldValue('selectedMembership', mData);
        } else {
            //setError(response.Message);
        }

        setIsFetching(false);
    }

    useEffect(() => {
        loadMembershipData();
    }, [])

    return (
        <>
            {isFetching &&
                <>
                    {emptyArray(12).map((item, index) => (
                        <div key={index} style={{padding: `${token.padding}px`}}>
                            <Flex vertical={true} gap={8}>
                                <Skeleton.Button active={true} block
                                                 style={{ height: `23px`, width: `${randomNumber(25, 50)}%` }} />
                                <Skeleton.Button active={true} block style={{ height: `40px` }} />
                            </Flex>
                        </div>
                    ))}
                </>
            }

            {!isFetching &&
                <PaddingBlock topBottom={true}>
                   <MembershipDetailedDetails membership={membership} />
                </PaddingBlock>
            }
        </>
    )
}

export default LoginMembershipDetails
