﻿import {useLocation, useNavigate, useParams} from "react-router-dom";
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
import {eventRegistrationRedirect, eventUstaSatelliteDataRegistrationRedirect} from "@/utils/RedirectUtils.jsx";
import EventSignUpPartial from "@portal/event/registration/modules/EventSignUpPartial.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";

function EventSignUp() {
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
    const isFullEventReg = toBoolean(queryParams.get("isFullEventReg"));
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
        let members = [];
        if (anyInList(formik?.values?.Members)) {
            members = formik.values?.Members;
        }
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
                familyMembers = values.Members;

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
                
                //require to separate for post
                familyMembers = values.Members.filter(member => !equalString(member.OrganizationMemberId, currentMember.OrganizationMemberId));
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
            
            let response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_DropIn_Post?id=${orgId}`,postModel);
            setIsLoading(false);
            if (toBoolean(response?.IsValid)) {
                if (equalString(orgId, 6415)) {
                    pNotify('Successfully Removed From Event');
                } else {
                    pNotify('Successfully Withdrawn');
                }
                navigate(HomeRouteNames.INDEX);
            } else {
                displayMessageModal({
                    title: "Withdraw Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        
                    },
                })
            }
        },
    });

    const loadData = async (refresh) => {
        setIsFetching(true);
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
            setIsFetching(false);
        } else {
            let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_Get?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}&ajaxCall=false&isFullEventReg=${isFullEventReg}`);

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
    
    return (
        <>
            <EventSignUpPartial isFetching={isFetching} formik={formik} event={event} loadData={loadData} guestBlockRef={guestBlockRef} />
        </>
    )
}

export default EventSignUp
