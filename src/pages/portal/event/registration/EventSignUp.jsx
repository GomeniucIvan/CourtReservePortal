import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AppProvider, useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, List, Typography, Switch, Skeleton } from "antd";
import * as Yup from "yup";
import appService, {apiRoutes} from "@/api/app.jsx";
import {AuthProvider, useAuth} from "@/context/AuthProvider.jsx";

import {
    anyInList, displayMinMaxAgeValue,
    equalString, getValueOrDefault,
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
import {getLastFromHistoryPath, removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {
    eventValidResponseRedirect
} from "@/utils/RedirectUtils.jsx";
import EventSignUpPartial from "@portal/event/registration/modules/EventSignUpPartial.jsx";
import EventSignUpDetails from "@portal/event/registration/modules/EventSignUpDetails.jsx";
import EventSignUpSkeleton from "@portal/event/registration/modules/EventSignUpSkeleton.jsx";
import {generateEventPostModel} from "@portal/event/registration/modules/functions.jsx";
const {Text} = Typography;

function EventSignUp() {
    const navigate = useNavigate();
    const {orgId, authData, authDataOrgMemberIds} = useAuth();
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
    const [isFamilyMember, setIsFamilyMember] = useState(false);
    const [maxAllowedGuests, setMaxAllowedGuests] = useState(0);
    
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
            
            let formResponse = generateEventPostModel(formik, isFamilyMember, setIsLoading,eventId, reservationId);
            
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
            
            let postModel = formResponse.PostModel;

            let response = null;
            if (isFullEventReg) {
                response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_FullEvent_Post?id=${orgId}`,postModel);
            } else {
                response = await appService.postRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_DropIn_Post?id=${orgId}`,postModel);
            }

            setIsLoading(false);
            if (toBoolean(response?.IsValid)) {
                removeLastHistoryEntry();
                
                eventValidResponseRedirect(response, navigate, {
                    orgId: orgId,
                    eventName: event.EventName,
                    reservationNumber: reservationNumber
                });
            } else {
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
        
        let checkedMembers = members.filter(member => toBoolean(member.IsChecked));
        let checkedMembersWithMaxGuests = checkedMembers.filter(member => !isNullOrEmpty(member.MaxGuests));
        setMaxAllowedGuests(checkedMembersWithMaxGuests.some(v => toBoolean(v.AllowGuests)) ? checkedMembersWithMaxGuests.reduce((sum, member) => sum + member.MaxGuests, 0) : 0)
        
        let membersWithDue = checkedMembers.filter(member => member.PriceToPay > 0 && !toBoolean(member.IsMonthlyFree));
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
                Register
            </Button>
        </PaymentDrawerBottom>)
    }, [isFetching, isLoading, formik.values])

    const getDisplayDynamicRatings = (rating, separator = ' ') => {
        if (!rating || equalString(rating.RatingCategoryType, 2)) {
            return <>Any</>;
        }

        const displayDuprRating = (value, precision) => {
            return value.toFixed(precision ?? 2);
        };

        const result = [];

        const format = (label, min, max) => {
            if (min != null || max != null) {
                return (
                    <span key={label}>
                        {label}:{' '}
                        {min != null ? `Min ${displayDuprRating(min, rating.Precision)}` : ''}{' '}
                        {max != null ? `Max ${displayDuprRating(max, rating.Precision)}` : ''}
                    </span>
                );
            }
            return null;
        };

        const singles = format('Singles', rating.MinSingles, rating.MaxSingles);
        const doubles = format('Doubles', rating.MinDoubles, rating.MaxDoubles);
        const mixed = format('Mixed', rating.MinMixed, rating.MaxMixed);
        const skinny = format('Skinny Singles', rating.MinSkinnySingles, rating.MaxSkinnySingles);

        [singles, doubles, mixed, skinny].forEach(item => {
            if (item) result.push(item);
        });

        if (result.length === 0) {
            return <>Any</>;
        }

        return (
            <>
                {result.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span>{separator}</span>}
                        {item}
                    </React.Fragment>
                ))}
            </>
        );
    }
    
    const restrictionHtml = (eventData) => {
        return (<Flex vertical={true} gap={token.paddingMD}>
            {moreThanOneInList(authDataOrgMemberIds) &&
                <>
                    <Text>No Family Members are eligible. See restrictions below.</Text>
                </>
            }
            {oneListItem(authDataOrgMemberIds) &&
                <>
                    <Text>You are not eligible. See restrictions below.</Text>
                </>
            }

            <Flex vertical={true} gap={token.paddingXS}>
                {!isNullOrEmpty(eventData?.GenderRestriction) &&
                    <Text><Text type={'secondary'}>Gender Restriction: </Text> <Text>{eventData.GenderRestriction}</Text></Text>
                }
                {(!isNullOrEmpty(eventData?.MinAgeRestriction) || !isNullOrEmpty(eventData?.MaxAgeRestriction)) &&
                    <Text><Text type={'secondary'}>Age Restriction: </Text> <Text>{displayMinMaxAgeValue(eventData?.MinAgeRestriction, eventData?.MaxAgeRestriction)}</Text></Text>
                }
                {anyInList(eventData?.EventRatingCategoriesRestriction) &&
                    <>
                        {eventData.EventRatingCategoriesRestriction.map((ratingCat, index) => {
                            let isDynamic = equalString(ratingCat.RatingCategoryType, 2);
                            if (isDynamic) {
                                return (
                                    <Text key={index}>
                                        <Text type={'secondary'}>{ratingCat.CategoryName} Restriction: </Text> <Text>{getDisplayDynamicRatings(ratingCat, ' | ')}</Text>
                                    </Text>
                                )
                            } else {
                                if (anyInList(ratingCat?.RatingCategoryRatings)) {
                                    let ratingNameList = ratingCat.RatingCategoryRatings.map(f => f.RatingName);
                                    
                                    return (
                                        <Text key={index}>
                                            <Text type={'secondary'}>{ratingCat.CategoryName} Restriction: </Text> <Text>{ratingNameList.join(", ")}</Text>
                                        </Text>
                                    )
                                } else {
                                    return (
                                        <Text key={index}>
                                           <Text type={'secondary'}>{ratingCat.CategoryName} Restriction: </Text> <Text>Any</Text>
                                        </Text>
                                    )
                                }
                            }
                        })}
                    </>
                }

                {anyInList(eventData?.MemberGroups) &&
                    <Text key={index}>
                        <Text type={'secondary'}>Member Group(s) Restriction: </Text> <Text>{eventData?.MemberGroups.map(v => v.NavigationName).join(", ")}</Text>
                    </Text>
                }
                
                {(toBoolean(eventData?.IsNotAllowedToSignUpForOpenPlayEvents)) &&
                    <Text><Text type={'secondary'}>Registration:</Text> <Text>Not allowed</Text></Text>
                }
            </Flex>
        </Flex>)
    }
    
    const loadData = async (refresh, isFullEventForce) => {
        setIsFetching(true);
        let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_Get?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}&ajaxCall=true&isFullEventReg=${toBoolean(isFullEventForce) || toBoolean(isFullEventReg)}`);

        if (toBoolean(response?.isValid)){
            setEvent(response.Data);

            setIsFamilyMember(anyInList(response.Data.FamilyMembers));

            let allMembers = [];
            allMembers.push({
                ...response.Data.CurrentMember,
                IsChecked: anyInList(response.Data.FamilyMembers) ? toBoolean(response.Data.CurrentMember?.IsChecked): true
            });

            response.Data.FamilyMembers.map(familyMember => {
                allMembers.push(familyMember);
            })

            let udfs = response.Data.Udfs;

            if (anyInList(udfs)){
                allMembers.forEach(member => {
                    member.MemberUdfs = udfs;
                });
            }
            if (toBoolean(isFullEventReg)){
                allMembers = allMembers.filter(member => response.Data.EligibleUsersToSignByEntireCost.includes(member.Id));
            }
            
            formik.setFieldValue("Members", allMembers);
        } else {
            //restrictions
            if (!isNullOrEmpty(response?.Data)) {
                navigate(getLastFromHistoryPath());
                let respData = response.Data;

                displayMessageModal({
                    title: 'Registration Error',
                    html: (onClose) => restrictionHtml(respData),
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            } else {
                displayMessageModal({
                    title: "Registration Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {
                        navigate(getLastFromHistoryPath());
                    },
                })
            }
        }
        setIsFetching(false);
        resetFetch();
    }
    
    return (
        <>
            <EventSignUpSkeleton isFetching={isFetching} />

            {(!isFetching && !isNullOrEmpty(event)) &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={token.padding}>
                        <EventSignUpDetails event={event} />
                        <EventSignUpPartial isFetching={isFetching}
                                            formik={formik} 
                                            event={event}
                                            maxAllowedGuests={maxAllowedGuests}
                                            loadData={loadData}
                                            guestBlockRef={guestBlockRef} />
                    </Flex>
                </PaddingBlock>
            }
        </>
    )
}

export default EventSignUp
