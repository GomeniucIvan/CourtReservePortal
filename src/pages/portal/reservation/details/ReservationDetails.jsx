import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Badge, Button, Flex, Tabs, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/reservation-data.json";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {anyInList, equalString, isNullOrEmpty, textFromHTML, toBoolean} from "@/utils/Utils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import {Card, Ellipsis} from "antd-mobile";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import {useFormik} from "formik";
import * as Yup from "yup";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";

const {Title, Text} = Typography;

function ProfileBookingDetails() {
    let {id} = useParams();
    const [booking, setBooking] = useState(null);
    const {t} = useTranslation('');
    const [showCancelReservation, setShowCancelReservation] = useState(false);

    const {setHeaderRightIcons} = useHeader();
    
    const {
        setIsFooterVisible,
        setFooterContent,
        resetFetch,
        isMockData,
        globalStyles,
        token,
        setIsLoading,
        isLoading,
    } = useApp();
    const {orgId} = useAuth();

    const loadData = (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setBooking(details);
        } else {
            appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/ApiReservation?id=${orgId}&reservationId=${id}`).then(r => {
                if (toBoolean(r?.IsValid)) {
                    setBooking(r.Data.Reservation);
                }
            })
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

        return (
            <PaddingBlock>
                {key}
            </PaddingBlock>
        )
    }

    const cancelValidationSchema = Yup.object({
        reason: Yup.string().required(t('reservation.cancellationReasonRequired')),
    });

    const cancelFormik = useFormik({
        initialValues: {reason: ''},
        validationSchema: cancelValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
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
    
    return (
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
                                htmlType={'button'}>
                            Edit
                        </Button>
                    </InlineBlock>
                </PaddingBlock>
                
                {/*<div>*/}
                {/*    <Button onClick={() => navigate(ProfileRouteNames.RESERVATION_CREATE)}>Create res</Button>*/}
                {/*</div>*/}
            </PaddingBlock>

            <Tabs
                rootClassName={cx(globalStyles.tabs)}
                defaultActiveKey="1"
                items={[
                    {
                        label: t('reservation.players', {count: booking?.Members?.length || 0}),
                        key: 'players',
                        children: tabContent('players')
                    },
                    {
                        label: 'Match Details',
                        key: 'matchdetails',
                        children: tabContent('matchdetails')
                    },
                    {
                        label: 'Misc. Items',
                        key: 'misc',
                        children: tabContent('misc')
                    },
                    {
                        label: 'Additional',
                        key: 'additional',
                        children: tabContent('additional')
                    },
                ]}
            />

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
