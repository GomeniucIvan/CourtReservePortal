import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AppProvider, useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, List, Typography, Switch, Skeleton } from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import mockData from "@/mocks/event-data.json";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {AuthProvider, useAuth} from "@/context/AuthProvider.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    toBoolean
} from "@/utils/Utils.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "@/utils/DateUtils.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import {Toast} from "antd-mobile";
import Modal from "@/components/modal/Modal.jsx";
import RegistrationGuestBlock from "@/components/registration/RegistrationGuestBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import DisclosuresPartial from "@/form/formdisclosures/DisclosuresPartial.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {
    invalidEventGuestsErrors,
    validateEventMembersUdfs,
} from "@/utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import {eventRegistrationRedirect, eventUstaSatelliteDataRegistrationRedirect} from "@/utils/RedirectUtils.jsx";

const {Title, Text} = Typography;

function EventRegistration({fullRegistration}) {
    const navigate = useNavigate();
    const {orgId, authData} = useAuth();
    const [event, setEvent] = useState(null);
    const disclosureSignHandler = useRef();
    const disclosureRef = useRef();
    const [isFetching, setIsFetching] = useState(true);
    const [disclosureModalData, setDisclosureModalData] = useState(null);
    const [selectedReservationIds, setSelectedReservationIds] = useState([]);
    const [disclosureSubmitting, setDisclosureSubmitting] = useState(false);

    const {setHeaderRightIcons} = useHeader();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reservationId = queryParams.get("reservationId");
    const eventId = queryParams.get("eventId");
    const reservationNumber = queryParams.get("reservationNumber");
    const {t} = useTranslation('');
    const guestBlockRef = useRef(null);
    
    const {
        setIsFooterVisible,
        setFooterContent,
        isLoading,
        setIsLoading,
        isMockData,
        shouldFetch,
        resetFetch,
        token,
        globalStyles
    } = useApp();

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        let membersWithDue = members.filter(member => member.PriceToPay > 0 && member.IsChecked);
        let totalPriceToPay = membersWithDue.reduce((sum, member) => sum + member.PriceToPay, 0);

        let paymentLists = [];
        if (anyInList(membersWithDue)){
            paymentLists.push({
                label: 'Members',
                items: membersWithDue.map(member => ({
                    label: member.FullName,
                    price: member.PriceToPay
                }))
            });
        }

        let paymentData = {
            list: paymentLists,
            totalDue: totalPriceToPay,
            requireOnlinePayment: toBoolean(event?.RequireOnlinePayment),
            show: totalPriceToPay > 0,
            holdTimeForReservation: event?.HoldTimeForReservation
        };

        setFooterContent(<PaymentDrawerBottom paymentData={paymentData} group={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                Register
            </Button>
        </PaymentDrawerBottom>)
    }, [isFetching, isLoading])


    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, []);

    const initialValues = {
        ReservationGuests: [],
        Members: [],
    };

    const validationSchema = Yup.object({

    });

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validation: () => {
            const isValidMemberUdfs = validateEventMembersUdfs(t, formik);
            
            //array return to display information from drawers
            const guestsErrors = invalidEventGuestsErrors(t, formik, countListItems(formik.values.Members.filter(v => v.IsChecked)) > 1);
            let isValidGuests = guestsErrors.length === 0;

            if (anyInList(guestsErrors) && isValidMemberUdfs) {
                let firstErrorObject = guestsErrors[0];
                
                displayMessageModal({
                    title: "Registration Error",
                    html: (onClose) => firstErrorObject.Error,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        guestBlockRef.current?.open(firstErrorObject.Guid);
                    },
                })
            }
            
            return isValidMemberUdfs && isValidGuests;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            
            let familyMembers = [];
            let currentMember = values.Members[0];
            
            if (moreThanOneInList(values.Members)) {
                familyMembers = values.Members.filter(member => !equalString(member.OrganizationMemberId, currentMember.OrganizationMemberId));
                
                if (!familyMembers.some(v => toBoolean(v.IsChecked))) {
                    setIsLoading(false);
                    displayMessageModal({
                        title: "Registration Error",
                        html: (onClose) => 'At least one registrant is required.',
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {

                        },
                    });
                    return;
                }
            } else {
                currentMember = {
                    ...currentMember,
                    IsChecked: true,
                }
            }
            
            let postModel = {
                CurrentMember: currentMember,
                FamilyMembers: familyMembers,
                ReservationGuests: formik.values.ReservationGuests,
                EventId: eventId,
                SelectedReservation: {
                    Id: reservationId
                }
            }
            
            let response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/EventsApi/EventApi_SignUpToEvent_DropIn_Post?id=${orgId}`,postModel);
            if (toBoolean(response?.IsValid)) {
                removeLastHistoryEntry();

                let actionType = 1; //1 signup
                if (toBoolean(response.data.RequireOnlinePayment)) {
                    actionType = 4;

                    let route = toRoute(ProfileRouteNames.PROCESS_PAYMENT, 'id', orgId);
                    route = `${route}?evAction=${actionType}`;
                    navigate(route);
                } else {
                    if (toBoolean(response.data.RequiresApproval)) {
                        actionType = 5;
                    }
                }

                if (!toBoolean(response.data.RequireOnlinePayment)) {
                    if (toBoolean(response.data.IsOrganizedPlayEvent)) {
                        let route = toRoute(EventRouteNames.EVENT_DETAILS, 'id', orgId);
                        route = toRoute(route, 'number', reservationNumber);
                        route = `${route}?evAction=${actionType}`;
                        //setPage(setDynamicPages, booking.EventName, route);
                        navigate(route);
                    } else {
                        //USTA ONLY
                        if (equalString(orgId,6415)){
                            eventUstaSatelliteDataRegistrationRedirect(navigate, orgId,actionType, event?.EventName, response.data);
                        } else {
                            eventRegistrationRedirect(navigate, orgId,actionType);
                        }
                    }
                }
                
            } else {
                setIsLoading(false);
                displayMessageModal({
                    title: "Registration Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        
                    },
                })
            }
        },
    });

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

    const loadData = async (refresh) => {
        setIsFetching(true);
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
            setIsFetching(false);
        } else {
            let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_Get?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}&ajaxCall=false&isFullEventReg=${toBoolean(fullRegistration)}`);

            if (toBoolean(response?.isValid)){
                setEvent(response.Data);
                const allMembers = [];
                allMembers.push(response.Data.CurrentMember);

                response.Data.FamilyMembers.map(familyMember => {
                    allMembers.push(familyMember);
                })

                let udfs = response.Data.Udfs;

                if (anyInList(udfs)){
                    allMembers.forEach(member => {
                        member.MemberUdfs = udfs;
                    });
                }
                formik.setFieldValue("Members", allMembers);
            }
            setIsFetching(false);
        }
        resetFetch();
    }

    let members = [];
    if (anyInList(formik.values?.Members)) {
        members = formik.values?.Members;
    }
    
    return (
        <>
            <PaddingBlock topBottom={true}>
                {isFetching &&
                    <Flex vertical={true} gap={16}>
                        <Flex vertical={true} gap={4}>
                            <Skeleton.Button active={true} block
                                             style={{height: `60px`, width: `${randomNumber(45, 75)}%`}}/>
                            <Skeleton.Button active={true} block
                                             style={{height: `40px`, width: `${randomNumber(45, 75)}%`}}/>
                        </Flex>

                        <Flex vertical={true} gap={4}>
                            {emptyArray(6).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `50px`, width: `${randomNumber(45, 75)}%`}}/>
                                </div>
                            ))}
                        </Flex>

                        <Skeleton.Button active={true} block style={{height: `120px`}}/>
                    </Flex>
                }
                {!isFetching &&
                    <>
                        <div style={{marginBottom: `${token.padding}px`}}>
                            <Title level={3} style={{marginBottom: 0}}>
                                {event?.EventName}
                            </Title>
                            <Text type="secondary">{event?.Type}</Text>
                        </div>

                        <Flex vertical={true} gap={token.padding}>
                            <Flex vertical gap={4}>
                                {(!toBoolean(event?.IsSignUpForEntireEvent) && !toBoolean(event?.NoDropInRegistration)) &&
                                    <CardIconLabel icon={'calendar'}
                                                   description={dateTimeToFormat(event?.SelectedReservation.Start, 'ddd, MMM Do')}/>
                                }
                                {(anyInList(event?.OtherFromSameEvent) && toBoolean(event?.NoDropInRegistration)) &&
                                    <CardIconLabel icon={'calendar'} description={event?.GetDateDisplayNoDropInHeader}/>
                                }
                                <CardIconLabel icon={'clock'}
                                               description={dateTimeToTimes(event?.SelectedReservation.Start, event?.SelectedReservation.End, 'friendly')}/>
                            </Flex>

                            {moreThanOneInList(formik?.values?.Members) &&
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
                                                       <Flex justify={'space-between'} align={'center'} className={'width-100'}>
                                                           <Title level={2} onClick={() => {if (!requireToSignWaiver){toggleInitialCheck(index)}}}>
                                                               {member.FullName}
                                                           </Title>
                                                           <Switch checked={member.IsChecked}
                                                                   onChange={() => toggleInitialCheck(index)} disabled={requireToSignWaiver}/>
                                                       </Flex>

                                                       {toBoolean(member.HasDisclosureToSign) &&
                                                           <div>
                                                               <label htmlFor={name} className={globalStyles.globalLabel}>
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
                                                               <FormCustomFields customFields={member.MemberUdfs} formik={formik} index={index} name={'Members[{index}].MemberUdfs[{udfIndex}].Value'}/>
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
                        </Flex>
                    </>
                }

            </PaddingBlock>

            <Modal show={!isNullOrEmpty(disclosureModalData)}
                   onClose={() => {setDisclosureModalData(null)}}
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

export default EventRegistration
