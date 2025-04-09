import {useStyles} from "./../styles.jsx";
import {Button, Flex, QRCode, Skeleton, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService from "@/api/api.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {any} from "prop-types";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
const {Title} = Typography;

function PourMyBevCart() {
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, setFooterContent, token, setIsLoading, isLoading} = useApp();
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(null);
    const [modelData, setModelData] = useState(null);

    const loadData = async () => {
        setIsFetching(true);
        const response = await apiService.get(`/api/member-portal/member/pourmybev-unpaid-transactions?orgId=${orgId}`);

        setModelData(response)
        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('')
        setHeaderRightIcons(null);
        loadData();
    }, []);

    useEffect(() => {
        if (anyInList(modelData)) {
            let paymentLists = [];

            const totalAmount = groupedData.flatMap(item => item.PurchaseList).reduce((sum, purchase) => sum + purchase.Amount, 0)
            
            let paymentData = {
                list: paymentLists,
                totalDue: totalAmount,
                requireOnlinePayment: false,
                show: totalAmount > 0
            };

            const transactionIds = groupedData.flatMap(item =>
                item.PurchaseList.map(purchase => purchase.TransactionId),
            )
            
            setFooterContent(<PaymentDrawerBottom paymentData={paymentData} group={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isFetching}
                        onClick={() => {
                            let route = toRoute(ProfileRouteNames.PROCESS_TRANSACTION_PAYMENT, 'id', orgId);
                            navigate(`${route}?payments=${transactionIds}`);
                        }}>
                    Pay
                </Button>
            </PaymentDrawerBottom>)
        }
    }, [modelData]);
    

    const groupDataByDate = () => {
        let groupedData = [];
        
        if (anyInList(modelData)) {
            groupedData = modelData.reduce((result, transaction) => {
                const date = transaction.TransactionDateDisplay
                if (!result[date]) {
                    result[date] = {
                        CreatedAt: date,
                        PurchaseList: [],
                    }
                }

                result[date].PurchaseList.push({
                    Title: `${transaction.ItemName} ${transaction.Quantity} oz`,
                    UserName: transaction.FullName,
                    Amount: transaction.AmountDue,
                    TransactionId: transaction.TransactionId,
                })

                return result
            }, {})
        }

        if (anyInList(groupedData)) {
            return Object.values(groupedData).sort((a, b) => {
                const dateA = new Date(a.CreatedAt);
                const dateB = new Date(b.CreatedAt);
                return dateA - dateB;
            });
        }

        return groupedData;
    }

    const groupedData = groupDataByDate()

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <Flex vertical={true} gap={16}>
                    {emptyArray(4).map((item, index) => (
                        <div key={index}>
                            <Flex vertical={true} gap={8}>
                                <Skeleton.Button active={true} block
                                                 style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                            </Flex>
                        </div>
                    ))}
                </Flex>
            }

            {(!isFetching) &&
                <>
                    {anyInList(groupedData) &&
                        <>
                            {groupedData?.map((item, index) => {
                                return (
                                    <Flex vertical gap={token.padding} key={index}>
                                        <Flex gap={4} align="center" justify="flex-start">
                                            <span>{item.CreatedAt}</span>
                                            <span>({item.PurchaseList?.length})</span>
                                        </Flex>
                                        {anyInList(item.PurchaseList) &&
                                            <>
                                                <Flex vertical gap={16}>
                                                    {item.PurchaseList?.map((purchase, index) => {
                                                        return (
                                                            <Flex vertical gap={2} key={index}>
                                                                <h5>{purchase.Title}</h5>
                                                                <span>{purchase.UserName}</span>
                                                                <span>{costDisplay(purchase.Amount)}</span>
                                                            </Flex>
                                                        )
                                                    })}
                                                </Flex>
                                            </>
                                        }
                                    </Flex>
                                )
                            })}
                        </>
                    }

                    {!anyInList(groupedData) &&
                        <EmptyBlock description={'No items to pay.'} removePadding={true} />
                    }
                </>
            }
        </PaddingBlock>
    )
}

export default PourMyBevCart
