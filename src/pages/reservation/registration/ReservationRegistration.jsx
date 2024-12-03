
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Divider, Flex, Segmented, Skeleton, Typography} from "antd";
import mockData from "../../../mocks/reservation-data.json";
import * as Yup from "yup";
import {cx} from "antd-style";
import {useApp} from "../../../context/AppProvider.jsx";
import {useLoadingState} from "../../../utils/LoadingUtils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {
    anyInList,
    encodeParam,
    encodeParamsObject,
    equalString, fullNameInitials,
    isNullOrEmpty, oneListItem, randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {
    dateTimeToFormat,
    dateToTimeString,
    fromAspDateToString
} from "../../../utils/DateUtils.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import {useTranslation} from "react-i18next";
import RegistrationGuestBlock from "../../../components/registration/RegistrationGuestBlock.jsx";
import useCustomFormik from "../../../components/formik/CustomFormik.jsx";
import {
    validateReservationGuests,
    validateReservationMatchMaker,
    validateUdfs
} from "../../../utils/ValidationUtils.jsx";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {ProfileRouteNames} from "../../../routes/ProfileRoutes.jsx";
import {setPage, toRoute} from "../../../utils/RouteUtils.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import {removeLastHistoryEntry} from "../../../toolkit/HistoryStack.js";
import ReservationRegistrationPlayers from "./ReservationRegistration.Players.jsx";
import ReservationRegistrationMatchMaker from "./ReservationRegistration.MatchMaker.jsx";
import ReservationRegistrationMiscItems from "./ReservationRegistration.MiscItems.jsx";
import ReservationRegistrationTermsAndCondition from "./ReservationRegistration.TermsAndCondition.jsx";
import PaymentDrawerBottom from "../../../components/drawer/PaymentDrawerBottom.jsx";

const {Title, Text, Link} = Typography;

