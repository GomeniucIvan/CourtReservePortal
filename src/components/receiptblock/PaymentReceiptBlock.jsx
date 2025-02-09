import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {
    calculateConvenienceFee,
    costDisplay,
    membershipCalculateTaxProperties,
    membershipPaymentFrequencyCost
} from "@/utils/CostUtils.jsx";
import {Card, Divider, Flex, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import React from "react";
import {is} from "@/components/timepicker/npm/utils/func.jsx";

const {Title, Text} = Typography;

//paymentData => ConvenienceFeePercent, ConvenienceFeeFixedAmount, UseConvenienceFee, IsUsingPackages

function PaymentReceiptBlock({formik,
                                 paymentData,
                                 payWithMoneyBalance,
                                 paymentProfiles,
                                 firstLevelPaymentType,
                                 balance,
                                 subTotal}) {
    
    const {token, globalStyles} = useApp();
    let showInvoice = !isNullOrEmpty(subTotal);

    if (!toBoolean(subTotal) || isNullOrEmpty(paymentData)) {
        return (<></>);
    }
    
    const total = subTotal;
    const amountToCalculateConvFee =
        payWithMoneyBalance && balance > 0
            ? Math.max(total - balance, 0)
            : total;

    let convFeeWithoutBalance = calculateConvenienceFee(/*total*/ total, /*org*/ paymentData, /*onlyFee*/ true);
    let convTotalFeeWithoutBalance = total + convFeeWithoutBalance;

    const convFeeWithBalance = amountToCalculateConvFee * (paymentData.ConvenienceFeePercent / 100);
    const convTotalFeeWithBalance = amountToCalculateConvFee + convFeeWithBalance;
    let selectedPaymentProfile = paymentProfiles.find(v => equalString(v.Value, formik?.values?.PaymentProfileId));
    
    const isConveniencePayment =
        toBoolean(paymentData.UseConvenienceFee) &&
        (!toBoolean(paymentData.IsUsingPackages) || equalString(firstLevelPaymentType, "Package")) &&
        (!payWithMoneyBalance || balance < total) &&
        (isNullOrEmpty(selectedPaymentProfile?.Value) || !equalString(formik?.values?.card_accountType, '2'));
    

    return (
        <>
            {toBoolean(showInvoice) &&
                <Card style={{margin: '0px'}}>
                    <Flex vertical={true} gap={8}>

                        <Flex vertical={true} gap={4}>
                            {!isNullOrEmpty(subTotal) &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Title level={4} style={{textAlign: 'end'}}>
                                        Subtotal
                                    </Title>

                                    <Title level={4} style={{textAlign: 'end'}}>
                                        {costDisplay(subTotal)}
                                    </Title>
                                </Flex>
                            }

                            {(!isNullOrEmpty(balance) && balance > 0 && payWithMoneyBalance) &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Title level={4} style={{textAlign: 'end'}}>
                                        Balance
                                    </Title>

                                    <Title level={4} style={{textAlign: 'end'}}>
                                        (-{costDisplay(balance)})
                                    </Title>
                                </Flex>
                            }
                            
                            {(toBoolean(isConveniencePayment)) &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Text>
                                        Credit Card Convenience Fee <Text style={{color: token.colorError}}>{' '} ({paymentData.ConvenienceFeePercent}%)</Text>
                                    </Text>
                                    <Text style={{textAlign: 'end'}}>
                                        {costDisplay(convFeeWithBalance)}
                                    </Text>
                                </Flex>
                            }
                        </Flex>

                        <Divider className={globalStyles.noMargin} />

                        <Flex align={'center'} justify={'space-between'}>
                            <Title level={4} style={{textAlign: 'end'}}>
                                Total Due
                            </Title>

                            <Title level={4} style={{textAlign: 'end'}}>
                                {payWithMoneyBalance
                                    ? costDisplay(convTotalFeeWithBalance)
                                    : costDisplay(convTotalFeeWithoutBalance)}
                            </Title>
                        </Flex>
                    </Flex>
                </Card>
            }
        </>
    );
}

export default PaymentReceiptBlock;