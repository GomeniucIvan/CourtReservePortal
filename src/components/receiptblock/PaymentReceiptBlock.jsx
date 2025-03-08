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
import ReceiptBlock from "@/components/receiptblock/ReceiptBlock.jsx";

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
    let selectedPaymentProfile = paymentProfiles.find(v => equalString(v.Value, formik?.values?.card_paymentProfileId));
    
    const isConveniencePayment =
        toBoolean(paymentData.UseConvenienceFee) &&
        (!toBoolean(paymentData.IsUsingPackages) || equalString(firstLevelPaymentType, "Package")) &&
        (!payWithMoneyBalance || balance < total) &&
        (isNullOrEmpty(selectedPaymentProfile?.Value) || !equalString(formik?.values?.card_accountType, '2'));
    
    let receiptItems = [];

    if(!isNullOrEmpty(subTotal)){
        receiptItems.push({
            Key: '',
            Label: 'Subtotal',
            Value: costDisplay(subTotal)
        })
    }
    
    if ((!isNullOrEmpty(balance) && balance > 0 && payWithMoneyBalance)) {
        receiptItems.push({
            Key: '',
            Label: 'Balance',
            Value: `(-${costDisplay(balance)})`
        })
    }

    if (toBoolean(isConveniencePayment)) {
        receiptItems.push({
            Key: '',
            Label: <Text>Credit Card Convenience Fee <Text style={{color: token.colorError}}>{' '} ({paymentData.ConvenienceFeePercent}%)</Text></Text>,
            Value: costDisplay(convFeeWithBalance)
        })
    }

    receiptItems.push({
        Key: 'divider'
    })

    receiptItems.push({
        Key: '',
        Label: 'Total Due',
        Value: payWithMoneyBalance ? costDisplay(convTotalFeeWithBalance) : costDisplay(convTotalFeeWithoutBalance)
    })
    
    return (
        <>
            {toBoolean(showInvoice) &&
                <ReceiptBlock receiptItems={receiptItems} />
            }
        </>
    );
}

export default PaymentReceiptBlock;