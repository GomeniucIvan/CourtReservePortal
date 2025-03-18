import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {validateReservationGuests, validateReservationMatchMaker, validateUdfs} from "@/utils/ValidationUtils.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    isNullOrEmpty,
    nullToEmpty,
    oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {fromDateTimeStringToDateTime, fromTimeSpanString} from "@/utils/DateUtils.jsx";

export const reservationCreateOrUpdateInitialValues = {
    ReservationTypeId: '',
    Duration: '',
    CourtId: '',
    MemberId: '',
    CustomSchedulerId: '',
    RegisteringMemberId: null,
    SelectedResourceName: null,
    StartTime: '',
    EndTime: '',
    IsOpenReservation: false,
    InstructorName: '',
    SelectedReservationMembers: [],
    ReservationGuests: [],
    FeeResponsibility: '',
    ResourceIds: [],
    OrgId: '',
    Date: '',
    Udfs: [],

    //
    IsConsolidatedScheduler: false,
    IsFromDynamicSlots: false,
    InstructorId: '',
    ReservationQueueId: '',
    ReservationQueueSlotId: '',

    //match maker   
    SportTypeId: '',
    MatchMakerTypeId: '',
    MatchMakerGender: '',
    MatchMakerRatingCategoryId: null,
    MatchMakerRatingCategoryRatingIds: [],
    MatchMakerMemberGroupIds: [],
    MatchMakerMinNumberOfPlayers: null,
    MatchMakerMaxNumberOfPlayers: null,
    Description: null,
    MatchMakerIsPrivateMatch: false,
    MatchMakerJoinCode: '',
    DisclosureAgree: false
}

