import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AppProvider, useApp} from "@/context/AppProvider.jsx";
import {Button } from "antd";
import * as Yup from "yup";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    toBoolean
} from "@/utils/Utils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import EventSignUpPartial from "@portal/event/registration/modules/EventSignUpPartial.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import EventSignUpDetails from "@portal/event/registration/modules/EventSignUpDetails.jsx";
import EventSignUpSkeleton from "@portal/event/registration/modules/EventSignUpSkeleton.jsx";

function EventWithdraw() {
    const navigate = useNavigate();
    const {orgId, authData} = useAuth();
    const [event, setEvent] = useState(null);
    const [isFamilyMember, setIsFamilyMember] = useState(false);

    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reservationId = queryParams.get("reservationId");
    const eventId = queryParams.get("eventId");
    const guestBlockRef = useRef(null);
    
    const {
        setIsFooterVisible,
        setFooterContent,
        isLoading,
        setIsLoading,
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
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    danger={true}
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                Withdrawn
            </Button>
        </PaddingBlock>)
    }, [isFetching, isLoading])


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
            
            
            return true;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            let familyMembers = [];
            let currentMember = values.Members[0];

            if (isFamilyMember) {
                familyMembers = values.Members;

                if (!familyMembers.some(v => toBoolean(v.IsChecked))) {
                    setIsLoading(false);
                    displayMessageModal({
                        title: "Registration Error",
                        html: (onClose) => 'At least one registrant is required to be selected.',
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
                PullOutReason: values.PullOutReason,
                ReservationGuests: formik.values.ReservationGuests,
                EventId: eventId,
                SelectedReservation: {
                    Id: reservationId
                }
            }

            let response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/PullOutFromEvent?id=${orgId}`,postModel);
            setIsLoading(false);
        },
    });

    const loadData = async (refresh) => {
        setIsFetching(true);
        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventPullOutApi/PullOutFromEvent?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}`);

        if (toBoolean(response?.isValid)){
            setEvent(response.Data);
            let allMembers = [];
            allMembers.push(response.Data.CurrentMember);

            setIsFamilyMember(anyInList(response.Data.FamilyMembers));
            
            response.Data.FamilyMembers.map(familyMember => {
                allMembers.push(familyMember);
            })

            allMembers = allMembers.filter(v => v.InitialCheck);
            formik.setFieldValue("Members", allMembers);
        }
        setIsFetching(false);
        resetFetch();
    }
    
    return (
        <>
            <EventSignUpSkeleton isFetching={isFetching} />
            {!isFetching && 
                <>
                    <EventSignUpDetails event={event} />

                    <EventSignUpPartial isFetching={isFetching}
                                        formik={formik}
                                        event={event}
                                        loadData={loadData}
                                        type={'withdrawn'}
                                        isFamilyMember={isFamilyMember}
                                        guestBlockRef={guestBlockRef} />
                </>
            }
        </>
    )
}

export default EventWithdraw
