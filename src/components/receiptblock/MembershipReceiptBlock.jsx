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
import ReceiptBlock from "@/components/receiptblock/ReceiptBlock.jsx";

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
    }

    let receiptItems = [];

    if (selectedMembership != null) {
        if(!isNullOrEmpty(selectedMembership?.InitiationFeePriceDisplay)){
            receiptItems.push({
                Key: 'Text',
                Label: 'Initiation Fee',
                Value: costDisplay(selectedMembership?.InitiationFeePrice)
            })
        }

        receiptItems.push({
            Key: 'Text',
            Label: <Ellipsis direction='end' content={selectedMembership.Name}/>,
            Value: selectedPrice?.FullPriceDisplay
        })

        receiptItems.push({
            Key: 'divider'
        })

        if(!isNullOrEmpty(subTotal)){
            receiptItems.push({
                Key: '',
                Label: 'Subtotal',
                Value: costDisplay(subTotal)
            })
        }

        if(!isNullOrEmpty(taxTotal)){
            receiptItems.push({
                Key: 'Text',
                Label: 'Tax',
                Value: costDisplay(taxTotal)
            })
        }

        if(!isNullOrEmpty(convenienceFeeObj) && !isNullOrEmpty(convenienceFeeObj.convenienceFeePercent) && convenienceFee > 0) {
            receiptItems.push({
                Key: 'Text',
                Label: <Text>
                            Credit Card Convenience Fee <Text style={{color: token.colorError}}>{' '} ({convenienceFeeObj.convenienceFeePercent}%)</Text>
                        </Text>,
                Value: costDisplay(convenienceFee)
            })
        }

        if(!isNullOrEmpty(taxTotal)) {
            receiptItems.push({
                Key: 'divider'
            })
            
            receiptItems.push({
                Key: '',
                Label: 'Total',
                Value: costDisplay(total)
            })
        }
        
    }
    
    return (
        <>
            {!isNullOrEmpty(selectedMembership) &&
               <ReceiptBlock receiptItems={receiptItems} />
            }
        </>
    );
}

export default MembershipReceiptBlock;