function ReservationRegistration() {
    const navigate = useNavigate();
    const {orgId, authData} = useAuth();
    const [submitButtonText, setSubmitButtonText] = useState('Save');
    const [isFetching, setIsFetching] = useState(true);
    const location = useLocation();
    const {dataItem, start, end, customSchedulerId} = location.state || {};
    const {t} = useTranslation('');

    const {
        isMockData,
        setIsFooterVisible,
        shouldFetch,
        resetFetch,
        setHeaderRightIcons,
        setIsLoading,
        globalStyles,
        token,
        setFooterContent,
        isLoading,
        setDynamicPages
    } = useApp();
    
    const [reservation, setReservation] = useState(null);
    const [matchMaker, setMatchMaker] = useState(null);
    const [reservationTypes, setReservationTypes] = useState([]);
    const [durations, setDurations] = useState([]);
    const [courts, setCourts] = useState([]);
    const [shouldRebindPlayers, setShouldRebindPlayers] = useState(false);
    const [reservationMembers, setReservationMembers] = useState([]);
    const [playersModelData, setPlayersModelData] = useState(false);
    const [selectedReservationType, setSelectedReservationType] = useState(false);
    const [matchMakerShowSportTypes, setMatchMakerShowSportTypes] = useState(false);
    const [disclosure, setDisclosure] = useState(false);
    const [matchMakerMemberGroups, setMatchMakerMemberGroups] = useState(false);
    const [matchMakerRatingCategories, setMatchMakerRatingCategories] = useState(false);
    const [miscFeesQuantities, setMiscFeesQuantities] = useState([]);
    const [showResources, setShowResources] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [resources, setResources] = useState([]);
    const [showSearchPlayers, setShowSearchPlayers] = useState(false);
    const [validationSchema, setValidationSchema] = useState(Yup.object({}));
    const [totalPriceToPay, setTotalPriceToPay] = useState(0);

    let selectRegisteringMemberIdRef = useRef();
    let selectReservationTypeIdRef = useRef();
    let searchPlayerDrawerBottomRef = useRef();

    const initialValues = {
        ReservationTypeId: '',
        Duration: '',
        CourtId: '',
        MemberId: '',
        CustomSchedulerId: customSchedulerId,
        RegisteringMemberId: null,
        SelectedResourceName: null,
        StartTime: '',
        EndTime: '12:30 pm',
        IsOpenReservation: false,
        InstructorName: '',
        SelectedReservationMembers: [],
        ReservationGuests: [],
        FeeResponsibility: '',
        ResourceIds: [],
        OrgId: orgId,
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
        DisclosureAgree: false,
    };

    const fields = Object.keys(initialValues);
    const {loadingState, setLoading} = useLoadingState(fields);

    const getValidationSchema = () => {
        let schemaFields = {
            ReservationTypeId: Yup.string().required('Reservation Type is require.')
        };

        if(!isNullOrEmpty(disclosure)){
            schemaFields.DisclosureAgree = Yup.bool().oneOf([true], 'You must agree to the terms & conditions.');
        }

        return Yup.object(schemaFields);
    }

    useEffect(() => {
        setValidationSchema(getValidationSchema());
    }, [disclosure])

    const formik = useCustomFormik({
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
            console.log(formik)


            console.log(values)

            let response = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/CreateReservation?id=${orgId}`, values);
            if (toBoolean(response?.IsValid)){
                let data = response.Data;
                
                debugger;
                //portal-details-payment-editreservation
                let key = data.Key;

                //remove current page
                removeLastHistoryEntry();
                
                if (equalString(key, 'payment')){
                    navigate(ProfileRouteNames.PROFILE_BILLING_PAYMENTS);
                } else if (equalString(key, 'details') || equalString(key, 'portal')){
                    let route = toRoute(ProfileRouteNames.RESERVATION_DETAILS, 'id', data.ReservationId);
                    setPage(setDynamicPages, data.Name, route);
                    navigate(route);
                } else if (equalString(key, 'editreservation')){
                    let route = toRoute(ProfileRouteNames.RESERVATION_EDIT, 'id', data.ReservationId);
                    setPage(setDynamicPages, data.Name, route);
                    navigate(route);
                }
                if (!isNullOrEmpty(data.Message)){
                    pNotify(data.Message);
                }
                setIsLoading(false);
            } else{
                setIsLoading(false);
                
                ModalClose({
                    content: response.Message,
                    showIcon: false,
                    onClose: () => {

                    }
                });
            }
        },
    });

    const loadData = (refresh) => {
        if (isMockData) {
            const resv = mockData.create;
            setReservation(resv);
            setReservationTypes(resv.ReservationTypes);
            //setMatchTypes(resv.MatchTypes);
            setMiscFeesQuantities(reservation?.MiscFeesSelectListItems.map(() => 0));
            setIsFetching(false);
        } else {

            appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/CreateReservation?id=${orgId}&start=${start}&end=${end}&courtType=${encodeParam(dataItem.CourtTypeName)}&courtLabel=${encodeParam(dataItem.Label)}&customSchedulerId=${customSchedulerId}`).then(r => {
                if (toBoolean(r?.IsValid)) {
                    console.log(r.Data)
                    let incResData = r.Data.ReservationModel;
                    let matchMakerData = r.Data.MatchMakerData;
                    let matchMakerShowSportTypes = toBoolean(r.Data.MatchMakerShowSportTypes);

                    setReservation(incResData);
                    setMiscFeesQuantities(anyInList(reservation?.MiscFeesSelectListItems) ? reservation?.MiscFeesSelectListItems.map((item) => ({
                        Text: item.Text,
                        Value: item.Value,
                        Quantity: 0,
                    })) : []);
                    setMatchMaker(matchMakerData);
                    setMatchMakerShowSportTypes(matchMakerShowSportTypes);
                    setMatchMakerMemberGroups(r.Data.MatchMakerMemberGroups);
                    setMatchMakerRatingCategories(r.Data.MatchMakerRatingCategories);
                    setShowResources(r.Data.ShowResources && toBoolean(authData?.AllowMembersToBookResources));
                    setCustomFields(incResData.Udf || []);
                    formik.setFieldValue('Udfs', incResData.Udf || []);

                    if (toBoolean(r.Data.Disclosure?.Show)) {
                        setDisclosure(r.Data.Disclosure);
                    }

                    if (matchMakerShowSportTypes) {
                        if (!isNullOrEmpty(matchMakerData) && oneListItem(matchMakerData.ActiveSportTypes)) {
                            let firstActiveSportTypeId = matchMakerData.ActiveSportTypes.first()?.Id;
                            formik.setFieldValue('SportTypeId', firstActiveSportTypeId);
                        }
                    }

                    formik.setValues({
                        ...initialValues,
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
                        StartTime: dateToTimeString(start, true),
                        EndTime: dateToTimeString(end, true),
                        Date: fromAspDateToString(incResData.Date),
                    });

                    setIsFetching(false);

                    if (!toBoolean(r.Data.IsResourceReservation)) {
                        setLoading('ReservationTypeId', true);

                        if (!isNullOrEmpty(dataItem?.Value)) {
                            setCourts([{
                                DisplayName: `${dataItem.CourtTypeName} - ${dataItem.DisplayMobilSchedulerHeaderName}`,
                                Id: dataItem.Value
                            }]);
                            formik.setFieldValue('CourtId', dataItem.Value);
                        }

                        let reservationTypeData = {
                            customSchedulerId: r.Data.CustomSchedulerId,
                            userId: r.Data.RegisteringMemberId,
                            startTime: start,
                            date: start,
                            courtId: dataItem.Id,
                            courtType: r.Data.CourtTypeEnum,
                            endTime: end,
                            isDynamicSlot: r.Data.IsFromDynamicSlots,
                            instructorId: r.Data.InstructorId
                        }

                        appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxReservation/GetAvailableReservationTypes?id=${orgId}&${encodeParamsObject(reservationTypeData)}`).then(rTypes => {
                            setReservationTypes(rTypes);
                            setLoading('ReservationTypeId', false);
                            if (!isNullOrEmpty(selectReservationTypeIdRef?.current) && isNullOrEmpty(formik?.values?.ReservationTypeId)){
                                selectReservationTypeIdRef.current.open();
                            }
                        })
                    }
                }
            })
        }

        resetFetch();
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.ReservationTypeId)){
            onReservationTypeChange();
        }
    }, [formik?.values?.ReservationTypeId]);

    useEffect(() => {
        let currentPlayersCount = ((reservationMembers?.length || 0));
        if (!isNullOrEmpty(formik?.values?.ReservationGuests?.length)){
            currentPlayersCount += formik?.values?.ReservationGuests?.length;
        }
        
        //save button text
        if (toBoolean(authData?.EnableQuickReservationLockOutPeriod)){
            let buttonText = 'Save';
            if (selectedReservationType) {
                let currentReservationTypeMinVariable = selectedReservationType.MinimumNumberOfPlayers;
                if (!isNullOrEmpty(currentReservationTypeMinVariable) && currentPlayersCount < currentReservationTypeMinVariable){
                    buttonText = 'Save & Add Player(s)'
                }
            }

            setSubmitButtonText(buttonText);
        }
    }, [formik?.values?.ReservationGuests, reservationMembers]);
    
    const onReservationTypeChange = async () => {
        setLoading('Duration', true);

        if (isMockData) {
            setTimeout(() => {
                const durations = mockData.loading.Durations;
                setLoading('Duration', false);
                setDurations(durations);
            }, 2000);
        } else {
            let reservationTypeData = {
                reservationTypeId: formik?.values?.ReservationTypeId,
                startTime: dateTimeToFormat(start, 'MM/DD/YYYY HH:mm'),
                selectedDate: dateTimeToFormat(start, 'MM/DD/YYYY'),
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
                await reloadPlayers();
            } else if (selectedDuration) {
                await formik.setFieldValue('Duration', selectedDuration.Value);
            }

            setLoading('Duration', false);

            let udfData = {
                reservationTypeId: formik?.values?.ReservationTypeId,
                uiCulture: authData?.UiCulture,
            }

            let rUdf = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/Online/AjaxReservation/Api_GetUdfsByReservationTypeOnReservationCreate?id=${orgId}&${encodeParamsObject(udfData)}`);
            if (toBoolean(rUdf?.IsValid)) {
                setCustomFields(rUdf.Data);

                formik.setFieldValue('Udfs', rUdf.Data.map(udf => {
                    return {
                        ...udf,
                        Value: ''
                    }
                }));
            }
        }
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.Duration)) {
            let entTimeData = {
                reservationTypeId: formik?.values?.ReservationTypeId,
                startTime: dateTimeToFormat(start, 'MM/DD/YYYY HH:mm'),
                selectedDate: dateTimeToFormat(start, 'MM/DD/YYYY'),
                uiCulture: authData?.UiCulture,
                duration: formik?.values?.Duration
            }

            appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/CalculateReservationEndTime?id=${orgId}&${encodeParamsObject(entTimeData)}`).then(rEndTime => {
                if (rEndTime?.IsValid) {
                    formik.setFieldValue('EndTime', rEndTime.data);
                    reloadCourts(rEndTime.data);
                }
            })
        }

    }, [formik?.values?.Duration])

    useEffect(() => {
        if (showResources) {
            setLoading('ResourceIds', true);

            let resourcesData = {
                Date: dateTimeToFormat(start, 'MM/DD/YYYY'),
                startTime: dateTimeToFormat(start, 'MM/DD/YYYY HH:mm'),
                endTime: formik?.values?.EndTime,
                courtTypes: reservation?.CourtTypeEnum,
                selectedCourts: courts,
                MembershipId: reservation?.MembershipId,
                ReservationTypeId: formik?.values?.ReservationTypeId,
                customSchedulerId: reservation?.CustomSchedulerId,
                uiCulture: authData?.UiCulture,
                duration: formik?.values?.Duration
            }

            appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/api/v1/portalreservationsapi/Api_Reservation_GetAvailableResourcesOnReservationCreate?id=${orgId}&${encodeParamsObject(resourcesData)}`).then(rResources => {
                console.log(rResources);
                let responseResources = rResources || [];
                setResources(responseResources);

                const selectedResourceIds = responseResources
                    .filter(resource => resource.AutoSelect)
                    .map(resource => resource.Id);
                formik.setFieldValue('ResourceIds', selectedResourceIds)
                setLoading('ResourceIds', false);
            })
        }

    }, [formik?.values?.EndTime]);

    useEffect(() => {
        if ((!isNullOrEmpty(formik?.values?.RegisteringMemberId) || !isNullOrEmpty(formik?.values?.Duration)) && !isNullOrEmpty(formik?.values?.ReservationTypeId)) {
            reloadPlayers()
        }
    }, [formik?.values?.RegisteringMemberId, formik?.values?.Duration, formik?.values?.FeeResponsibility]);

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.ReservationTypeId)) {
            setSelectedReservationType(null);

            let currentReservationType = reservation?.ReservationTypes?.find(v => v.Id === formik?.values?.ReservationTypeId);
            setSelectedReservationType(currentReservationType);
            formik.setFieldValue('FeeResponsibility', selectedReservationType?.DefaultFeeResponsibility);
        } else {
            setSelectedReservationType(null);
        }
    }, [formik?.values?.ReservationTypeId]);

    useEffect(() => {
        if (shouldFetch) {
            //(true);
        }
    }, [shouldFetch, resetFetch]);
    
    //members guest table
    const reloadPlayers = async (orgMemberIdToRemove, incGuests) => {
        setLoading('SelectedReservationMembers', true);

        let registeringOrganizationMemberId = null;
        let membersWithDisclosures = [];
        let refillDisclosureMemberIds = [];

        let resGuests = formik?.values?.ReservationGuests || [];
        let numberOfGuests = resGuests.length;
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
            Date: formik?.values?.Date,
            MembersString: JSON.stringify(filteredReservationMembers.map(member => ({
                OrgMemberId: member.OrgMemberId,
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
            RefillMemberDisclosures: refillDisclosureMemberIds,
            NumberOfGuests: numberOfGuests,
            SelectedNumberOfGuests: selectedNumberOfGuests,
            GuestsString: JSON.stringify(resGuests),
            IsOpenReservation: toBoolean(formik?.values?.IsOpenReservation) && toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker),
            CourtId: formik?.values?.CourtId,
            FeeResponsibility: formik?.values.FeeResponsibility,
            AuthUserId: reservation?.MemberId,
            IsMobileLayout: true,
            IsFamilyMember: anyInList(reservation?.FamilyMembers),
            IsModernTemplate: true
        };

        let responseReservationGuests = [];
        let r = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxController/Api_CalculateReservationCostMemberPortal?id=${orgId}&authUserId=${reservation.MemberId}&uiCulture=${authData?.uiCulture}&isMobileLayout=true`, postData);
        if (r.IsValid) {
            setTotalPriceToPay(r.Data.totalCost)
            setReservationMembers(r.Data.MemberData.SelectedMembers);
            responseReservationGuests = r.Data.MemberData.ReservationGuests || [];

            if (anyInList(responseReservationGuests)){
                await formik.setFieldValue(
                    'ReservationGuests',
                    responseReservationGuests.map(resGuest => ({
                        ...resGuest,
                        Status: '' 
                    }))
                );
            }

            setPlayersModelData(r.Data.MemberData);
        }

        setLoading('SelectedReservationMembers', false);

        if (!isNullOrEmpty(incGuests)){
            return responseReservationGuests;
        }

        return null;
    }

    const reloadCourts = async (endTime) => {
        setLoading('CourtId', true);

        const courtType = ''; // jQuery("#@Html.IdFor(c => c.SelectedCourtTypeId)").val();
        var customSchedulerId = '';
        var cIds = '';
        var rq = '';
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
            Date: dateTimeToFormat(start, 'MM/DD/YYYY'),
            selectedDate: dateTimeToFormat(start, 'MM/DD/YYYY'), //resource call
            StartTime: dateTimeToFormat(start, 'MM/DD/YYYY HH:mm'),
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
            ReservationQueueSlotId: rq
        };
        appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/Online/ReservationsApi/GetAvailableCourtsMemberPortal?id=${orgId}&${encodeParamsObject(courtsData)}`).then(rCourts => {
            setCourts(rCourts)
            setLoading('CourtId', false);
        })
    }

    
    
    useEffect(() => {
        let paymentData = {
            list: [],
            totalDue: totalPriceToPay,
            requireOnlinePayment: toBoolean(reservation?.RequirePaymentWhenBookingCourtsOnline),
            show: totalPriceToPay > 0,
            holdTimeForReservation: reservation?.HoldTimeForReservation
        };

        setFooterContent(<PaymentDrawerBottom paymentData={paymentData}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                {submitButtonText}
            </Button>
        </PaymentDrawerBottom>)
    }, [isFetching, isLoading, submitButtonText, totalPriceToPay]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, []);

    useEffect(() => {
        if (shouldRebindPlayers && !showSearchPlayers) {
            setShouldRebindPlayers(false);
            reloadPlayers();
        }
    }, [showSearchPlayers, shouldRebindPlayers, reservationMembers]);

    const allowToSelectedStartTime = (reserv) => {
        let isFromWaitlisting = !isNullOrEmpty(reserv.ReservationQueueSlotId) || !isNullOrEmpty(reserv.ReservationQueueId);
        return toBoolean(reserv.IsAllowedToPickStartAndEndTime) && !isFromWaitlisting || isFromWaitlisting && equalString(reserv.DurationType, 1);
    }

    const displayPlayersInformation = () => {
        let currentPlayersCount = ((reservationMembers?.length || 0));
        if (!isNullOrEmpty(formik?.values?.ReservationGuests?.length)){
            currentPlayersCount += formik?.values?.ReservationGuests?.length;
        }

        if (selectedReservationType){
            let currentReservationTypeMinVariable = selectedReservationType.MinimumNumberOfPlayers;
            let currentReservationTypeMaxVariable = selectedReservationType.MaximumNumberOfPlayers;
            const applyNumberOfPlayersBasedOnNumberOfCourtsVariable = selectedReservationType.ApplyNumberOfPlayersBasedOnNumberOfCourts;

            if (toBoolean(applyNumberOfPlayersBasedOnNumberOfCourtsVariable)){
                const currentCourtIdsCount = formik?.values?.CourtId?.length || 1;

                if (!isNullOrEmpty(currentReservationTypeMinVariable)){
                    currentReservationTypeMinVariable =  parseInt(currentReservationTypeMinVariable) * currentCourtIdsCount;
                }

                if (!isNullOrEmpty(currentReservationTypeMaxVariable)){
                    currentReservationTypeMaxVariable =  parseInt(currentReservationTypeMaxVariable) * currentCourtIdsCount;
                }
            }

            if (!isNullOrEmpty(currentReservationTypeMinVariable) && !isNullOrEmpty(currentReservationTypeMaxVariable)){
                return `(${currentPlayersCount}/Max ${currentReservationTypeMaxVariable})`;
            } else if(!isNullOrEmpty(currentReservationTypeMinVariable)){
                return `(Min ${currentReservationTypeMinVariable}/${currentPlayersCount})`;
            } else if(!isNullOrEmpty(currentReservationTypeMaxVariable)){
                return `(${currentPlayersCount}/Max ${currentReservationTypeMaxVariable})`;
            } else{
                return `(${currentPlayersCount})`;
            }
        } else{
            return `(${currentPlayersCount})`;
        }
    }

    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Title level={1} className={globalStyles.noTopPadding}>Reservation Details</Title>

                        {!isNullOrEmpty(reservation?.InstructorId) &&
                            <FormInput form={formik}
                                       disabled={true}
                                       label={'Instructor'}
                                       name={`InstructorName`}/>
                        }

                        {anyInList(reservation?.FamilyMembers) &&
                            <div style={{display: 'none'}}>
                                <FormSelect form={formik}
                                            ref={selectRegisteringMemberIdRef}
                                            name={`RegisteringMemberId`}
                                            label='Reserve For'
                                            options={reservation?.FamilyMembers}
                                            required={true}
                                    //onValueChange={onReservationTypeChange}
                                            propText='FullName'
                                            propValue='Id'/>
                            </div>
                        }

                        {toBoolean(reservation?.IsResourceReservation) ? (
                            <FormSelect form={formik}
                                        name={`ReservationTypeId`}
                                        label={!isNullOrEmpty(reservation?.InstructorId) ? 'Reservation Type' : 'Reservation Type'}
                                        options={reservation?.ReservationTypesSelectListItem}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>
                        ) : (
                            <FormSelect form={formik}
                                        name={`ReservationTypeId`}
                                        label={!isNullOrEmpty(reservation?.InstructorId) ? 'Reservation Type' : 'Reservation Type'}
                                        options={reservationTypes}
                                        ref={selectReservationTypeIdRef}
                                        required={true}
                                        loading={toBoolean(loadingState.ReservationTypeId)}
                                        propText='Name'
                                        propValue='Id'/>
                        )}

                        {toBoolean(reservation?.IsResourceReservation) &&
                            <FormInput form={formik}
                                       disabled={true}
                                       label={'Resource'}
                                       name={`SelectedResourceName`}/>
                        }

                        <InlineBlock>
                            {toBoolean(allowToSelectedStartTime(reservation)) &&
                                <>
                                    <FormInput label="Start Time"
                                               form={formik}
                                               required={true}
                                               name='StartTime'
                                    />

                                    <FormInput label="End Time"
                                               form={formik}
                                               required={true}
                                               name='EndTime'
                                    />
                                </>
                            }

                            {!toBoolean(allowToSelectedStartTime(reservation)) &&
                                <>
                                    <FormSelect label="Duration"
                                                form={formik}
                                                name='Duration'
                                                options={durations}
                                                required={true}
                                                loading={loadingState.Duration}
                                    />

                                    <FormInput label="End Time"
                                               form={formik}
                                               required={true}
                                               disabled={true}
                                               name='EndTime'
                                    />
                                </>
                            }
                        </InlineBlock>

                        <FormSelect form={formik}
                                    name={`CourtId`}
                                    label='Court(s)'
                                    options={courts}
                                    required={true}
                                    loading={toBoolean(loadingState.CourtId)}
                                    propText='DisplayName'
                                    propValue='Id'/>

                        <ReservationRegistrationMatchMaker
                            formik={formik}
                            matchMaker={matchMaker}
                            selectedReservationType={selectedReservationType}
                            matchMakerShowSportTypes={matchMakerShowSportTypes}
                            matchMakerMemberGroups={matchMakerMemberGroups}
                            matchMakerRatingCategories={matchMakerRatingCategories}
                        />

                        {!isNullOrEmpty(formik?.values?.ReservationTypeId) &&
                            <>
                                <Divider className={globalStyles.formDivider}/>

                                <Flex vertical gap={token.padding}>
                                    <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                        <Flex justify={'space-between'} align={'center'}>
                                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                                <Title level={1} className={cx(globalStyles.noSpace)}>Players Information</Title>
                                            </Flex>

                                            <Text type="secondary">{displayPlayersInformation()}</Text>
                                        </Flex>
                                    </Flex>

                                    {toBoolean(authData?.AllowAbilityToSplitFeeAcrossReservationPlayers) && equalString(selectedReservationType?.CalculationType, 4) &&
                                        <div>
                                            <label className={globalStyles.globalLabel}>
                                                Fee Responsibility
                                            </label>

                                            <Segmented
                                                value={formik?.values?.FeeResponsibility}
                                                block={true}
                                                onChange={(e) => {
                                                    formik.setFieldValue('FeeResponsibility', e)
                                                }}
                                                options={[
                                                    {value: '1', label: 'Reservation Owner'},
                                                    {value: '2', label: 'Each Player Equally'},
                                                ]}
                                            />
                                        </div>
                                    }

                                    <ReservationRegistrationPlayers
                                        formik={formik}
                                        reservation={reservation}
                                        showSearchPlayers={showSearchPlayers}
                                        setShowSearchPlayers={setShowSearchPlayers}
                                        reservationMembers={reservationMembers}
                                        selectedReservationType={selectedReservationType}
                                        loadingState={loadingState}
                                        selectRegisteringMemberIdRef={selectRegisteringMemberIdRef}
                                        setReservationMembers={setReservationMembers}
                                        setShouldRebindPlayers={setShouldRebindPlayers}
                                        playersModelData={playersModelData}
                                        searchPlayerDrawerBottomRef={searchPlayerDrawerBottomRef}
                                    />

                                    {(toBoolean(selectedReservationType?.AllowGuestsOnMemberPortal) && isNullOrEmpty(reservation.InstructorId)) &&
                                        <RegistrationGuestBlock disableAddGuest={toBoolean(loadingState.SelectedReservationMembers)}
                                                                reservationMembers={reservationMembers}
                                                                reloadPlayers={reloadPlayers}
                                                                loadingState={loadingState}
                                                                setLoading={setLoading}
                                                                formik={formik}
                                                                showAllCosts={(!isNullOrEmpty(playersModelData?.ReservationId) && playersModelData?.ReservationId > 0)}/>
                                    }
                                </Flex>
                            </>
                        }

                        <Divider className={globalStyles.formDivider}/>
                        
                        <ReservationRegistrationMiscItems miscFeesQuantities={miscFeesQuantities} 
                                                          setMiscFeesQuantities={setMiscFeesQuantities}/>

                        {(showResources && anyInList(resources)) &&
                            <FormSelect form={formik}
                                        name={`ResourceIds`}
                                        multi={true}
                                        loading={toBoolean(loadingState.ResourceIds)}
                                        label={'Resource(s)'}
                                        options={resources}
                                        propText='Name'
                                        propValue='Id'/>
                        }

                        {anyInList(customFields) &&
                            <>
                                <Title level={1} className={globalStyles.noTopPadding}>Additional Information</Title>

                                <FormCustomFields customFields={formik?.values?.Udfs} form={formik} loading={isFetching} name={`Udfs[{udfIndex}].Value`}/>
                                <Divider className={globalStyles.formDivider}/>
                            </>
                        }

                        <ReservationRegistrationTermsAndCondition disclosure={disclosure} formik={formik} />
                    </PaddingBlock>
                </>
            }
        </>
    )
}

export default ReservationRegistration