export const reservationCreateOrUpdateFormik = (initialValues,
                                                validationSchema,
                                                t,
                                                matchMaker,
                                                reservationMembers,
                                                authData,
                                                setIsLoading,
                                                orgId,
                                                navigate,
                                                isLesson,
                                                isUpdate) => {
    let formik = useCustomFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validation: () => {
            const isValidUdfs = validateUdfs(t, formik);
            const isValidMatchMaker = validateReservationMatchMaker(t, formik, matchMaker);
            const isGuests = validateReservationGuests(t, formik, reservationMembers, authData);
            return isValidUdfs && isValidMatchMaker && isGuests;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            values.SelectedMembers = reservationMembers;
            values.DateString = values.Date;

            let response = null;
            
            if (isUpdate) {
                values.MemberId = 
                response = await appService.post(`/app/Online/Reservations/UpdateMyReservation?id=${orgId}`, values);  
            } else {
                response = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/CreateReservation?id=${orgId}`, values);
            }
            
            if (toBoolean(response?.IsValid)){
                //remove current page
                removeLastHistoryEntry();

                if (!isNullOrEmpty(response?.Path)) {
                    navigate(response?.Path);
                }

                if (!isNullOrEmpty(response?.Message)){
                    pNotify(response.Message);
                } else {
                    if (isUpdate) {
                        pNotify(isLesson ? 'Lesson successfully updated.' : 'Reservation successfully updated.');
                    } else {
                        pNotify(isLesson ? 'Lesson successfully created.' : 'Reservation successfully created.');
                    }
                }
                setIsLoading(false);
            } else{
                setIsLoading(false);

                displayMessageModal({
                    title: "Error",
                    html: (onClose) => response.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            }
        },
    })

    return formik;
}

export const reservationCreateOrUpdateLoadDataSuccessResponse = async (r,
                                                                       setReservation,
                                                                       setMiscFeesQuantities,
                                                                       setMatchMaker,
                                                                       setMatchMakerShowSportTypes,
                                                                       setMatchMakerMemberGroups,
                                                                       setMatchMakerRatingCategories,
                                                                       setShowResources,
                                                                       setCustomFields,
                                                                       setDisclosure,
                                                                       formik,
                                                                       initialValues,
                                                                       setIsFetching,
                                                                       authData,
                                                                       start,
                                                                       end
) => {
    let incResData = r.Data.ReservationModel;
    let matchMakerData = r.Data.MatchMakerData;
    let matchMakerShowSportTypes = toBoolean(r.Data.MatchMakerShowSportTypes);
    setReservation(incResData);

    if (isNullOrEmpty(incResData.InstructorId)){
        setMiscFeesQuantities(anyInList(incResData?.MiscFeesSelectListItems) ? incResData?.MiscFeesSelectListItems.map((item) => ({
            Text: item.Text,
            Value: item.Value,
            Quantity: 0,
        })) : []);
    }

    setMatchMaker(matchMakerData);
    setMatchMakerShowSportTypes(matchMakerShowSportTypes);
    setMatchMakerMemberGroups(r.Data.MatchMakerMemberGroups);
    setMatchMakerRatingCategories(r.Data.MatchMakerRatingCategories);
    setShowResources(r.Data.ShowResources && toBoolean(authData?.AllowMembersToBookResources));
    setCustomFields(incResData.Udf || []);

    if (toBoolean(r.Data.Disclosure?.Show)) {
        setDisclosure(r.Data.Disclosure);
    }

    let selectedSportTypeId = null;

    if (matchMakerShowSportTypes) {
        if (!isNullOrEmpty(matchMakerData) && oneListItem(matchMakerData.ActiveSportTypes)) {
            selectedSportTypeId = matchMakerData.ActiveSportTypes.first()?.Id;
        }
    }

    await formik.setValues({
        ...initialValues,
        SportTypeId: selectedSportTypeId,
        Udfs: incResData.Udf || [],
        MemberId: incResData.MemberId,
        CustomSchedulerId: incResData.CustomSchedulerId,
        IsConsolidatedScheduler: incResData.IsConsolidatedScheduler,
        IsFromDynamicSlots: incResData.IsFromDynamicSlots,
        InstructorId: incResData.InstructorId,
        ReservationQueueId: incResData.ReservationQueueId,
        ReservationQueueSlotId: incResData.ReservationQueueSlotId,
        OrgId: incResData.OrgId,
        ReservationId: incResData.ReservationId,
        Duration: incResData.Duration,
        CourtId: incResData.CourtId,
        RegisteringMemberId: incResData.RegisteringMemberId,
        SelectedResourceName: incResData.SelectedResourceName,
        StartTime: fromTimeSpanString(start),
        EndTime: fromTimeSpanString(end),
        Date: fromDateTimeStringToDateTime(incResData.DateStringDisplay),
        InstructorName: incResData.InstructorName,
    });

    setIsFetching(false);
}

export const reservationCreateOrUpdateOnReservationTypeChange = async (setLoading,
                                                                       formik,
                                                                       start,
                                                                       reservation,
                                                                       authData,
                                                                       orgId,
                                                                       setDurations,
                                                                       setCustomFields) => {
    setLoading('Duration', true);

    let reservationTypeData = {
        reservationTypeId: formik?.values?.ReservationTypeId,
        startTime: start,
        selectedDate: start,
        uiCulture: authData?.UiCulture,
        useMinTimeAsDefault: reservation?.UseMinTimeByDefault,
        courtId: formik?.values?.CourtId,
        courtType: reservation?.CourtTypeEnum,
        endTime: reservation?.EndTime,
        isDynamicSlot: reservation?.IsFromDynamicSlots,
        instructorId: reservation?.InstructorId,
        customSchedulerId: reservation?.CustomSchedulerId,
        selectedDuration: formik?.values?.Duration
    }

    let rDurations = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/GetDurationDropdown?id=${orgId}&${encodeParamsObject(reservationTypeData)}`);

    setDurations(rDurations);
    const selectedDuration = rDurations.find(duration => duration.Selected);

    if (equalString(formik?.values?.Duration, selectedDuration?.Value)) {
        //await reloadPlayers();
    } else if (selectedDuration) {
        await formik.setFieldValue('Duration', selectedDuration.Value);
    }

    setLoading('Duration', false);

    let udfData = {
        reservationTypeId: formik?.values?.ReservationTypeId,
        uiCulture: authData?.UiCulture,
        reservationId: nullToEmpty(formik?.values?.ReservationId),
        allowMembersToUpdateReservations: toBoolean(reservation?.AllowMembersToUpdateReservations),
    }

    let rUdf = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/Online/AjaxReservation/Api_GetUdfsByReservationTypeOnReservationCreate?id=${orgId}&${encodeParamsObject(udfData)}`);
    if (toBoolean(rUdf?.IsValid)) {
        setCustomFields(rUdf.Data);

        await formik.setFieldValue('Udfs', rUdf.Data.map(udf => {
            const existingUdf = formik?.values?.Udfs.find(u => u.Id === udf.Id);
            
            return {
                ...udf,
                Value: existingUdf ? existingUdf.Value : ''
            }
        }));
    }
}

export const reservationCreateOrUpdateLoadEndTime = async (formik, start, authData, orgId, reloadCourts, reloadPlayers) => {
    if (!isNullOrEmpty(formik?.values?.Duration)) {
        let entTimeData = {
            reservationTypeId: formik?.values?.ReservationTypeId,
            startTime: start,
            selectedDate: start,
            uiCulture: authData?.UiCulture,
            duration: formik?.values?.Duration
        }

        let rEndTime = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/CalculateReservationEndTime?id=${orgId}&${encodeParamsObject(entTimeData)}`);

        if (rEndTime?.IsValid) {
            await formik.setFieldValue('EndTime', rEndTime.data);
            await reloadCourts(rEndTime.data);
        }

        await reloadPlayers();
    }
}

