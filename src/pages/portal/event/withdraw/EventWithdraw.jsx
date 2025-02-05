import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AppProvider, useApp} from "@/context/AppProvider.jsx";
import {Button, Card, Flex, Switch, Typography} from "antd";
import * as Yup from "yup";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList, oneListItem,
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
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
const {Title} = Typography;

function EventWithdraw() {
    const {orgId, authData} = useAuth();
    const [event, setEvent] = useState(null);
    const [isFamilyMember, setIsFamilyMember] = useState(false);

    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reservationId = queryParams.get("reservationId");
    const eventId = queryParams.get("eventId");
    const navigate = useNavigate();
    
    const {
        setIsFooterVisible,
        setFooterContent,
        isLoading,
        setIsLoading,
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
        PullOutReason: Yup.string().required('Reason is required'),
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

            let response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/Online/EventPullOutApi/PullOutFromEvent?id=${orgId}`,postModel);
            
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

            allMembers = allMembers.filter(v => v.IsChecked);
            console.log(allMembers);
            formik.setFieldValue("Members", allMembers);
        }
        setIsFetching(false);
        resetFetch();
    }

    const toggleInitialCheck = (orgMemberId) => {
        formik.setFieldValue(
            'Members',
            formik.values.Members.map((member, idx) =>
                equalString(member.OrganizationMemberId, orgMemberId) ? { ...member, IsChecked: !member.IsChecked } : member
            )
        );
    }

    const toggleGuestCheck = (guest) => {
        formik.setFieldValue(
            'ReservationGuests',
            formik.values.ReservationGuests.map((resGuest, idx) =>
                equalString(resGuest.Guid, guest.Guid) ? { ...guest, IsChecked: !guest.IsChecked } : guest
            )
        );
    }
    
    return (
        <>
            <EventSignUpSkeleton isFetching={isFetching} />

            {!isFetching &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            <EventSignUpDetails event={event} />

                            {(isFamilyMember || anyInList(formik.values.ReservationGuests)) &&
                                <Card>
                                    {isFamilyMember &&
                                        <>
                                            {formik.values.Members.map((member, index) => {
                                                let isDisabled = oneListItem(formik.values.Members) && !anyInList(formik.values.ReservationGuests)
                                                
                                                return (
                                                    <Flex vertical={true} gap={token.padding} flex={1} key={index}>
                                                        <Flex justify={'space-between'} align={'center'} onClick={() => {
                                                            if (!isDisabled) {
                                                                toggleInitialCheck(index)
                                                            }
                                                        }}>
                                                            <Title level={3}>
                                                                {member.FullName}
                                                            </Title>
                                                            <Switch checked={member.IsChecked} 
                                                                    disabled={isDisabled}
                                                                    onChange={() => toggleInitialCheck(index)}/>
                                                        </Flex>
                                                    </Flex>
                                                )
                                            })}
                                        </>
                                    }

                                    {formik.values.ReservationGuests.map((guest, index) => {
                                        return (
                                            <Flex vertical={true} gap={token.padding} flex={1} key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <Title level={3}>
                                                        {guest.FullName}
                                                    </Title>
                                                    <Switch checked={guest.IsChecked} onChange={() => toggleGuestCheck(guest)}/>
                                                </Flex>
                                            </Flex>
                                        )
                                    })}
                                </Card>
                            }

                            <FormTextarea formik={formik} label={'Reason'} name={'PullOutReason'} max={350} isRequired={toBoolean(authData.RequireReasonForEventCancellations)}/>
                        </Flex>
                    </PaddingBlock>
                </>
            }
        </>
    )
}

export default EventWithdraw
