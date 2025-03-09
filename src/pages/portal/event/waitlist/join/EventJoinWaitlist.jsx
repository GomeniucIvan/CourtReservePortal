﻿import * as React from "react";
import {Segmented, Space, Flex, Typography, Progress, Tabs, Skeleton, Button} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import LeagueSessionDetailsPartial from "@portal/league/modules/LeagueSessionDetailsPartial.jsx";
import EventLeagueFamilyMembersBlock from "@/components/registration/EventLeagueFamilyMembersBlock.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {getLastFromHistory, getLastFromHistoryPath, removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import EventDetailsPartial from "@portal/event/modules/EventDetailsPartial.jsx";

const {Title, Text} = Typography;

function EventJoinWaitlist() {
    const [isFetching, setIsFetching] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventId = queryParams.get("eventId");
    const reservationId = queryParams.get("reservationId");
    const parAction = queryParams.get("action");
    
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState(null);
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {orgId, authDataOrgMemberIds} = useAuth();
    const [errorData, setErrorData] = useState(null);
    const [action, setAction] = useState(parAction || 'waitlist'); //waitlist-unsubscribe, waitlist-edit
    
    const {
        setIsFooterVisible,
        token,
        setFooterContent,
        setIsLoading,
        isLoading
    } = useApp();

    const initialValues = {
        FamilyMembers: [],
    };

    const validationSchema = Yup.object({

    });

    const formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validation: () => {
            let isValid = true;

            const optOut = formik?.values?.FamilyMembers?.every(v => toBoolean(v.InitialCheck));

            if (countListItems(authDataOrgMemberIds) > 0) {
                let checkedMembers = formik?.values?.FamilyMembers.filter(member => toBoolean(member.IsChecked));
                isValid = countListItems(checkedMembers) > 0;
                if (countListItems(checkedMembers) === 0) {
                    displayMessageModal({
                        title: "Error",
                        html: (onClose) => toBoolean(optOut) ? 'Select Member(s) to Unsubscribe.' : 'Select Member(s) to Waitlist.',
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {},
                    })
                }
            }

            return isValid;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            const unsubscribe = formik?.values?.FamilyMembers?.every(v => toBoolean(v.InitialCheck));

            let postModel = {
                ...eventDetails,
                FamilyMembers: values.FamilyMembers,
            }

            let response = null;
            if (equalString(action, 'waitlist-unsubscribe')) {
                response = await appService.post(`/app/Online/Events/WaitingListPullOut?id=${orgId}`, postModel);
            } else {
                response = await appService.post(`/app/Online/Events/SignUpToWaitingList?id=${orgId}`, postModel);
            }
            
            if (toBoolean(response?.IsValid)) {
                //remove current page
                //removeLastHistoryEntry();
                navigate(getLastFromHistoryPath());
                let actionType = equalString(action, 'waitlist') ? 'Waitlist' : 'Unsubscribe';
                if (equalString(action, 'waitlist-edit')) {
                    actionType = 'Waitlist';
                }
                
                pNotify(`Successfully ${actionType}`);

            } else {
                displayMessageModal({
                    title: toBoolean(unsubscribe) ? 'Waitlist Error' : "Unsubscribe Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {},
                })
            }
            setIsLoading(false);
        },
    });
    
    const loadData = async () => {
        setIsFetching(true);

        let readUrl = `/app/Online/Events/SignUpToWaitingList?id=${orgId}&eventId=${eventId}&reservationId=${reservationId}`;
        if (equalString(action, 'waitlist-unsubscribe')) {
            readUrl = `/app/Online/Events/WaitingListPullOut?id=${orgId}&eventId=${eventId}&reservationId=${reservationId}`;
        }
        
        let response = await appService.get(navigate, readUrl);

        if (toBoolean(response?.IsValid)) {
            setEventDetails(response.Data);
            formik.setFieldValue("FamilyMembers", response.Data.FamilyMembers);
        } else {
            displayMessageModal({
                title: 'Error',
                html: (onClose) => `${response?.Message}`,
                type: "error",
                buttonType: modalButtonType.DEFAULT_CLOSE,
                onClose: () => {

                },
            })
        }

        setIsFetching(false);
    }


    useEffect(() => {
        let members = [];

        if (anyInList(formik?.values?.FamilyMembers)) {
            members = formik.values?.FamilyMembers;
        }

        let checkedMembers = members.filter(member => toBoolean(member.IsChecked));
        let membersWithDue = checkedMembers.filter(member => member.Price > 0);

        let totalPriceToPay = membersWithDue.reduce((sum, member) => sum + member.Price, 0);

        let paymentLists = [];
        
        if (anyInList(membersWithDue) && !isNullOrEmpty(action, 'waitlist-unsubscribe')){
            paymentLists.push({
                label: 'Member(s)',
                items: membersWithDue.map(member => ({
                    label: member.FullName,
                    price: member.Price
                }))
            });
        }

        let paymentData = {
            list: paymentLists,
            totalDue: totalPriceToPay,
            requireOnlinePayment: toBoolean(eventDetails?.RequireOnlinePayment),
            show: totalPriceToPay > 0,
            holdTimeForReservation: eventDetails?.HoldTimeForReservation
        };

        let actionType = equalString(action, 'waitlist') ? 'Waitlist' : 'Unsubscribe';
        if (equalString(action, 'waitlist-edit')) {
            actionType = 'Waitlist';
        }
        
        if (isNullOrEmpty(errorData)) {
            setFooterContent(<PaymentDrawerBottom paymentData={paymentData} group={true}>
                <Button type="primary"
                        block
                        danger={equalString(action, 'waitlist-unsubscribe')}
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isFetching}
                        onClick={formik.handleSubmit}>
                    {actionType}
                </Button>
            </PaymentDrawerBottom>)
        } else {
            setFooterContent('');
        }


    }, [isFetching, isLoading, formik.values, errorData])
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        let actionType = equalString(action, 'waitlist') ? 'Waitlist' : 'Unsubscribe from Waitlist';
        if (equalString(action, 'waitlist-edit')) {
            actionType = 'Waitlist';
        }
        
        setHeaderTitle(actionType);
        //setFooterContent('');
        loadData();
    }, [])

    const toggleInitialCheck = (index) => {
        formik.setFieldValue(
            'FamilyMembers',
            formik.values.FamilyMembers.map((member, idx) =>
                idx === index ? { ...member, IsChecked: !member.IsChecked } : member
            )
        );
    };
    
    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block style={{height: `60px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {(!isNullOrEmpty(eventDetails) && !isFetching) &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>

                        <Flex vertical={true}>
                            <EventDetailsPartial event={eventDetails} page={action} />
                        </Flex>

                        {(countListItems(authDataOrgMemberIds) > 1 && anyInList(formik.values.FamilyMembers)) &&
                            <>
                                <EventLeagueFamilyMembersBlock formik={formik} members={authDataOrgMemberIds} toggleInitialCheck={toggleInitialCheck} />
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default EventJoinWaitlist