export const reservationCreateOrUpdateLoadResources = async (showResources,
                                                             setLoading,
                                                             start,
                                                             formik,
                                                             reservation,
                                                             courts,
                                                             authData,
                                                             orgId,
                                                             setResources) => {
    if (showResources) {
        setLoading('ResourceIds', true);

        let resourcesData = {
            Date: start,
            startTime: start,
            endTime: formik?.values?.EndTime,
            courtTypes: reservation?.CourtTypeEnum,
            selectedCourts: courts,
            MembershipId: reservation?.MembershipId,
            ReservationTypeId: formik?.values?.ReservationTypeId,
            customSchedulerId: reservation?.CustomSchedulerId,
            uiCulture: authData?.UiCulture,
            duration: formik?.values?.Duration,
            CurrentReservataionId: nullToEmpty(formik?.values?.ReservationId),
        }

        let rResources = await appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/api/v1/portalreservationsapi/Api_Reservation_GetAvailableResourcesOnReservationCreate?id=${orgId}&${encodeParamsObject(resourcesData)}`);
        let responseResources = rResources || [];
        setResources(responseResources);

        const selectedResourceIds = responseResources
            .filter(resource => resource.AutoSelect)
            .map(resource => resource.Id);

        await formik.setFieldValue('ResourceIds', selectedResourceIds)
        setLoading('ResourceIds', false);
    }
}

export const reservationCreateOrUpdateOnFormikReservationTypeChange = (formik,
                                                                       setSelectedReservationType,
                                                                       reservation) => {
    if (!isNullOrEmpty(formik?.values?.ReservationTypeId)) {
        setSelectedReservationType(null);

        let currentReservationType = reservation?.ReservationTypes?.find(v => equalString(v.Id, formik?.values?.ReservationTypeId));
        setSelectedReservationType(currentReservationType);

        if (equalString(currentReservationType?.CalculationType, 2) || equalString(currentReservationType?.CalculationType, 3)) {
            formik.setFieldValue('FeeResponsibility', 2);
        } else {
            formik.setFieldValue('FeeResponsibility', 1);
        }
    } else {
        setSelectedReservationType(null);
    }
}

export const reservationCreateOrUpdateReloadPlayers = async (setLoading,
                                                             formik,
                                                             isGuestRemove,
                                                             incGuests,
                                                             reservationMembers,
                                                             orgMemberIdToRemove,
                                                             reservation,
                                                             selectedReservationType,
                                                             orgId,
                                                             authData,
                                                             setPaymentList,
                                                             setTotalPriceToPay,
                                                             setReservationMembers,
                                                             setPlayersModelData) => {
    setLoading('SelectedReservationMembers', true);
    
    let registeringOrganizationMemberId = null;
    let membersWithDisclosures = [];
    let refillDisclosureMemberIds = [];

    let resGuests = formik?.values?.ReservationGuests || [];
    let numberOfGuests = resGuests.length - (isGuestRemove ? 1 : 0);
    let selectedNumberOfGuests = isNullOrEmpty(incGuests) ? numberOfGuests : incGuests.length;

    const firstOwnerMemberId = reservationMembers.find(member => toBoolean(member.IsOwner));
    let filteredReservationMembers = reservationMembers.filter(
        member => member.OrgMemberId !== orgMemberIdToRemove
    );

    if (!equalString(firstOwnerMemberId, formik?.values?.RegisteringMemberId)) {
        filteredReservationMembers = reservationMembers.filter(
            member => member.OrgMemberId !== orgMemberIdToRemove && !toBoolean(member.IsOwner)
        );
    }
    
    let postData = {
        Start: formik?.values?.StartTime,
        End: toBoolean(reservation?.IsAllowedToPickStartAndEndTime) ? formik?.values?.EndTime : formik?.values?.EndTime,
        CourtType: reservation?.CourtTypeEnum,
        ResourceIds: formik?.values?.ResourceIds,
        MiscFees: null,  //costs,
        ReservationTypeId: formik?.values?.ReservationTypeId,
        RegisteringOrganizationMemberId: registeringOrganizationMemberId,
        RegisteringMemberId: formik?.values?.RegisteringMemberId,
        Date: reservation?.DateStartTimeStringDisplay,
        MembersString: JSON.stringify(filteredReservationMembers.map(member => ({
            OrgMemberId: !isNullOrEmpty(member.MemberOrgId) ? member.MemberOrgId : member.OrgMemberId,
            PriceToPay: member.PriceToPay,
            MemberId: member.MemberId,
            FirstName: member.FirstName,
            LastName: member.LastName,
            MemberFamilyId: member.MemberFamilyId,
            OrgMemberFamilyId: member.OrgMemberFamilyId,
            Email: member.Email,
            MembershipNumber: member.MembershipNumber,
        }))),
        InstructorId: reservation?.InstructorId,
        MembersWithDisclosures: membersWithDisclosures,
        RefillMemberDisclosures: toBoolean(reservation?.RefillMemberDisclosures),
        NumberOfGuests: numberOfGuests,
        SelectedNumberOfGuests: selectedNumberOfGuests,
        GuestsString: JSON.stringify(resGuests),
        IsOpenReservation: toBoolean(formik?.values?.IsOpenReservation) && toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker),
        CourtId: formik?.values?.CourtId,
        FeeResponsibility: formik?.values.FeeResponsibility,
        AuthUserId: reservation?.MemberId,
        IsMobileLayout: true,
        IsFamilyMember: anyInList(reservation?.FamilyMembers),
        IsModernTemplate: true,
        ReservationId: nullToEmpty(formik?.values?.ReservationId),
        IsAllowedToEditPlayers: reservation?.IsAllowToEditReservationPlayers,
    };

    let responseReservationGuests = [];
    let r = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxController/Api_CalculateReservationCostMemberPortal?id=${orgId}&authUserId=${reservation.MemberId}&uiCulture=${authData?.uiCulture}&isMobileLayout=true`, postData);
    if (r.IsValid) {
        setPaymentList(r.Data.PaymentList)
        setTotalPriceToPay(r.Data.TotalCost)
        setReservationMembers(r.Data.MemberData.SelectedMembers);
        responseReservationGuests = r.Data.MemberData.ReservationGuests || [];

        await formik.setFieldValue('ReservationGuests', responseReservationGuests.map(resGuest => ({
                ...resGuest,
                Status: ''
            }))
        );

        setPlayersModelData(r.Data.MemberData);
    }

    setLoading('SelectedReservationMembers', false);
    setLoading('ReservationGuests', false);

    if (!isNullOrEmpty(incGuests)){
        return responseReservationGuests;
    }

    return null;
}

