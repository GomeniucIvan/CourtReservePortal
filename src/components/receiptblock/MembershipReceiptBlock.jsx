import {anyInList, equalString, isNullOrEmpty} from "@/utils/Utils.jsx";
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

const {Title, Text} = Typography;

function MembershipReceiptBlock({selectedMembership,
                                    convenienceFeeObj,
                                    selectedPaymentFrequency,
                                    paymentTypes,
                                    accountType}) {

    let subTotal = null;
    let taxTotal = null;
    let convenienceFee = null;
    let total = null;
    let paymentFrequencyText = '';
    const {token, globalStyles} = useApp();
    let selectedPrice = '';
    const paymentFrequencyCost = membershipPaymentFrequencyCost(selectedMembership, selectedPaymentFrequency);

    if (selectedMembership) {
        selectedPrice = selectedMembership.Prices.find(price => equalString(price.CostTypeFrequency, selectedPaymentFrequency));

        subTotal = (isNullOrEmpty(paymentFrequencyCost) ? 0 : paymentFrequencyCost) + (isNullOrEmpty(selectedMembership.InitiationFeePrice) ? 0 : selectedMembership.InitiationFeePrice);

        total = subTotal;
        if (!isNullOrEmpty(selectedMembership.TaxRateId)) {
            const calculatedTaxTotal = membershipCalculateTaxProperties(selectedMembership, selectedPaymentFrequency, subTotal);
            taxTotal = isNullOrEmpty(calculatedTaxTotal) ? null : calculatedTaxTotal;
            if (!isNullOrEmpty(taxTotal)) {
                total += taxTotal;
            }
        }

        if (isNullOrEmpty(paymentTypes)) {
            paymentTypes = [];
        }

        let showConvenienceFee = false;
        if (anyInList(paymentTypes)) {
            let selectedPaymentType = paymentTypes.find(v => equalString(v.Value, accountType));

            if (!isNullOrEmpty(selectedPaymentType) && equalString(selectedPaymentType?.AccountType, 1)) {
                showConvenienceFee = true;
            }
        }

        if (!showConvenienceFee && equalString(accountType, 1)) {
            showConvenienceFee = true;
        }

        //card only
        if (showConvenienceFee) {
            const calculatedConvenienceFee = calculateConvenienceFee(/*total*/ subTotal, /*org*/ convenienceFeeObj, /*onlyFee*/ true);
            if (!isNullOrEmpty(calculatedConvenienceFee)) {
                convenienceFee = calculatedConvenienceFee;
                total += calculatedConvenienceFee;
            }
        }

        const selectedFrequencyOption = selectedMembership.Prices.find(option => equalString(option.CostTypeFrequency, selectedPaymentFrequency));
        if (!isNullOrEmpty(selectedFrequencyOption)) {
            paymentFrequencyText = selectedFrequencyOption.FullPriceDisplay;
        }
    }

    return (
        <>
            {!isNullOrEmpty(selectedMembership) &&
                <Card style={{margin: '0px'}}>
                    <Flex vertical={true} gap={8}>
                        <Flex vertical={true} gap={4}>
                            {!isNullOrEmpty(selectedMembership.InitiationFeePriceDisplay) &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Text>Initiation Fee</Text>
                                    <Text style={{textAlign: 'end'}}>{costDisplay(selectedMembership.InitiationFeePrice)}</Text>
                                </Flex>
                            }

                            <Flex align={'center'} justify={'space-between'}>
                                <Text>
                                    <Ellipsis direction='end' content={selectedMembership.Name}/>
                                </Text>
                                <Title level={4} style={{textAlign: 'end'}}>
                                    {selectedPrice?.FullPriceDisplay}
                                </Title>
                            </Flex>
                        </Flex>

                        <Divider className={globalStyles.noMargin} />

                        <Flex vertical={true} gap={4}>
                            {subTotal &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Title level={4} style={{textAlign: 'end'}}>
                                        Subtotal
                                    </Title>

                                    <Title level={4} style={{textAlign: 'end'}}>
                                        {costDisplay(subTotal)}
                                    </Title>
                                </Flex>
                            }

                            {taxTotal &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Text>
                                        Tax
                                    </Text>
                                    <Text style={{textAlign: 'end'}}>
                                        {costDisplay(taxTotal)}
                                    </Text>
                                </Flex>
                            }

                            {(!isNullOrEmpty(convenienceFeeObj) && !isNullOrEmpty(convenienceFeeObj.convenienceFeePercent) && convenienceFee > 0) &&
                                <Flex align={'center'} justify={'space-between'}>
                                    <Text>
                                        Credit Card Convenience Fee <Text style={{color: token.colorError}}>{' '} ({convenienceFeeObj.convenienceFeePercent}%)</Text>
                                    </Text>
                                    <Text style={{textAlign: 'end'}}>
                                        {costDisplay(convenienceFee)}
                                    </Text>
                                </Flex>
                            }
                        </Flex>

                        {!isNullOrEmpty(total) &&
                            <>
                                <Divider className={globalStyles.noMargin} />

                                <Flex align={'center'} justify={'space-between'}>
                                    <Title level={4} style={{textAlign: 'end'}}>
                                        Total
                                    </Title>

                                    <Title level={4} style={{textAlign: 'end'}}>
                                        {costDisplay(total)}
                                    </Title>
                                </Flex>
                            </>
                        }
                    </Flex>
                </Card>
            }
        </>
    );
}

export default MembershipReceiptBlock;