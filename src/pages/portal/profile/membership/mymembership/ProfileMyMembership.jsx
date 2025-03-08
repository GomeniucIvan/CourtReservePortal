import {useNavigate} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Tabs, Tag, Typography} from "antd";
import mockData from "@/mocks/personal-data.json";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import appService from "@/api/app.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import apiService from "@/api/api.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import portalService from "@/api/portal.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {any} from "prop-types";
import Modal from "@/components/modal/Modal.jsx";
import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
const {Title,Link,Text} = Typography;

function ProfileMyMembership() {
    const navigate = useNavigate();
    const [apiData, setApiData] = useState(null);
    const [membershipData, setMembershipData] = useState(null);
    const [billingItems, setBillingItems] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [showCancelMembership, setShowCancelMembership] = useState(false);
    const [cancelMembershipData, setCancelMembershipData] = useState(false);
    const [openNetworkLocations, setOpenNetworkLocations] = useState(false);
    const [networkLocations, setNetworkLocations] = useState(null);
    const {orgId, authData} = useAuth();
    const {tagStyles} = useCombinedStyles();
    
    const {setHeaderRightIcons} = useHeader();

    const {
        setIsFooterVisible,
        setFooterContent,
        setIsLoading,
        globalStyles,
        token,
        isLoading
    } = useApp();

    const hasParentOrg = () => {
        return !isNullOrEmpty(membershipData?.BillingDetails?.ParentOrgId) &&
            !equalString(membershipData?.BillingDetails?.ParentOrgId != orgId);
    }

    const loadMembershipBilling = async (data) => {
        if (data?.BillingDetails?.Amount > 0 && !hasParentOrg()) {
            let url = `/app/Online/MyProfile/GetMembershipBillingCycles?id=${orgId}&membershipId=${data?.BillingDetails?.Id}&isAjaxCall=true`;
            if (toBoolean(data?.IsFamilyLevel)) {
                url = `/app/Online/MyProfile/GetFamilyMembershipBillingCycles?id=${orgId}&membershipId=${data?.BillingDetails?.Id}&isAjaxCall=true`;
            }

            let response = await appService.get(navigate,url);
            setBillingItems(response?.Data || []);
        }
    }

    useEffect(() => {
        const loadCancelMembershipData = async () => {

            if (toBoolean(showCancelMembership) && isNullOrEmpty(cancelMembershipData?.MembershipName)) {
                let url = `/app/Online/MyProfile/CancelMembership?id=${orgId}&isApiCall=true`;
                if (toBoolean(membershipData?.IsFamilyLevel)) {
                    url = `/app/Online/MyProfile/CancelFamilyMembership?id=${orgId}&isApiCall=true`;
                }

                let response = await appService.get(navigate, url);
                if (toBoolean(response?.isValid)) {
                    setCancelMembershipData(response.Data);
                }
            }
        }

        loadCancelMembershipData();
    }, [showCancelMembership])

    useEffect(() => {
        const loadMembershipData = async () => {
            if (toBoolean(openNetworkLocations) && isNullOrEmpty(openNetworkLocations)) {
                let response = await apiService.post(`/api/membership-management/get-membership-locations?orgId=${orgId}&memberMembershipId=${(!toBoolean(membershipData?.IsFamilyLevel) ? membershipData?.BillingDetails?.Id : '')}&familyMembershipId=${(toBoolean(membershipData?.IsFamilyLevel) ? membershipData?.BillingDetails?.Id : '')}&costTypeId=${membershipData?.BillingDetails?.CostTypeId}`)
                setNetworkLocations(response.Data || []);
            }
        }

        loadMembershipData();
    }, [openNetworkLocations])

    const tabContent = (key) => {
        if (equalString(key, 'features')) {
            return (
                <PaddingBlock>
                    <Flex vertical={true} gap={token.paddingLG}>
                        {anyInList(apiData?.Features) &&
                            <>
                                {apiData?.Features.map((feature, index) => {
                                    return (
                                        <div key={index}>
                                            <CardIconLabel
                                                icon='circle-check-regular'
                                                description={feature.FeatureDescription} />
                                        </div>
                                    )
                                })}
                            </>
                        }
                        {anyInList(apiData?.AdditionalFeatures) &&
                            <>
                                {apiData?.AdditionalFeatures.map((feature, index) => {
                                    return (
                                        <div key={index}>
                                            <CardIconLabel
                                                icon='circle-check-regular'
                                                description={feature.FeatureDescription} />
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            )
        }
        
        if (equalString(key, 'billingcycles')) {
            return (
                <PaddingBlock>
                    {anyInList(billingItems) &&
                        <>
                            {billingItems.slice(0, 5).map((billingItem, index) => {
                                return (
                                    <Card key={index} className={globalStyles.card}>
                                        <Flex vertical={true} gap={4}>
                                            <Flex justify='space-between'>
                                                <Title level={4}>{billingItem.PeriodDisplay}</Title>
                                                <Tag className={cx(globalStyles.tag, toBoolean(billingItem?.IsPaid)&& tagStyles.success, !toBoolean(billingItem?.IsPaid) && tagStyles.error)}>
                                                    {toBoolean(billingItem?.IsPaid) ? 'Paid' : 'Unpaid'}
                                                </Tag>
                                            </Flex>
                                            <Flex justify='space-between'>
                                                <Text>{billingItem.AmtDisplay}</Text>
                                                <Text>{billingItem.PaidOnDisplay}</Text>
                                            </Flex>
                                        </Flex>
                                    </Card>
                                )
                            })}
                        </>
                    }
                </PaddingBlock>
            )
        }
    }

    const validationSchema = Yup.object({

    });

    const formik = useCustomFormik({
        initialValues: {enrollAutoPay: ''},
        validationSchema: validationSchema,
        onSubmit: async (values, {setStatus, setSubmitting }) => {

        },
    });

    const cancelValidationSchema = Yup.object({
        reason: Yup.string().required('Cancellation Reason is required.')
    });

    const cancelFormik = useCustomFormik({
        initialValues: {reason: ''},
        validationSchema: cancelValidationSchema,
        onSubmit: async (values, {setStatus, setSubmitting }) => {
            setIsLoading(true);

            let url = `/app/Online/MyProfile/CancelMembership?id=${orgId}&isApiCall=true`;
            if (toBoolean(cancelMembershipData?.IsFamilyLevel)) {
                url = `/app/Online/MyProfile/CancelFamilyMembership?id=${orgId}&isApiCall=true`;
            }

            let postModel = cancelMembershipData;
            postModel.EndReason = values.reason;
            postModel.IsApiCall = true;

            let response = await appService.post(url, postModel);
            if (toBoolean(response?.isValid)) {
                loadData();
            } else {
                //error
            }

            setCancelMembershipData(null);
            setShowCancelMembership(false);
            setIsLoading(false);
        },
    });

    const loadData = async () => {
        setIsFetching(true);

        let response = await appService.get(navigate, `/app/Online/MyProfile/MyMembership?id=${orgId}&isAjaxCall=true`);

        if (toBoolean(response?.IsValid)) {
            if (!isNullOrEmpty(response?.redirectUrl)) {
                navigate(response?.redirectUrl)
            } else {
                let costTypeId = response.data?.Membership?.Id;

                if (!isNullOrEmpty(costTypeId)) {
                    let responseCostType = await apiService.get(`/api/membership-member-portal/get-list?orgId=${orgId}&membershipId=${costTypeId}&flowName=my-membership`);
                    if (anyInList(responseCostType?.MembershipsData)) {
                        setApiData(responseCostType?.MembershipsData[0]);
                    }

                    setMembershipData(response.data);
                    formik.setFieldValue('enrollAutoPay',  toBoolean(response.data?.AllowAutoPay));
                    setIsFetching(false);

                    await loadMembershipBilling(response.data);
                }
            }

            setIsFetching(false);
        }
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')
        setFooterContent('');

        loadData();
    }, [])

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.enrollAutoPay)) {

        }
    }, [formik?.values?.enrollAutoPay])

    const navigateToManageMembership = () => {
        let route = toRoute(ProfileRouteNames.PROFILE_MEMBERSHIP, 'id', membershipData?.BillingDetails?.ParentOrgId);
        navigate(route);
    }

    let showPayMembershipDues = (toBoolean(membershipData?.AllowPayOnline) && toBoolean(membershipData?.HasUnpaidBillingCycles) && !toBoolean(membershipData?.BillingDetails?.IsSuspended));
    let showCancelMembershipBtn = (isNullOrEmpty(membershipData?.BillingDetails?.EndDate) && !toBoolean(membershipData?.BillingDetails?.IsSuspended)) && (!toBoolean(membershipData?.Membership?.DontAllowMembersToCancelMembership));
    let showPrePurchaseOrChangeMembership = (!isNullOrEmpty(membershipData?.BillingDetails?.EndDate) && !toBoolean(membershipData?.Membership?.DontAllowMembersToCancelMembership) && !toBoolean(membershipData?.BillingDetails?.IsSuspended));

    const tabItems = [];

    if (anyInList(billingItems)) {
        tabItems.push({
            label: toBoolean(authData?.AllowNetworkMemberships) ? 'Billing' : 'Billing Cycles',
            key: 'billingcycles',
            children: tabContent('billingcycles')
        });
    }

    if (anyInList(apiData?.Features) || anyInList(apiData?.AdditionalFeatures)) {
        tabItems.push({
            label: 'Features',
            key: 'features',
            children: tabContent('features')
        });
    }

    return (
        <>
            <PaddingBlock topBottom={true}>
                {isFetching &&
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(4).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                }

                {!isFetching &&
                    <>
                        <Flex vertical={true}>
                            <Flex vertical={true} gap={token.paddingSM}>
                                {(anyInList(apiData?.Badges) || toBoolean(apiData?.BillingDetails?.IsSuspended)) &&
                                    <>
                                        <Flex gap={4}>
                                            {anyInList(apiData?.Badges) &&
                                                <>
                                                    {apiData.Badges.map((badge, index) => {
                                                        return (
                                                            <Tag key={index}
                                                                 className={globalStyles.tag}
                                                                 style={{
                                                                     backgroundColor: badge.BackgroundColor,
                                                                     borderColor: badge.BackgroundColor,
                                                                     color: badge.TextColor
                                                                 }}>{badge.BadgeName}</Tag>
                                                        )
                                                    })}
                                                </>
                                            }

                                            {toBoolean(membershipData?.BillingDetails?.IsSuspended) &&
                                                <Tag className={cx(globalStyles.tag)}>Suspended</Tag>
                                            }
                                        </Flex>
                                    </>
                                }

                                <Title level={1}>{membershipData?.BillingDetails?.PlanName}</Title>
                            </Flex>

                            {(toBoolean(membershipData?.BillingDetails?.IsExpired) && !toBoolean(membershipData?.BillingDetails?.IsSuspended)) &&
                                <>
                                    <Divider style={{margin: `${token.paddingXL}px 0px`}}/>

                                    <AlertBlock type="danger"
                                                title={'Membership Overdue'}
                                                description={'Membership Dues are past due.'}
                                                removePadding={true}
                                                buttonText={hasParentOrg() ? 'Review' : ''}
                                                onButtonClick={() => {
                                                    if (hasParentOrg()) {
                                                        navigateToManageMembership()
                                                    }
                                                }}/>
                                </>
                            }

                            <Divider style={{margin: `${token.paddingXL}px 0px`}}/>

                            <Flex vertical={true} gap={token.paddingXXL}>
                                <Flex vertical={true} gap={token.paddingMD}>
                                    <Title level={3}>Membership Details</Title>

                                    {toBoolean(authData?.AllowNetworkMemberships) &&
                                        <>
                                            <AlertBlock type="info"
                                                        title={'Network Locations'}
                                                        description={'This membership has access to multiple locations.'}
                                                        buttonText={'See All'}
                                                        onButtonClick={() => {
                                                            setOpenNetworkLocations(true);
                                                        }}
                                                        removePadding={true} />
                                        </>
                                    }

                                    {(hasParentOrg()) &&
                                        <>
                                            <Flex vertical={true} gap={8}>
                                                <Text>
                                                    Primary Location: {isNullOrEmpty(membershipData?.BillingDetails?.ParentOrganizationName) ? authData?.OrgName : membershipData?.BillingDetails?.ParentOrganizationName}
                                                </Text>

                                                {toBoolean(hasParentOrg()) &&
                                                    <Text>
                                                        To cancel, change, or pay for your membership, please switch to your primary location.
                                                    </Text>
                                                }

                                            </Flex>

                                            {toBoolean(hasParentOrg()) &&
                                                <div>
                                                    <Link onClick={navigateToManageMembership}
                                                          block={true}>
                                                        Manage Membership
                                                        {' '}<SVG icon={'drawer-up'} />
                                                    </Link>
                                                </div>
                                            }
                                        </>
                                    }

                                    <Flex vertical={true} gap={token.paddingXS}>
                                        <Title level={3}>
                                            Details
                                        </Title>

                                        {membershipData?.BillingDetails?.Amount > 0 &&
                                            <CardIconLabel icon={'money'} description={<>
                                                <Text>Membership Price: {costDisplay(membershipData?.BillingDetails?.Amount)} / {membershipData?.BillingDetails?.FrequencyDisplay}</Text>

                                                {!isNullOrEmpty(membershipData?.BillingDetails?.TaxMessage) &&
                                                    <span dangerouslySetInnerHTML={{ __html: membershipData?.BillingDetails?.TaxMessage }}></span>
                                                }
                                            </>}/>
                                        }

                                        {!equalString(membershipData?.BillingDetails?.Frequency, 5) &&
                                            <>
                                                <CardIconLabel icon={'register'} description={<>
                                                    {!isNullOrEmpty(membershipData?.BillingDetails?.LastPaymentDateDisplay) ? (
                                                        <Text>Last Billing Date: {membershipData?.BillingDetails?.LastPaymentDateDisplay}</Text>
                                                    ) : (
                                                        <Text>Last Billing Date: N/A</Text>
                                                    )}
                                                </>}/>

                                                {!isNullOrEmpty(membershipData?.BillingDetails?.NextPaymentDate) &&
                                                    <CardIconLabel
                                                        icon='calendar-time'
                                                        description={<Text>
                                                            Next Billing Date: {membershipData?.BillingDetails?.NextPaymentDateDisplay}

                                                            {toBoolean(membershipData?.BillingDetails?.PastPaymentDate) &&
                                                                <span style={{ verticalAlign: 'bottom' }}>
                                                                    <Tag style={{ marginLeft: '12px' }} className={cx(globalStyles.tag, tagStyles.error)}>Past Due</Tag>
                                                                </span>
                                                            }

                                                        </Text>} />
                                                }

                                                {isNullOrEmpty(membershipData?.BillingDetails?.NextPaymentDate) &&
                                                    <CardIconLabel
                                                        icon='calendar-time'
                                                        description={'Next Billing Date: N/A'} />
                                                }
                                            </>
                                        }

                                        {toBoolean(membershipData?.BillingDetails?.ShowExpiresDate) &&
                                            <CardIconLabel
                                                icon='event-dates'
                                                description={`Expires On: ${membershipData?.BillingDetails?.ExpiresOnDisplay}`} />
                                        }

                                        {!isNullOrEmpty(membershipData?.BillingDetails?.EndDate) &&
                                            <CardIconLabel
                                                icon='calendar'
                                                description={`Ending On: ${membershipData?.BillingDetails?.MembershipActiveUntilDate}`} />
                                        }

                                        {toBoolean(membershipData?.HasPrepaidMembership) &&
                                            <CardIconLabel
                                                icon='landing-page'
                                                description={`Upcoming Membership: ${membershipData?.PrepaidMembershipDisplay}`} />
                                        }

                                        {(toBoolean(membershipData?.BillingDetails?.IsSuspended) && !isNullOrEmpty(membershipData?.BillingDetails?.Note)) &&
                                            <CardIconLabel
                                                icon='rec'
                                                iconColor={token.colorError}
                                                description={<Text style={{color: colorError}}>Suspended Reason: {membershipData?.BillingDetails?.Note}</Text>} />
                                        }

                                        {(toBoolean(membershipData?.HasOnlinePaymentProfile) &&
                                                toBoolean(membershipData?.AllowPayOnline) &&
                                                membershipData?.BillingDetails?.Amount > 0 &&
                                                (!toBoolean(authData?.IsUsingBatchBilling) || !toBoolean(authData?.PreventPlayersFromAutoPayMembershipDuesOptIn) &&
                                                    !equalString(membershipData?.BillingDetails?.Frequency, 5))) &&

                                            <>
                                                {!toBoolean(authData?.AutoPayMembershipOnMemberPortal) &&
                                                    <FormSwitch label={'Enroll in Auto-Pay'}
                                                                formik={formik}
                                                                tooltip={'Please check the box to allow your membership dues to be automatically deducted from your billing profile.'}
                                                                name={'enrollAutoPay'}/>
                                                }

                                                {toBoolean(authData?.AutoPayMembershipOnMemberPortal) &&
                                                    <CardIconLabel
                                                        icon='alert-custom'
                                                        iconColor={'yellow'}
                                                        description={<Text>By purchasing this membership, you agree to have your membership dues automatically debited.</Text>} />
                                                }
                                            </>
                                        }
                                    </Flex>
                                </Flex>

                                {(toBoolean(showPayMembershipDues) || toBoolean(showCancelMembershipBtn) || toBoolean(showPrePurchaseOrChangeMembership)) &&
                                    <>
                                        <Flex gap={token.padding} vertical={true}>
                                            {showPayMembershipDues &&
                                                <Button type='primary'
                                                        block={true}
                                                        onClick={() => {
                                                            let route = toRoute(ProfileRouteNames.PROFILE_PAY_MY_MEMBERSHIP, 'id', orgId);
                                                            navigate(route);
                                                        }}
                                                >
                                                    Pay Membership Dues
                                                </Button>
                                            }

                                            {showCancelMembershipBtn &&
                                                <>
                                                    <Button ghost type='primary'
                                                            block={true}
                                                            onClick={() => {
                                                                let route = toRoute(HomeRouteNames.MEMBERSHIPS, 'id', orgId);
                                                                navigate(route);
                                                            }}
                                                    >
                                                        Change Membership
                                                    </Button>


                                                    <Button danger
                                                            block={true}
                                                            onClick={() => {
                                                                setShowCancelMembership(true);
                                                            }}
                                                    >
                                                        Cancel Membership
                                                    </Button>
                                                </>
                                            }

                                            {showPrePurchaseOrChangeMembership &&
                                                <Button ghost type='primary'
                                                        block={true}
                                                        onClick={() => {
                                                            let route = toRoute(HomeRouteNames.MEMBERSHIPS, 'id', orgId);
                                                            navigate(route);
                                                        }}
                                                >
                                                    {toBoolean(membershipData?.HasUpcomingMembershipToBuy) ? "Pre-Purchase Membership" : "Change Membership"}
                                                </Button>
                                            }
                                        </Flex>
                                    </>
                                }
                            </Flex>
                        </Flex>
                    </>
                }
            </PaddingBlock>

            {(anyInList(tabItems)) &&
                <Tabs
                    rootClassName={cx(globalStyles.tabs, globalStyles.leftTabs)}
                    defaultActiveKey={tabItems[0].key}
                    items={tabItems}
                />
            }

            <DrawerBottom showDrawer={showCancelMembership}
                          closeDrawer={() => setShowCancelMembership(false)}
                          showButton={true}
                          customFooter={<Flex gap={token.padding}>
                              <Button type={'primary'} block onClick={() => {setShowCancelMembership(false)}}>
                                  Close
                              </Button>

                              <Button type={'primary'}
                                      danger
                                      block
                                      disabled={isNullOrEmpty(cancelMembershipData)}
                                      loading={toBoolean(isLoading)}
                                      onClick={() => {
                                          cancelFormik.handleSubmit();
                                      }}>
                                  Cancel
                              </Button>
                          </Flex>}
                          confirmButtonText={'Cancel Membership'}
                          label='Cancel Membership'>
                <PaddingBlock onlyBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        {isNullOrEmpty(cancelMembershipData?.MembershipName) &&
                            <>
                                {emptyArray(4).map((item, index) => (
                                    <div key={index}>
                                        <Flex vertical={true} gap={8}>
                                            <Skeleton.Button active={true} block
                                                             style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                            <Skeleton.Button active={true} block style={{height: `${token.Input.controlHeight}px`}}/>
                                        </Flex>
                                    </div>
                                ))}
                            </>
                        }

                        {!isNullOrEmpty(cancelMembershipData?.MembershipName) &&
                            <>
                                <FormInputDisplay label={'Membership'} value={cancelMembershipData?.MembershipName} />

                                {!isNullOrEmpty(cancelMembershipData?.NextPaymentDateDisplay) &&
                                    <AlertBlock type="info"
                                                description={`Your membership will end on ${cancelMembershipData?.NextPaymentDateDisplay}`} />
                                }

                                <FormTextarea formik={cancelFormik}
                                              max={250}
                                              isRequired={true}
                                              label={'Cancellation Reason'}
                                              name={`reason`}/>
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            </DrawerBottom>

            <Modal show={openNetworkLocations}
                   onClose={() => {setOpenNetworkLocations(false)}}
                   showConfirmButton={false}
                   title={`Network Locations`}>
                <>
                    {networkLocations == null &&
                        <>
                            {emptyArray(12).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block style={{ height: `82px` }} />
                                </div>
                            ))}
                        </>
                    }

                    {networkLocations != null &&
                        <>
                            {anyInList(networkLocations) &&
                                <>
                                    {networkLocations.map((networkLocation, index) => {
                                        const isLastIndex = index === networkLocations.list.length - 1;
                                        
                                        return (
                                            <React.Fragment key={index}>
                                                <Flex vertical={true} gap={4}>
                                                    <Title level={4}>{networkLocation.LocationName}</Title>
                                                    <Text>{networkLocation.DisplayCityState}</Text>
                                                </Flex>

                                                {(!isLastIndex) &&
                                                    <Divider className={globalStyles.noMargin}/>
                                                }
                                            </React.Fragment>
                                        )
                                    })}
                                </>
                            }

                            {(!isNullOrEmpty(networkLocations) && !anyInList(networkLocations)) &&
                                <EmptyBlock description={ 'No network locations.'} />
                            }
                        </>
                    }
                </>
            </Modal>
        </>
    )
}

export default ProfileMyMembership