export const reservationCreateOrUpdateReloadCourts = async (setLoading,
                                                            reservation,
                                                            start,
                                                            endTime,
                                                            formik,
                                                            authData,
                                                            orgId,
                                                            setCourts) => {
    setLoading('CourtId', true);

    const courtType = ''; // jQuery("#@Html.IdFor(c => c.SelectedCourtTypeId)").val();
    let customSchedulerId = '';
    let cIds = '';
    let rq = '';
    // @if (isFromWaitlisting)
    //     {
    //     @:cIds = '@Model.QueuedCourtIds';
    //     @:rq='@Model.ReservationQueueSlotId';
    //     }
    //

    if (!isNullOrEmpty(reservation.InstructorId) || !isNullOrEmpty(reservation.CustomSchedulerId)) {
        customSchedulerId = reservation.CustomSchedulerId;
    }

    let courtsData = {
        Date: start,
        selectedDate: start, //resource call
        StartTime: start,
        EndTime: endTime || formik?.values?.EndTime,
        CourtTypesString: courtType,
        UiCulture: authData?.UiCulture,
        timeZone: authData?.TimeZone,
        customSchedulerId: customSchedulerId,
        instructorId: reservation.InstructorId,
        Duration: formik?.values?.Duration,
        //AllowPastReservationsUpToXMinutes: '@org.AllowPastReservationsUpToXMinutes',
        ResourceId: reservation.SelectedResourceId,
        CourtIdsString: cIds,
        ReservationQueueSlotId: rq,
        CurrentReservataionId: nullToEmpty(formik?.values?.ReservationId),
    };
    let resp = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/Online/ReservationsApi/GetAvailableCourtsMemberPortal?id=${orgId}&${encodeParamsObject(courtsData)}`);

    setCourts(resp)
    setLoading('CourtId', false);
}