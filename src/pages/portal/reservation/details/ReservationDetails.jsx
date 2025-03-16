import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Badge, Button, Flex, Skeleton, Tabs, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/reservation-data.json";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {
    anyInList,
    equalString,
    getValueOrDefault,
    isNullOrEmpty,
    nullToEmpty,
    textFromHTML,
    toBoolean
} from "@/utils/Utils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {Card, Ellipsis} from "antd-mobile";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import customFormik from "@/components/formik/CustomFormik.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";

const {Title, Text} = Typography;

function ProfileBookingDetails() {
    let {reservationId} = useParams();
    const [booking, setBooking] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {t} = useTranslation('');
    const [showCancelReservation, setShowCancelReservation] = useState(false);
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    
    const navigate = useNavigate();
    const {
        setIsFooterVisible,
        setFooterContent,
        resetFetch,
        isMockData,
        globalStyles,
        token,
        setIsLoading,
        isLoading,
        setDynamicPages
    } = useApp();
    const {orgId} = useAuth();

    const loadData = async (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setBooking(details);
        } else {
            let response = await appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/ApiReservation?id=${orgId}&reservationId=${reservationId}`);
            if (toBoolean(response?.IsValid)) {
                let data = response.Data;
                setBooking(data.Reservation);
                setHeaderTitle(data.Reservation.ReservationType);
            }

            setIsFetching(false);
        }

        resetFetch();
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');

        loadData();
    }, []);

    const tabContent = (key) => {
        if (equalString(key, 'players')) {
            return (
                <PaddingBlock>
                    {anyInList(booking?.Members) &&
                        <>
                            {booking.Members.map((member, index) => (
                                <div key={index}>
                                    <Card className={cx(globalStyles.card)}>
                                        <Title level={1} className={cx(globalStyles.cardItemTitle)}>
                                            <Ellipsis direction='end' content={member.FullName}/>
                                        </Title>
                                        <Text type="secondary"
                                              className={globalStyles.block}>{t('booking.registeredOn')}: {member.CreatedOn}</Text>
                                        <Text type="secondary"
                                              className={globalStyles.block}>{t('booking.priceToPay')}: {member.TotalDue}</Text>
                                        <Text type="secondary"
                                              className={globalStyles.block}>{t('booking.paymentStatus')}: {member.PaymentStatusMobile}</Text>
                                    </Card>
                                </div>
                            ))}
                        </>
                    }
                </PaddingBlock>
            )
        }

        if (equalString(key, 'matchdetails')) {
            return (
                <PaddingBlock>
                    <Flex vertical={true} gap={token.padding}>
                        {toBoolean(booking?.MatchMakerIsPrivateMatch) &&
                            <>
                                <FormInputDisplay label={'Type'} value={'Private Reservation'} />
                            </>
                        }
                        {(toBoolean(booking?.MatchMakerIsPrivateMatch) && !isNullOrEmpty(booking?.MatchMakerJoinCode)) &&
                            <>
                                <FormInputDisplay label={'Join Code'} value={booking?.MatchMakerJoinCode} />
                            </>
                        }
                        {(toBoolean(booking?.IsGenderCriteriaMatch) && !equalString(getValueOrDefault(booking?.MatchMakerGender,1), 1)) &&
                            <>
                                <FormInputDisplay label={'Gender Restriction'} value={booking?.MatchMakerGender} />
                            </>
                        }
                        {(toBoolean(booking?.IsAgeCriteriaMatch) && (!isNullOrEmpty(booking?.MatchMakerMinAge) || !isNullOrEmpty(booking?.MatchMakerMaxAge))) &&
                            <>
                                {(!isNullOrEmpty(booking?.MatchMakerMinAge) && !isNullOrEmpty(booking?.MatchMakerMaxAge)) ?
                                    ( <><FormInputDisplay label={'Age Restriction'} value={`Min Age ${booking?.MatchMakerMinAge}, Max Age ${booking?.MatchMakerMaxAge}`} /></>) :
                                    (<><FormInputDisplay label={'Age Restriction'} value={isNullOrEmpty(booking?.MatchMakerMaxAge) ? `Min Age ${booking?.MatchMakerMinAge}` : `Max Age ${booking?.MatchMakerMaxAge}`} /></>)
                                }
                            </>
                        }

                        <Text>todo rating category from org.RatingCategories</Text>
                        <Text>todo MemberGroups from org.MemberGroups after merge</Text>
                    </Flex>
                </PaddingBlock>
            )
        }

        if (equalString(key, 'additional')) {
            return (
                <PaddingBlock>
                    <Flex vertical={true} gap={token.padding}>
                        {anyInList(booking?.Udfs) &&
                            <>
                                {booking.Udfs.filter(v => !isNullOrEmpty(v.Value)).map((udf, index) => (
                                    <FormInputDisplay label={udf.Label} value={udf?.Value} key={`udf_${index}`} />
                                ))}
                            </>
                        }

                        {!isNullOrEmpty(booking?.Description) &&
                            <>
                                <FormInputDisplay label={'Description'} value={booking?.Description} />
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            )
        }

        return (
            <PaddingBlock>
                {key}
            </PaddingBlock>
        )
    }

    const cancelValidationSchema = Yup.object({
        reason: Yup.string().required(t('reservation.cancellationReasonRequired')),
    });

    const cancelFormik = customFormik({
        initialValues: {reason: ''},
        validationSchema: cancelValidationSchema,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            if (isMockData) {
                setIsLoading(false);
            } else {
                const postData = {
                    SelectedReservation: {
                        Id: booking?.Id,
                        CancellationReason: values.reason
                    }
                }
                appService.post(`/app/Online/MyProfile/CancelReservation?id=${orgId}`, postData).then(r => {
                    if (toBoolean(t?.IsValid)){
                        pNotify(t('reservation.successfullyCancelledMessage', {entity: toBoolean(booking.IsLesson) ? t('lesson') : t('reservation.title')}))
                        loadData();
                    } else{
                        pNotify(r.Message, 'error');
                    }

                    setIsLoading(false);
                })
            }
        },
    });

    useEffect(() => {
        if (!showCancelReservation){
            cancelFormik.resetForm();
        }
    }, [showCancelReservation]);

    let tabs = [];

    if (anyInList(booking?.Members) || anyInList(booking?.Members)) {
        tabs.push({
            label: t('reservation.players', {count: booking?.Members?.length || 0}),
            key: 'players',
            children: tabContent('players')
        })
    }

    let isOpenReservation = toBoolean(booking?.IsOpenReservation) && equalString(booking?.OpenMatchStatus, 1);
    if (isOpenReservation){
        tabs.push({
            label: 'Match Details',
            key: 'matchdetails',
            children: tabContent('matchdetails')
        })
    }

    if (!isNullOrEmpty(booking?.ResourcesDisplay)){
        tabs.push({
            label: 'Misc. Items',
            key: 'misc',
            children: tabContent('misc')
        })
    }

    let showAdditionalTab = anyInList(booking?.Udfs) || !isNullOrEmpty(booking?.Description);
    if (showAdditionalTab){
        tabs.push({
            label: 'Additional',
            key: 'additional',
            children: tabContent('additional')
        })
    }

    return (
        <>

            {isFetching &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(4).map((item, index) => (
                                <div key={index}>
                                    <Flex vertical={true} gap={8}>
                                        <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                        <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                    </Flex>
                                </div>
                            ))}
                        </Flex>
                    </PaddingBlock>

                    <PaddingBlock topBottom={true}>
                        <Skeleton.Button active={true} block style={{height: 130}}/>
                    </PaddingBlock>
                </>
            }

            {!isFetching &&
                <>
                    <PaddingBlock topBottom={true}>

                        <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                            <div className={globalStyles?.cardIconBlock}>
                                <i className={globalStyles.entityTypeCircleIcon} style={{backgroundColor: 'red'}}></i>
                            </div>

                            <div>
                                <Title level={1} style={{marginTop: 0}} className={globalStyles.noBottomPadding}>
                                    {booking?.ReservationType}
                                </Title>

                                <Text
                                    type="secondary">{toBoolean(booking?.IsLesson) ? t('lesson') : t('reservation.title')}</Text>
                            </div>
                        </Flex>

                        <Flex vertical gap={4}>
                            <CardIconLabel icon={'calendar'} description={booking?.DateDisplay}/>
                            <CardIconLabel icon={'clock'} description={booking?.TimeDisplay}/>
                            <CardIconLabel icon={'courts'} description={booking?.CourtsDisplay} preventFill={true}
                                           preventStroke={false}/>
                            {!isNullOrEmpty(booking?.PinCode) &&
                                <CardIconLabel icon={'pincode'} description={booking?.PinCode}/>}

                        </Flex>

                        <PaddingBlock topBottom={true} leftRight={false}>
                            <InlineBlock>
                                <Button type="primary"
                                        danger
                                        block
                                        ghost
                                        htmlType={'button'}
                                        onClick={() => {
                                            setShowCancelReservation(true);
                                        }}>
                                    Cancel
                                </Button>

                                <Button type="primary"
                                        block
                                        onClick={() => {
                                            let route = toRoute(ProfileRouteNames.RESERVATION_UPDATE, 'id', orgId);
                                            route = toRoute(route, 'reservationId', booking?.Id);
                                            setPage(setDynamicPages, booking?.ReservationType, route);
                                            navigate(route);
                                        }}
                                        htmlType={'button'}>
                                    Edit
                                </Button>
                            </InlineBlock>
                        </PaddingBlock>

                        {/*<div>*/}
                        {/*    <Button onClick={() => navigate(ProfileRouteNames.RESERVATION_CREATE)}>Create res</Button>*/}
                        {/*</div>*/}
                    </PaddingBlock>

                    {anyInList(tabs) &&
                        <>
                            <Tabs
                                rootClassName={cx(globalStyles.tabs, tabs.length <= 2 && globalStyles.leftTabs)}
                                defaultActiveKey="1"
                                items={tabs}
                            />
                        </>
                    }
                </>
            }
            <DrawerBottom showDrawer={showCancelReservation}
                          closeDrawer={() => setShowCancelReservation(false)}
                          showButton={true}
                          dangerButton={true}
                          confirmButtonLoading={isLoading}
                          confirmButtonText={toBoolean(booking?.IsLesson) ? t('reservation.cancelLesson') : t('reservation.cancelReservation')}
                          label={toBoolean(booking?.IsLesson) ? t('reservation.cancelLesson') : t('reservation.cancelReservation')}
                          onConfirmButtonClick={() => {
                              cancelFormik.handleSubmit();
                          }}>
                <PaddingBlock onlyBottom={true}>

                    <Flex vertical={true} style={{paddingBottom: `${token.padding}px`}} gap={token.padding/2}>
                        <Text
                            type={'warning'}> {t('reservation.cancelReservationDescription', {entity: (toBoolean(booking?.IsLesson) ? 'lesson' : 'reservation')})}</Text>

                        {!isNullOrEmpty(booking?.IsUnderPenaltyWindow) &&
                            <Text
                                type={'danger'}> {t('reservation.cancelReservationPenalty', {
                                entity: (toBoolean(booking?.IsLesson) ? 'lesson' : 'reservation'),
                                memberXCancellations: booking?.MemberXCancellations
                            })}</Text>
                        }

                        {(!isNullOrEmpty(booking?.IsUnderPenaltyWindow) && !isNullOrEmpty(booking?.XPenaltyCancellationsToRemoveAbilityToReserve)) &&
                            <Text className={globalStyles.block}
                                  type={'danger'}> {t('reservation.cancelReservationAbilityToReserve', {xPenaltyCancellationsToRemoveAbilityToReserve: booking?.XPenaltyCancellationsToRemoveAbilityToReserve})}</Text>
                        }
                    </Flex>

                    {!isNullOrEmpty(booking?.IsUnderPenaltyWindow) &&
                        <div>
                            <Text
                                type={'danger'}> {t('reservation.cancelReservationPenalty', {
                                entity: (toBoolean(booking?.IsLesson) ? 'lesson' : 'reservation'),
                                memberXCancellations: booking?.MemberXCancellations
                            })}</Text>

                            {!isNullOrEmpty(booking?.XPenaltyCancellationsToRemoveAbilityToReserve) &&
                                <Text className={globalStyles.block}
                                      type={'danger'}> {t('reservation.cancelReservationAbilityToReserve', {xPenaltyCancellationsToRemoveAbilityToReserve: booking?.XPenaltyCancellationsToRemoveAbilityToReserve})}</Text>

                            }
                        </div>
                    }
                    <FormTextarea formik={cancelFormik}
                                  max={200}
                                  isRequired={true}
                                  label={t('reservation.cancellationReason')}
                                  name={`reason`}/>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ProfileBookingDetails
