import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge, Card} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import * as React from "react";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
const {Title} = Typography;

function ProfileBillingInvoicePayment() {
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const {orgId} = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("invoiceId");
    
    const {
        token,
        globalStyles,
        setIsFooterVisible,
        availableHeight,
        setFooterContent
    } = useApp();

    const loadData = async () => {
        setIsFetching(true);
        
        let response = await appService.get(navigate, `/app/Online/MyInvoices/ViewMyInvoice?id=${orgId}&invoiceId=${invoiceId}`);

        if (toBoolean(response?.IsValid)) {
            setInvoiceDetails(response?.Data);
        }
        
        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')
        setFooterContent('');

        loadData();
    }, [])

    useEffect(() => {
        if (toBoolean(invoiceDetails?.ShowPayButton)) {
            setFooterContent(<FooterBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        onClick={() => {
                            let route = toRoute(ProfileRouteNames.PACKAGE_LIST, 'id', orgId);
                            navigate(route);
                        }}>
                    Pay
                </Button>
            </FooterBlock>)
        }
    }, [invoiceDetails]);
    
    return (
        <>
            {isFetching &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(6).map((item, index) => (
                                <div key={index}>
                                    <Flex vertical={true} gap={8}>
                                        <Skeleton.Button active={true} block
                                                         style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                        <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                                    </Flex>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {!isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <FormInputDisplay label={'Number'} value={`#${invoiceDetails.Number}`} />
                        <FormInputDisplay label={'Bill To'} value={invoiceDetails.MemberNameDisplayString} />

                        {(!isNullOrEmpty(invoiceDetails.MemberEmail) && !isNullOrEmpty(invoiceDetails.InvoiceBaseDetails.HideEmailOnInvoice)) &&
                            <FormInputDisplay label={'Billing Email'} value={invoiceDetails.MemberEmail} />
                        }
                        {(!isNullOrEmpty(invoiceDetails.MemberFullAddress)) &&
                            <FormInputDisplay label={'Billing Address'} value={invoiceDetails.MemberFullAddress} />
                        }
                        <FormInputDisplay label={'Invoice Date'} value={invoiceDetails.CreatedOnDisplay} />
                        
                        {(!isNullOrEmpty(invoiceDetails.DueDate)) &&
                            <FormInputDisplay label={'Due Date'} value={invoiceDetails.DueDateDisplay} />
                        }
                        <FormInputDisplay label={'Total'} value={costDisplay(invoiceDetails.TotalAmount)} />
                        {!isNullOrEmpty(invoiceDetails.Notes) &&
                            <FormInputDisplay label={'Notes'} value={invoiceDetails.Notes} />
                        }
                        {!isNullOrEmpty(invoiceDetails.Memo) &&
                            <FormInputDisplay label={'Memo'} value={invoiceDetails.Memo} />
                        }
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default ProfileBillingInvoicePayment
