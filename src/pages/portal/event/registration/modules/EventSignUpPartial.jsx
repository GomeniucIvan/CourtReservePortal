import React, {useRef, useState} from "react";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, List, Typography, Switch, Skeleton, QRCode, Divider} from "antd";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    toBoolean
} from "@/utils/Utils.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import {Toast} from "antd-mobile";
import Modal from "@/components/modal/Modal.jsx";
import RegistrationGuestBlock from "@/components/registration/RegistrationGuestBlock.jsx";
import DisclosuresPartial from "@/form/formdisclosures/DisclosuresPartial.jsx";
import appService from "@/api/app.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useApp} from "@/context/AppProvider.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
const {Title, Text} = Typography;

function EventSignUpPartial({formik, event, loadData, guestBlockRef, isFamilyMember, maxAllowedGuests}) {
    const disclosureSignHandler = useRef();
    const disclosureRef = useRef();
    const [disclosureModalData, setDisclosureModalData] = useState(null);
    const [selectedReservationIds, setSelectedReservationIds] = useState([]);
    const [disclosureSubmitting, setDisclosureSubmitting] = useState(false);
    const [showOtherEventDates, setShowOtherEventDates] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reservationId = queryParams.get("reservationId");
    const eventId = queryParams.get("eventId");
    const reservationNumber = queryParams.get("reservationNumber");
    const {t} = useTranslation('');

    const {token, globalStyles, setDynamicPages } = useApp();
    const {orgId, authData } = useAuth();
    const navigate = useNavigate();
    
    let members = [];
    if (anyInList(formik.values?.Members)) {
        members = formik.values?.Members;
    }

    const loadMemberWaivers = async (memberId) => {
        let selectedReservationId = toBoolean(event?.NoDropInRegistration) ? 0 : reservationId;
        let reservationIds = !toBoolean(event?.NoDropInRegistration) ? selectedReservationIds: '';

        let response = await appService.get(navigate, `/app/Online/Disclosures/Pending?id=${orgId}&userId=${memberId}&eventId=${eventId}&reservationId=${selectedReservationId}&selectedReservationIdsString=${reservationIds}`);

        if (toBoolean(response?.IsValid)) {
            disclosureSignHandler.current?.close();
            let disclosureData = response.Data;

            let members = disclosureData.Members;
            //show only for selected member
            disclosureData.Members = members.filter(member => equalString(member.MemberId, memberId));
            setDisclosureModalData(disclosureData);
        }
    }

    const toggleInitialCheck = (index) => {
        formik.setFieldValue(
            'Members',
            formik.values.Members.map((member, idx) =>
                idx === index ? { ...member, IsChecked: !member.IsChecked } : member
            )
        );
    };

    const onWaiverSignPostSuccess = () => {
        setDisclosureModalData(null)

        //todo we should persist all information, udf, checked and so on
        loadData();
    }
    
    return (
        <>
            {(toBoolean(event?.NoDropInRegistration) && event?.TotalReservationsCount > event?.LeftReservationsCount) &&
                <AlertBlock type={'info'} description={`You have missed ${event?.LeftReservationsCount} date(s), you are only registering for upcoming dates.`} removePadding={true} />
            }

            {anyInList(event?.OtherFromSameEvent) &&
                <Button block
                        onClick={() => {
                            setShowOtherEventDates(true);
                        }}
                        htmlType={'button'}>
                    Registration Date(s)
                </Button>
            }

            {(toBoolean(event?.IsAvailableSignUpforEntireEvent) && !toBoolean(event?.NoDropInRegistration)) &&
                <Button type="primary"
                        block
                        onClick={() => {
                            let route = toRoute(EventRouteNames.EVENT_SIGNUP, 'id', orgId);
                            route = `${route}?eventId=${event.EventId}&reservationId=${event?.SelectedReservation?.Id}&reservationNumber=${event.ReservationNumber}&isFullEventReg=true`;
                            setPage(setDynamicPages, event.EventName, route);
                            navigate(route);
                        }}
                        htmlType={'button'}>
                    {eReplace('Register to Full Event')}
                </Button>
            }


            {/*//TODO FIND A WAY TO MERGE WITH LEAGUES*/}
            {(moreThanOneInList(formik?.values?.Members) || toBoolean(isFamilyMember)) &&
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={formik.values.Members}
                        bordered
                        renderItem={(member, index) => {
                            let requireToSignWaiver = equalString(member.DisclosureStatus, 2) && !toBoolean(member.InitialCheck);

                            return (
                                <List.Item className={globalStyles.listItemSM}>
                                    <Flex vertical={true} gap={token.padding} flex={1}>
                                        <Flex justify={'space-between'} align={'center'}>
                                            <Title level={3} onClick={() => {
                                                if (!requireToSignWaiver) {
                                                    toggleInitialCheck(index)
                                                }
                                            }}>
                                                {member.FullName}
                                            </Title>
                                            <Switch checked={member.IsChecked}
                                                    onChange={() => toggleInitialCheck(index)}
                                                    disabled={requireToSignWaiver}/>
                                        </Flex>

                                        {toBoolean(member.HasDisclosureToSign) &&
                                            <div>
                                                <label htmlFor={name}
                                                       className={globalStyles.globalLabel}>
                                                    Sign Waiver(s)
                                                </label>
                                                <Button size={'small'} type={'primary'} onClick={() => {
                                                    disclosureSignHandler.current = Toast.show({
                                                        icon: 'loading',
                                                        content: '',
                                                        maskClickable: false,
                                                        duration: 0
                                                    })
                                                    loadMemberWaivers(member.Id);
                                                }}>
                                                    Sign
                                                </Button>
                                            </div>
                                        }

                                        {toBoolean(member.IsChecked) &&
                                            <>
                                                <FormCustomFields customFields={member.MemberUdfs}
                                                                  formik={formik} 
                                                                  index={index}
                                                                  name={'Members[{index}].MemberUdfs[{udfIndex}].Value'}/>
                                            </>
                                        }
                                    </Flex>
                                </List.Item>
                            )
                        }}
                    />
                </>
            }

            {(toBoolean(event?.AllowGuests) && members.filter(resMember => toBoolean(resMember.IsChecked)).length > 0) &&
                <RegistrationGuestBlock disableAddGuest={false}
                                        formik={formik}
                                        udfs={event.Udfs}
                                        type={'event'}
                                        ref={guestBlockRef}
                                        maxAllowedGuests={maxAllowedGuests}
                                        guestOrgMemberIdValue={'OrganizationMemberId'}
                                        showGuestOwner={members.filter(resMember => toBoolean(resMember.IsChecked)).length > 1}
                                        reservationMembers={members.filter(resMember => toBoolean(resMember.IsChecked))}
                                        onGuestRemove={(guestIndex) => {
                                            formik.setFieldValue(
                                                'ReservationGuests',
                                                formik.values.ReservationGuests.filter((_, index) => index !== guestIndex)
                                            );
                                        }}
                                        showAllCosts={false}/>
            }

            <Modal show={showOtherEventDates}
                   onClose={() => {setShowOtherEventDates(false)}}
                   showConfirmButton={false}
                   title={'Registering Date(s)'}>
                <>
                    {anyInList(event?.OtherFromSameEvent) &&
                        <>
                            {event.OtherFromSameEvent.map((event, index) => {

                                return (
                                    <>
                                        <Flex>
                                            <Text style={{padding: `0px ${token.padding}px`}}>{event.Start}</Text>
                                        </Flex>
                                        <Divider style={{margin: `${token.paddingLG}px 0px`}} />
                                    </>
                                )
                            })}
                        </>
                    }
                </>
            </Modal>
            
            <Modal show={!isNullOrEmpty(disclosureModalData)}
                   onClose={() => {
                       setDisclosureModalData(null)
                   }}
                   loading={disclosureSubmitting}
                   onConfirm={() => {
                       disclosureRef.current.submit();
                   }}
                   showConfirmButton={true}
                   confirmButtonText={'Sign'}
                   title={'Waiver(s)'}>

                <DisclosuresPartial orgId={orgId}
                                    ref={disclosureRef}
                                    isModal={true}
                                    isFormSubmit={(e) =>{
                                        setDisclosureSubmitting(e);
                                    }}
                                    disclosureData={disclosureModalData}
                                    onPostSuccess={onWaiverSignPostSuccess}
                                    navigate={navigate}/>
            </Modal>
        </>
    )
}

export default EventSignUpPartial
