import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge, Card, Divider} from "antd";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import * as React from "react";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import Modal from "@/components/modal/Modal.jsx";
const {Title, Text} = Typography;

//ProfileRouteNames.PROFILE_BILLING_INVOICE_DETAILS
function ProfileBillingInvoiceDetails() {
    const navigate = useNavigate();
    const [invoiceDetails, setInvoiceDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [selectedInvoiceItem, setSelectedInvoiceItem] = useState(null);
    const {setHeaderRightIcons} = useHeader();
    const {orgId} = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const invoiceId = queryParams.get("invoiceId");

    const {
        token,
        setIsFooterVisible,
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
                            let route = toRoute(ProfileRouteNames.PROFILE_INVOICE_PAY, 'id', orgId);
                            navigate(`${route}?invoiceId=${invoiceDetails.Id}`);
                        }}>
                    Pay Invoice
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

                        {anyInList(invoiceDetails?.InvoiceItems) &&
                            <>
                                {invoiceDetails.InvoiceItems.map((invoiceItem, index) => {
                                    return (
                                        <React.Fragment key={index}>
                                            <Card>
                                                <Flex vertical={true} gap={token.paddingSM}>
                                                    <Flex vertical={true} gap={token.paddingXXS}>
                                                        <Title level={4}>{invoiceItem.BuildName} x {invoiceItem.Quantity}</Title>
                                                        <Text>{costDisplay(invoiceItem.TotalAmount)}</Text>
                                                    </Flex>
                                                    <Button block={true} onClick={() => {setSelectedInvoiceItem(invoiceItem)}}>
                                                        View {countListItems(invoiceDetails.InvoiceItemDetails.filter(v => equalString(v.InvoiceItemId, invoiceItem.InvoiceItemId)))} item(s)
                                                    </Button>
                                                </Flex>
                                            </Card>
                                        </React.Fragment>
                                    )
                                })}
                            </>
                        }

                        {!isNullOrEmpty(invoiceDetails.Notes) &&
                            <FormInputDisplay label={'Notes'} value={invoiceDetails.Notes} />
                        }
                        {!isNullOrEmpty(invoiceDetails.Memo) &&
                            <FormInputDisplay label={'Memo'} value={invoiceDetails.Memo} />
                        }
                    </Flex>

                    <Modal show={!isNullOrEmpty(selectedInvoiceItem)}
                           onClose={() => {setSelectedInvoiceItem(null)}}
                           showConfirmButton={false}
                           title={`${selectedInvoiceItem?.BuildName} Items`}>
                        <>
                            {anyInList(invoiceDetails?.InvoiceItemDetails.filter(v => equalString(v.InvoiceItemId, selectedInvoiceItem?.InvoiceItemId))) &&
                                <>
                                    {invoiceDetails?.InvoiceItemDetails.filter(v => equalString(v.InvoiceItemId, selectedInvoiceItem?.InvoiceItemId)).map((invoice, index) => {
                                        let isLastItem = index === invoiceDetails?.InvoiceItemDetails.filter(v => equalString(v.InvoiceItemId, selectedInvoiceItem?.InvoiceItemId)).length - 1;

                                        return (
                                            <React.Fragment key={index}>
                                                <>
                                                    <PaddingBlock>
                                                        <Flex vertical={true} gap={token.paddingXXS}>
                                                            <Text>{invoice.Description}</Text>
                                                            <Text>{invoice.DateTimeDisplay}</Text>
                                                            <Text>{costDisplay(invoice.Amount)}</Text>
                                                        </Flex>
                                                    </PaddingBlock>

                                                    {!isLastItem &&
                                                        <Divider style={{margin: `${token.paddingSM}px 0`}} />
                                                    }
                                                </>
                                            </React.Fragment>
                                        )})}
                                </>
                            }
                        </>
                    </Modal>
                </PaddingBlock>
            }
        </>
    )
}

export default ProfileBillingInvoiceDetails
