import {Button, Divider, Flex, Tag, theme, Typography} from "antd";
import {useStyles} from "./../styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import * as React from "react";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormPaymentProfile from "@/form/formpaymentprofile/FormPaymentProfile.jsx";
import MembershipReceiptBlock from "@/components/receiptblock/MembershipReceiptBlock.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";
import {useTranslation} from "react-i18next";
import {useApp} from "@/context/AppProvider.jsx";
import {parseSafeInt} from "@/utils/NumberUtils.jsx";
import {addSelectEmptyOption} from "@/utils/SelectUtils.jsx";
const {Text,Title} = Typography;

const MembershipPurchaseReview = ({selectedMembership,
                                      formik,
                                      selectedMembershipRequirePayment,
                                      signupData,
                                      showPayment,
                                      convenienceFeeObj,
                                      paymentProfileRef,
                                      paymentInfoData,
                                      showReceipt}) => {

    const {token} = useApp();
    const { t } = useTranslation('login');
    const {styles} = useStyles();

    const visibleSeparatorByKey = (key) => {
        let isMembershipVisible = !isNullOrEmpty(selectedMembership?.Name);
        let isBillingVisible = (selectedMembershipRequirePayment || toBoolean(signupData?.RequireCardOnFile));
        let isAgreementsVisible = (signupData && !isNullOrEmpty(signupData?.Disclosures) && toBoolean(signupData?.IsDisclosuresRequired));

        if (equalString(key, 'membership-billing')) {
            return isMembershipVisible && isBillingVisible;
        } else if (equalString(key, 'billing-disclosure')){
            return (isMembershipVisible || isBillingVisible) && isAgreementsVisible;
        }
    }

    return (
        <>
            {!isNullOrEmpty(selectedMembership?.Name) &&
                <>
                    <PaddingBlock onlyTop={true}>
                        <Flex vertical={true} gap={token.paddingXXL}>
                            <Title level={1}>Membership Information</Title>

                            <Flex vertical={true} gap={token.padding}>
                                <Flex vertical={true} className={styles.membershipReviewCard}>
                                    <Title level={3}>{selectedMembership?.Name}</Title>
                                    {!isNullOrEmpty(selectedMembership?.EffectiveDatesDisplay) &&
                                        <Text className={token.colorTextSecondary}>{selectedMembership?.EffectiveDatesDisplay}</Text>
                                    }
                                </Flex>

                                {anyInList(selectedMembership?.Prices) &&
                                    <FormSelect
                                        formik={formik}
                                        name='paymentFrequency'
                                        label={t(`review.form.paymentFrequency`)}
                                        options={selectedMembership?.Prices}
                                        placeholder={'Select Pricing Option'}
                                        required={moreThanOneInList(selectedMembership?.Prices)}
                                        disabled={oneListItem(selectedMembership?.Prices)}
                                        propText='FullPriceDisplay'
                                        propValue='CostTypeFrequency'
                                    />
                                }
                            </Flex>
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {visibleSeparatorByKey('membership-billing') &&
                <Divider />
            }

            {showPayment &&
                <>
                    <PaddingBlock onlyTop={!visibleSeparatorByKey('membership-billing')}>
                        <Flex vertical={true} gap={token.paddingXXL}>
                            <Title level={1}>{t(`review.paymentProfileBilling`)}</Title>

                           <Flex vertical={true} gap={token.padding}>
                               {(anyInList(signupData?.PaymentTypes)) &&
                                   <FormSelect formik={formik}
                                               name={`PaymentProfileId`}
                                               label='Payment Type'
                                               options={signupData?.PaymentTypes}
                                               required={true}
                                               propText='Text'
                                               propValue='Value'/>
                               }

                               {(isNullOrEmpty(formik?.values?.PaymentProfileId) ||
                                       equalString(formik?.values?.PaymentProfileId, 0) || 
                                       equalString(formik?.values?.PaymentProfileId, 1)) &&
                                   <Flex vertical={true} gap={token.padding}>
                                       <FormPaymentProfile formik={formik}
                                                           includeCustomerDetails={true}
                                                           allowToSavePaymentProfile={false}
                                                           ref={paymentProfileRef}
                                                           showStatesDropdown={toBoolean(signupData.ShowStatesDropdown)}
                                                           hideFields={{
                                                               firstLastName: true,
                                                               address2: true,
                                                               phoneNumber: true,
                                                               accountType: true
                                                           }}
                                                           paymentProviderData={paymentInfoData}
                                                           paymentTypes={signupData.PaymentTypes}
                                       />
                                   </Flex>
                               }
                           </Flex>
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {showReceipt &&
                <>
                    <Divider />

                    <PaddingBlock>
                        <Flex vertical={true} gap={token.paddingXXL}>
                            <Title level={1}>Payment Summary</Title>

                            <Flex vertical={true} gap={token.padding}>
                                <MembershipReceiptBlock selectedMembership={selectedMembership}
                                                        convenienceFeeObj={convenienceFeeObj}
                                                        selectedPaymentFrequency={formik?.values?.paymentFrequency}
                                                        accountType={1}/>
                            </Flex>
                        </Flex>
                    </PaddingBlock>
                </>
            }

            {visibleSeparatorByKey('billing-disclosure') &&
                <Divider />
            }

            {((signupData && !isNullOrEmpty(signupData.Disclosures) && toBoolean(signupData.IsDisclosuresRequired)) ||
                anyInList(formik?.values?.disclosures)) &&
                <PaddingBlock topBottom={!visibleSeparatorByKey('billing-disclosure')}>
                    <FormDisclosures formik={formik}
                                     disclosureHtml={signupData.Disclosures}
                                     dateTimeDisplay={signupData.WaiverSignedOnDateTimeDisplay}/>
                </PaddingBlock>
            }
        </>
    )
}

export default MembershipPurchaseReview;
