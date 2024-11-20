import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import {Button, Descriptions, Divider, Empty, Flex, Input, Skeleton, Tag, Typography} from 'antd';
import {anyInList, isNullOrEmpty, nullToEmpty, toBoolean} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import apiService from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {cx} from "antd-style";
import {countListItems, emptyArray} from "../../../utils/ListUtils.jsx";
import {Card, Ellipsis} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import * as React from "react";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {getMembershipText} from "../../../utils/TranslateUtils.jsx";
import LoginCreateAccountReviewModal from "./Login.CreateAccountReviewModal.jsx";

const {Text, Title, Link} = Typography;

function LoginMemberships() {
    const {formikData, setFormikData, setIsLoading, globalStyles, token, setIsFooterVisible, setFooterContent} = useApp();
    const {t} = useTranslation('login');
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(true);
    const [memberships, setMemberships] = useState(null);
    const [viewMembership, setViewMembership] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(null);
    
    const email = formikData?.email;
    const password = formikData?.password;
    const confirmPassword = formikData?.confirmPassword;
    const selectedOrgId = formikData?.selectedOrgId;
    const skipReview = formikData?.skipReview;
    const spGuideId = formikData?.spGuideId;
    const { styles } = useStyles();

    useEffect(() => {
        setIsFooterVisible(false);
        setFooterContent('');

        if (isNullOrEmpty(email) ||
            isNullOrEmpty(password) ||
            isNullOrEmpty(confirmPassword) ||
            isNullOrEmpty(selectedOrgId)){
            navigate(AuthRouteNames.LOGIN_GET_STARTED);
        } else{
            loadMemberships();   
        }
    }, []);

    const getMembershipInitialValues = (incData) => {
        let values = incData;
        if (values){
            values.selectedMembership = {};
            values.selectedMembershipId = '';
            values.reviewModalTitle = '';
        }

        return values;
    }

    const loadMemberships = async () => {
        if (isNullOrEmpty(memberships)) {
            setIsFetching(true);
            setIsLoading(true);
            const response = await apiService.get(`/api/create-account/membership-signup-form?orgId=${nullToEmpty(selectedOrgId)}&spGuideId=${nullToEmpty(spGuideId)}`);

            if (response.IsValid) {
                setMemberships(response.Data);
            }

            setIsFetching(false);
            setIsLoading(false);
        }
    }

    const validationSchema = Yup.object({
        email: Yup.string().required(t('common:requiredMessage', {label: t('getStarted.form.email')}))
    });

    const formik = useFormik({
        initialValues: getMembershipInitialValues(formikData),
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            let costType = values.selectedMembership;
            
            if (costType && costType.OneFreePaymentOption && toBoolean(skipReview)) {
                formik.setFieldValue('selectedMembershipId', costType.CostTypeId)
                formik.setFieldValue('reviewModalTitle', `You are going to join the <b>${getMembershipText(costType?.Name)}</b> and create an account. Review the information provided and confirm before creating your account.` )
                setShowReviewModal(true);
            } else {
                setFormikData(values);
                navigate(AuthRouteNames.LOGIN_REVIEW);
            }
        },
    });

    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(8).map((item, index) => (
                            <div key={index}>
                                <Skeleton.Button active={true} block style={{height: `180px`}}/>
                            </div>
                        ))}
                    </Flex>
                </>
            }

            {!isFetching &&
                <>
                    {!anyInList(memberships) ? (
                        <Empty />
                    ) : (
                        <Flex vertical={true} gap={token.padding}>
                            {memberships.map((membership, index) => {
                                return (
                                    <Card key={index}
                                          className={cx(globalStyles.card,
                                              globalStyles.noPadding,
                                              styles.membershipCard,
                                              (toBoolean(membership?.IsFull) || toBoolean(membership?.AllowedForFamilies)) && styles.membershipWithTags )}>

                                        <PaddingBlock topBottom={true}>
                                            <Flex align={'center'} vertical={true}>
                                                {(toBoolean(membership?.IsFull) || toBoolean(membership?.AllowedForFamilies)) &&
                                                    <Flex gap="4px" className={styles.membershipTags}>
                                                        {membership.IsFull &&
                                                            <Tag color="#f50">{t(`membership.full`)}</Tag>
                                                        }

                                                        {membership.AllowedForFamilies &&
                                                            <Tag color="#108ee9">{t(`membership.familyMembership`)}</Tag>
                                                        }
                                                    </Flex>
                                                }

                                                <Title level={4}>{membership?.Name}</Title>

                                                {!isNullOrEmpty(membership?.EffectiveFromDateDisplay) &&
                                                    <Text>{t('membership.effective', {date: membership.EffectiveFromDateDisplay})}</Text>
                                                }

                                                {toBoolean(membership?.IsFree) &&
                                                    <Title level={1}>{t(`membership.free`)}</Title>
                                                }
                                                {!toBoolean(membership?.IsFree) &&
                                                    <Title level={1}>
                                                        <div dangerouslySetInnerHTML={{__html: membership?.StartingPriceHtml}}/>
                                                    </Title>
                                                }

                                                {!isNullOrEmpty(membership?.InitiationFeeDisplay) &&
                                                    <Text level={1} style={{fontSize: `${token.fontSizeSM}px`}}>
                                                        {t('membership.initiationFee', {price: membership.InitiationFeeDisplay})}
                                                    </Text>
                                                }

                                                {toBoolean(membership?.IsRestrictByAge) &&
                                                    <Tag color="warning"> {t(`membership.ageRestrictionMessage`)}</Tag>
                                                }
                                            </Flex>
                                        </PaddingBlock>
                                        <div className={styles.membershipFooterBlock}>
                                            <PaddingBlock topBottom={true}>
                                                <Flex vertical={true} gap={token.paddingSM}>
                                                    {!isNullOrEmpty(membership?.Description) &&
                                                        <Flex justify={'center'}>
                                                            <Text style={{fontSize: `${token.fontSizeSM}px`}}>
                                                                {membership.Description}
                                                            </Text>
                                                        </Flex>
                                                    }

                                                    <Button type='primary' onClick={() => {
                                                        formik.setFieldValue('selectedMembership', membership);
                                                        formik.submitForm();
                                                    }}>
                                                        {t(`membership.selectPlan`)}
                                                    </Button>

                                                    {!isNullOrEmpty(membership?.ShowAdditionalDetails) &&
                                                        <Flex justify={'center'}>
                                                            <Link underline onClick={() => {
                                                                setViewMembership(membership);
                                                            }}>
                                                                {t(`membership.seeDetails`)}
                                                            </Link>
                                                        </Flex>
                                                    }
                                                </Flex>
                                            </PaddingBlock>
                                        </div>
                                    </Card>
                                )
                            })}
                        </Flex>
                    )}
                </>
            }

            <DrawerBottom showDrawer={!isNullOrEmpty(viewMembership)}
                          closeDrawer={() => setViewMembership(null)}
                          showButton={true}
                          customFooter={<Flex gap={token.padding}>
                              <Button block onClick={() => {
                                  setViewMembership(null);
                              }}>
                                  {t(`searchOrganization.drawer.close`)}
                              </Button>

                              <Button type={'primary'} block onClick={() => {
                                  formik.setFieldValue('selectedMembership', viewMembership);
                                  formik.submitForm();
                              }}>
                                  {t(`membership.selectPlan`)}
                              </Button>
                          </Flex>}
                          label={viewMembership?.Name}>

                <PaddingBlock>
                    {!isNullOrEmpty(viewMembership?.EffectiveFromDateDisplay) &&
                        <Text>
                            {t('membership.effective', {date: viewMembership.EffectiveFromDateDisplay})}
                        </Text>
                    }

                    {!isNullOrEmpty(viewMembership?.PaymentOptionsBrDisplay) &&
                        <>
                            <Title level={4}>
                                {t(`membership.paymentOptions`)}
                            </Title>

                            <div style={{
                                fontSize: `${token.fontSize}px`,
                                paddingTop: `${token.paddingSM}px`,
                                paddingBottom: `${token.paddingSM}px`
                            }}>
                                <div dangerouslySetInnerHTML={{__html: viewMembership?.PaymentOptionsBrDisplay}}/>

                                {!isNullOrEmpty(viewMembership.InitiationFeeDisplay) &&
                                    <div>
                                        (+ {t('membership.initiationFee', {price: viewMembership.InitiationFeeDisplay})})
                                    </div>
                                }
                            </div>
                        </>
                    }

                    {!isNullOrEmpty(viewMembership?.Description) &&
                        <Text style={{
                            fontSize: `${token.fontSizeSM}px`, 
                            paddingBottom: `${token.paddingSM}px`,
                            color: `${token.colorSecondary}`,
                            display: 'block'
                        }}>
                            {viewMembership.Description}
                        </Text>
                    }

                    {toBoolean(viewMembership?.IsRestrictByAge) &&
                        <div>
                            <Tag color="warning"> {t(`membership.ageRestrictionMessage`)}</Tag>
                        </div>
                    }

                    {anyInList(viewMembership?.Features) &&
                        <>
                            <Divider style={{margin: `${token.paddingSM}px 0px`}} />
                            
                            {viewMembership.Features.filter(feature => feature.trim() !== '').map((feature, index) => {
                                return (
                                    <Text key={index}>
                                        {feature}
                                    </Text>
                                );
                            })}
                        </>
                    }
                </PaddingBlock>
            </DrawerBottom>

            <LoginCreateAccountReviewModal formik={formik} show={showReviewModal} setShow={setShowReviewModal}/>
        </PaddingBlock>
    )
}

export default LoginMemberships
