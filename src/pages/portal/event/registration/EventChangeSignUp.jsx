﻿import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Flex} from "antd";
import * as Yup from "yup";
import mockData from "@/mocks/event-data.json";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList, oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
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
import {
    eventRegistrationRedirect,
    eventUstaSatelliteDataRegistrationRedirect,
    eventValidResponseRedirect
} from "@/utils/RedirectUtils.jsx";
import EventSignUpPartial from "@portal/event/registration/modules/EventSignUpPartial.jsx";
import EventSignUpSkeleton from "@portal/event/registration/modules/EventSignUpSkeleton.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import EventSignUpDetails from "@portal/event/registration/modules/EventSignUpDetails.jsx";
import {generateEventPostModel} from "@portal/event/registration/modules/functions.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";

function EventChangeSignUp({isFullEventReg = false}) {
    const navigate = useNavigate();
    const {orgId, authData} = useAuth();
    const [event, setEvent] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reservationId = queryParams.get("reservationId");
    const eventId = queryParams.get("eventId");
    const reservationNumber = queryParams.get("reservationNumber");
    const {t} = useTranslation('');
    const guestBlockRef = useRef(null);
    const [maxAllowedGuests, setMaxAllowedGuests] = useState(0);
    const [showEventCancellationReason, setShowEventCancellationReason] = useState(false);
    
    const {
        setIsFooterVisible,
        setFooterContent,
        isLoading,
        setIsLoading,
        isMockData,
        shouldFetch,
        resetFetch,
        token
    } = useApp();

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, []);

    const initialValues = {
        ReservationGuests: [],
        Members: [],
        PullOutReason: ''
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

            let formResponse = generateEventPostModel(formik, moreThanOneInList(values.Members), setIsLoading, eventId, reservationId);

            if (!toBoolean(formResponse?.IsValid)) {
                setIsLoading(false);
                displayMessageModal({
                    title: "Registration Error",
                    html: (onClose) => formResponse.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                });
                return;
            }
            
            let postModel = {
                ...event,
                ...formResponse.PostModel
            };

            let response = await appService.post(`/app/Online/Events/ChangeSignUp?id=${orgId}`, postModel);

            if (toBoolean(response?.IsValid)) {
                removeLastHistoryEntry();
                eventValidResponseRedirect(response, navigate, {
                    orgId: orgId,
                    eventName: event.EventName,
                    reservationNumber: reservationNumber
                });
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

    useEffect(() => {
        let members = [];
        let guests = [];
        
        if (anyInList(formik?.values?.Members)) {
            members = formik.values?.Members;
        }

        if (anyInList(formik?.values?.ReservationGuests)) {
            guests = formik.values?.ReservationGuests;
        }

        setShowEventCancellationReason(members.some(member => toBoolean(member.InitialCheck) && !toBoolean(member.IsChecked)));
        
        let checkedMembers = members.filter(member => toBoolean(member.IsChecked));
        let checkedMembersWithMaxGuests = checkedMembers.filter(member => !isNullOrEmpty(member.MaxGuests));
        setMaxAllowedGuests(checkedMembersWithMaxGuests.some(v => toBoolean(v.AllowGuests)) ? checkedMembersWithMaxGuests.reduce((sum, member) => sum + member.MaxGuests, 0) : 0)
        let membersWithDue = checkedMembers.filter(member => member.PriceToPay > 0 && !toBoolean(member.IsMonthlyFree) && !toBoolean(member.IsPaid));
        let guestsWithDue = [];

        let selectedFirstMember = null;
        if (anyInList(checkedMembers)) {
            selectedFirstMember = checkedMembers[0];
        }

        let guestIncrement = 0;
        guests.forEach(guest => {
            let guestOwner = null;
            guestIncrement++;

            if (!isNullOrEmpty(guest.GuestOwnerId)) {
                guestOwner = checkedMembers.find(v => equalString(v.OrganizationMemberId, guest.GuestOwnerId));
            } else if (oneListItem(checkedMembers) && !isNullOrEmpty(selectedFirstMember)) {
                guestOwner = selectedFirstMember;
            }

            if (!isNullOrEmpty(guestOwner)) {
                //is paid

                let cost = toBoolean(isFullEventReg) ? guestOwner.EntireEventGuestPrice : guestOwner.OccurrenceGuestPrice;
                if (isNullOrEmpty(cost)) {
                    cost = 0;
                }
                if (cost > 0) {
                    let guestFullName = `${guest.FirstName} ${guest.LastName}`;
                    if (isNullOrEmpty(guestFullName)){
                        guestFullName = `Guest #${guestIncrement}`;
                    }
                    guestsWithDue.push({
                        FullName: guestFullName,
                        PriceToPay: cost,
                    })
                }
            }
        })
        
        let totalPriceToPay = membersWithDue.reduce((sum, member) => sum + member.PriceToPay, 0) + guestsWithDue.reduce((sum, guest) => sum + guest.PriceToPay, 0);

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

        if (anyInList(guestsWithDue)){
            paymentLists.push({
                label: 'Guests',
                items: guestsWithDue.map(member => ({
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
                Update
            </Button>
        </PaymentDrawerBottom>)
    }, [isFetching, isLoading, formik.values])
    
    const loadData = async (refresh) => {
        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/Events/ChangeSignUp?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}&reservationNumber=${reservationNumber}`);

        if (toBoolean(response?.isValid)){
            setEvent(response.Data);
            const allMembers = [];

            allMembers.push(response.Data.CurrentMember);

            response.Data.FamilyMembers.map(familyMember => {
                allMembers.push(familyMember);
            })

            let udfs = structuredClone(response.Data.Udfs); // Create a deep copy to avoid reference issues

            if (anyInList(udfs)) {
                allMembers.forEach(member => {
                    // Clone UDFs to prevent unwanted reference modifications
                    member.MemberUdfs = structuredClone(udfs);

                    let currentMemberInList = response.Data.MemberUdfs.find(v =>
                        equalString(v.OrganizationMemberId, member.OrganizationMemberId)
                    );

                    member.MemberUdfs.forEach(memberUdf => {
                        // Ensure currentMemberInList and its Udfs exist before accessing
                        const currentUdfInList = currentMemberInList?.Udfs?.find(v =>
                            equalString(v.Id, memberUdf.Id)
                        );

                        // Set the value properly, ensuring empty values are handled
                        memberUdf.Value = currentUdfInList?.Value ?? '';
                    });
                });
            }

            formik.setFieldValue("Members", allMembers);
            
            //Guests
            let reservationGuests = response.Data.ReservationGuests;
            if (anyInList(reservationGuests)) {

                if (anyInList(udfs)) {
                    reservationGuests.forEach(guest => {
                        // Clone UDFs to prevent unwanted reference modifications
                        guest.MemberUdfs = structuredClone(udfs);

                        let currentMemberInList = response.Data.MemberUdfs.find(v =>
                            equalString(v.GuestGuid, guest.Guid)
                        );

                        guest.MemberUdfs.forEach(memberUdf => {
                            // Ensure currentMemberInList and its Udfs exist before accessing
                            const currentUdfInList = currentMemberInList?.Udfs?.find(v =>
                                equalString(v.Id, memberUdf.Id)
                            );

                            // Set the value properly, ensuring empty values are handled
                            memberUdf.Value = currentUdfInList?.Value ?? '';
                        });
                    });
                }
            }

            formik.setFieldValue("ReservationGuests", reservationGuests);
        }
        setIsFetching(false);
        resetFetch();
    }
    
    return (
        <>
            <EventSignUpSkeleton isFetching={isFetching} />

            {!isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <EventSignUpDetails event={event} />
                        <EventSignUpPartial isFetching={isFetching} 
                                            formik={formik}
                                            event={event}
                                            maxAllowedGuests={maxAllowedGuests}
                                            loadData={loadData}
                                            guestBlockRef={guestBlockRef} />

                        {showEventCancellationReason &&
                            <FormTextarea formik={formik} label={'Withdraw Reason'} name={'PullOutReason'} max={350} isRequired={toBoolean(authData.RequireReasonForEventCancellations)}/>
                        }
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default EventChangeSignUp
