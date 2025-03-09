import {Card, Typography, Divider, Skeleton, Flex} from 'antd';
import {useApp} from "@/context/AppProvider.jsx";
import React, {useEffect, useState} from "react";
import {getQueryParameter} from "@/utils/RouteUtils.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {cx} from 'antd-style';

const { Title, Text } = Typography;

function PaymentReceipt() {
    const {token,
        setIsLoading,
        shouldFetch,
        resetFetch,
        setIsFooterVisible,
        setFooterContent,
        globalStyles
    } = useApp();

    const {orgId} = useAuth();
    const [receiptData, setReceiptData] = useState(null)
    const [isFetching, setIsFetching] = useState(true)
    const location = useLocation();
    const guid = getQueryParameter(location, "guid");
    const transactionId = getQueryParameter(location, "transactionId");
    const paymentRedirect = getQueryParameter(location, "paymentRedirect");
    const navigate = useNavigate();

    const loadData = async (refresh) => {
        setIsFetching(true);
        setIsLoading(true);

        let response = await appService.get(navigate, `/app/Online/Payments/PaymentProcessed?id=${orgId}&guid=${guid}&transactionId=${transactionId}&paymentRedirect=${toBoolean(paymentRedirect)}`);

        if (toBoolean(response?.IsValid)) {
            setReceiptData(response.Data);
        } else{
            displayMessageModal({
                title: "Receipt Error",
                html: (onClose) => response.Message,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {},
            })
        }

        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        loadData();
    }, []);

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Skeleton.Button active={true} block style={{height: `350px`}}/>
                </>
            }

            {!isFetching &&
                <>
                    {!isNullOrEmpty(receiptData) &&
                        <>
                            <Card className={cx(globalStyles.cardSMPadding)} style={{ margin: 'auto'}}>

                                {!isNullOrEmpty(receiptData?.LogoUrl) &&
                                    <div style={{textAlign: 'center', marginBottom: 8}}>
                                        <img src={receiptData.LogoUrl} alt="Logo" style={{height: 50}}/>
                                    </div>
                                }

                                <Title level={4} style={{ textAlign: 'center', marginBottom: 4 }}>{receiptData.Name}</Title>

                                {!isNullOrEmpty(receiptData?.UserNames) &&
                                    <>
                                        <Text>{receiptData.UserNames}</Text>
                                        <br/>
                                    </>
                                }

                                {(!anyInList(receiptData.DescriptionDictionaryList)) &&
                                    <>
                                        {receiptData.DescriptionDictionaryList
                                            .filter((description) => equalString(description.Position, "1")) //TopCentered
                                            .map((description, index) => (
                                                <div key={index}>
                                                    <Text>
                                                        <span dangerouslySetInnerHTML={{ __html: description.Text }} />
                                                    </Text>
                                                    <br />
                                                </div>
                                            ))}
                                    </>
                                }

                                {!isNullOrEmpty(receiptData?.Description) &&
                                    <Text>{receiptData.Description}</Text>
                                }

                                {!isNullOrEmpty(receiptData?.Code) &&
                                    <>
                                        <Text>Receipt:</Text> <Text># {receiptData.Code}</Text>
                                    </>
                                }

                                {(!isNullOrEmpty(receiptData?.BusinessNumber) && toBoolean(receiptData.ShowBusinessNumberOnReceipts)) &&
                                    <>
                                        <Text>{receiptData.BusinessNumber}</Text>
                                    </>
                                }

                                <Divider dashed style={{margin: `${token.paddingSM}px 0px`}} />


                                {/* Receipt Items */}
                                {receiptData.Items.map((item, index) => {

                                    if (toBoolean(item.Header)){
                                        return (
                                            <div key={index}>
                                                <Flex justify={'space-between'}>
                                                    {!isNullOrEmpty(item.Text) &&
                                                        <Text strong>
                                                            <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                        </Text>
                                                    }

                                                    <Text strong>{item.Value}</Text>
                                                </Flex>
                                            </div>
                                        )
                                    }

                                    if (toBoolean(item.Empty)) {
                                        //??!
                                        return (
                                            <div key={index}>

                                            </div>
                                        )
                                    }

                                    if (toBoolean(item.SubFooter)){
                                        let isStrong = toBoolean(item.Bold);

                                        return (
                                            <div key={index}>
                                                <Flex justify={'space-between'}>
                                                    {!isNullOrEmpty(item.Text) &&
                                                        <Text strong={isStrong}>
                                                            <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                        </Text>
                                                    }

                                                    <Text strong={isStrong}>{item.Value}</Text>
                                                </Flex>
                                            </div>
                                        )
                                    }

                                    let showTopBorder = !isNullOrEmpty(item.Border) && (equalString(item.Border, 2) || equalString(item.Border, 0));
                                    let showBottomBorder = !isNullOrEmpty(item.Border) && (equalString(item.Border, 1) || equalString(item.Border, 0));
                                    let isStrong = toBoolean(item.Bold);

                                    return (
                                        <div key={index}>
                                            <>
                                                {toBoolean(showTopBorder) &&
                                                    <Divider dashed
                                                             style={{margin: `${token.paddingSM}px 0px`}}/>
                                                }

                                                <Flex justify={'space-between'} align={'end'}>
                                                    {!isNullOrEmpty(item.Text) &&
                                                        <Text strong={isStrong}>
                                                            <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                        </Text>
                                                    }

                                                    <Text strong={isStrong}>{item.Value}</Text>
                                                </Flex>

                                                {anyInList(item.Descriptions) &&
                                                    <>
                                                        {item.Descriptions.map((itemDescription, index) => {
                                                            let isDescriptionStrong = toBoolean(itemDescription.Bold);

                                                            return (
                                                                <Flex justify={'space-between'} key={`description_${index}_${itemDescription.Text}`}>
                                                                    {!isNullOrEmpty(itemDescription.Text) &&
                                                                        <Text strong={isDescriptionStrong}>
                                                                                <span
                                                                                    dangerouslySetInnerHTML={{__html: itemDescription.Text}}/>
                                                                        </Text>
                                                                    }

                                                                    <Text strong={isDescriptionStrong}>{itemDescription.Value}</Text>
                                                                </Flex>
                                                            )
                                                        })}
                                                    </>
                                                }


                                                {toBoolean(showBottomBorder) &&
                                                    <Divider dashed
                                                             style={{margin: `${token.paddingSM}px 0px`}}/>
                                                }
                                            </>
                                        </div>
                                    )
                                })}

                                {/* Footer Descriptions */}
                                {anyInList(receiptData.DescriptionDictionaryList) && receiptData.DescriptionDictionaryList.some(v => (equalString(v.Position, 3) || equalString(v.Position, 4))) &&
                                    <>
                                        <Divider dashed style={{margin: `${token.paddingSM}px 0px`}}/>
                                        
                                        {receiptData.DescriptionDictionaryList.map((item, index) => {
                                            //bottom-left
                                            if (equalString(item.Position, 3)) {
                                                return (
                                                    <Flex key={index}>
                                                        {!isNullOrEmpty(item.Text) &&
                                                            <Text>
                                                                <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                            </Text>
                                                        }
                                                    </Flex>
                                                )
                                            }

                                            //bottom-right
                                            if (equalString(item.Position, 4)) {
                                                return (
                                                    <Flex key={index} justify={'end'}>
                                                        {!isNullOrEmpty(item.Text) &&
                                                            <Text>
                                                                <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                            </Text>
                                                        }
                                                    </Flex>
                                                )
                                            }
                                            
                                            return (
                                                <Flex key={index}>
                                                  <span></span>
                                                </Flex>
                                            )
                                        })}
                                    </>
                                }

                                {anyInList(receiptData.DescriptionDictionaryList) && receiptData.DescriptionDictionaryList.some(v => (equalString(v.Position, 6))) &&
                                    <>
                                        <Divider dashed style={{margin: `${token.paddingSM}px 0px`}}/>

                                        {receiptData.DescriptionDictionaryList.map((item, index) => {
                                            //BottomFullLine
                                            if (equalString(item.Position, 6)) {
                                                return (
                                                    <Flex key={index}>
                                                        {!isNullOrEmpty(item.Text) &&
                                                            <Text>
                                                                <span dangerouslySetInnerHTML={{__html: item.Text}}/>
                                                            </Text>
                                                        }
                                                    </Flex>
                                                )
                                            }

                                            return (
                                                <Flex key={index}>
                                                    <span></span>
                                                </Flex>
                                            )
                                        })}
                                    </>
                                }
                            </Card>
                        </>
                    }
                </>
            }
        </PaddingBlock>
    )
}

export default PaymentReceipt
