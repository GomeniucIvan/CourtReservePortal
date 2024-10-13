import {useStyles} from "./../styles.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Card, Checkbox, Divider, Flex, Segmented, Skeleton, Typography} from "antd";
import mockData from "../../../mocks/reservation-data.json";
import * as Yup from "yup";
import {useFormik} from "formik";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
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
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import SVG from "../../../components/svg/SVG.jsx";
import {ModalRemove} from "../../../utils/ModalUtils.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import FormTextarea from "../../../form/formtextarea/FormTextArea.jsx";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {
    dateTimeToFormat,
    dateToTimeString,
    fixDate,
    toAspNetDate,
    toAspNetDateTime,
    toReactDate
} from "../../../utils/DateUtils.jsx";
import {costDisplay} from "../../../utils/CostUtils.jsx";
import {any} from "prop-types";
import {matchmakerGenderList, numberList} from "../../../utils/SelectUtils.jsx";
import {toLocalStorage} from "../../../storage/AppStorage.jsx";
import {AppstoreOutlined, BarsOutlined} from "@ant-design/icons";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";

const {Title, Text, Link} = Typography;

function ReservationRegistration() {
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const {styles} = useStyles();
    const location = useLocation();
    const {dataItem, start, end} = location.state || {};

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
        isLoading
    } = useApp();
    const [reservation, setReservation] = useState(null);
    const [matchMaker, setMatchMaker] = useState(null);
    const [reservationTypes, setReservationTypes] = useState([]);
    const [durations, setDurations] = useState([]);
    const [courts, setCourts] = useState([]);
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);
    const [showMatchMakerDrawer, setShowMatchMakerDrawer] = useState([]);
    const [isOpenMatchFilled, setIsOpenMatchFilled] = useState(false);
    const [showSearchPlayers, setShowSearchPlayers] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [isPlayersSearch, setIsPlayersSearch] = useState(false);
    const [searchingPlayers, setSearchingPlayers] = useState([]);
    const [searchPlayersText, setSearchPlayersText] = useState('');
    const [shouldRebindPlayers, setShouldRebindPlayers] = useState(false);
    const [showMiscItems, setShowMiscItems] = useState(false);
    const [miscItems, setMiscItems] = useState([]);
    const [reservationMembers, setReservationMembers] = useState([]);
    const [playersModelData, setPlayersModelData] = useState(false);
    const [selectedReservationType, setSelectedReservationType] = useState(false);
    const [matchMakerShowSportTypes, setMatchMakerShowSportTypes] = useState(false);
    const [matchMakerMemberGroups, setMatchMakerMemberGroups] = useState(false);
    const [matchMakerRatingCategories, setMatchMakerRatingCategories] = useState(false);
    const [miscFeesQuantities, setMiscFeesQuantities] = useState([]);
    const [showResources, setShowResources] = useState(false);
    const [customFields, setCustomFields] = useState([]);
    const [resources, setResources] = useState([]);

    let selectRegisteringMemberIdRef = useRef();
    let searchPlayerDrawerBottomRef = useRef();


    const initialValues = {
        ReservationTypeId: '',
        Duration: '',
        CourtId: '',
        RegisteringMemberId: null,
        SelectedResourceName: null,
        StartTime: '',
        EndTime: '12:30 pm',
        IsOpenReservation: false,
        IsValidOpenMatch: false,
        InstructorName: '',
        SelectedReservationMembers: [],
        ReservationGuests: [],
        FeeResponsibility: '',
        ResourceIds: [],


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

    };

    const fields = Object.keys(initialValues);
    const {loadingState, setLoading} = useLoadingState(fields);

    const validationSchema = Yup.object({
        ReservationTypeId: Yup.string().required('Reservation Type is require.'),
        MatchMakerTypeId: Yup.string().when('IsOpenReservation', {
            is: true,
            then: (schema) => schema.required('Match Type is required.'),
            otherwise: (schema) => schema.nullable(),
        }),
        // MatchMakerGender: Yup.string().when('isOpenReservation', {
        //     is: true,
        //     then: (schema) => schema.required('Gender Restriction is required.'),
        //     otherwise: (schema) => schema.nullable(),
        // }),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            if (isMockData) {

            } else {
                //todo
                alert('todo verification')
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

            appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/CreateReservation?id=${orgId}&start=${start}&end=${end}&courtType=${encodeParam(dataItem.CourtTypeName)}&courtLabel=${encodeParam(dataItem.Label)}`).then(r => {
                if (toBoolean(r?.IsValid)) {
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
                    setShowResources(r.Data.ShowResources && toBoolean(authData?.allowMembersToBookResources));
                    setCustomFields(incResData.Udf || []);

                    if (matchMakerShowSportTypes) {
                        if (!isNullOrEmpty(matchMakerData) && oneListItem(matchMakerData.ActiveSportTypes)) {
                            let firstActiveSportTypeId = matchMakerData.ActiveSportTypes.first()?.Id;
                            formik.setFieldValue('SportTypeId', firstActiveSportTypeId);
                        }
                    }

                    formik.setValues({
                        ReservationId: incResData.ReservationId,
                        Duration: incResData.Duration,
                        CourtId: incResData.CourtId,
                        RegisteringMemberId: incResData.RegisteringMemberId,
                        SelectedResourceName: incResData.SelectedResourceName,
                        StartTime: dateToTimeString(start, true),
                        EndTime: dateToTimeString(end, true)
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
                        })
                    }
                }
            })
            //alert('todo res registation')
        }

        resetFetch();
    }

    const onReservationTypeChange = (resType) => {
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
                uiCulture: authData?.uiCulture,
                useMinTimeAsDefault: reservation?.UseMinTimeByDefault,
                courtId: formik?.values?.CourtId,
                courtType: reservation?.CourtTypeEnum,
                endTime: reservation?.EndTime,
                isDynamicSlot: reservation?.IsFromDynamicSlots,
                instructorId: reservation?.InstructorId,
                customSchedulerId: reservation?.CustomSchedulerId,
                selectedDuration: formik?.values?.Duration
            }

            appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/GetDurationDropdown?id=${orgId}&${encodeParamsObject(reservationTypeData)}`).then(rDurations => {
                setDurations(rDurations);
                const selectedDuration = rDurations.find(duration => duration.Selected);

                if (equalString(formik?.values?.Duration, selectedDuration?.Value)) {
                    reloadPlayers();
                } else if (selectedDuration) {
                    formik.setFieldValue('Duration', selectedDuration.Value);
                }
                setLoading('Duration', false);
            })

            let udfData = {
                reservationTypeId: formik?.values?.ReservationTypeId,
                uiCulture: authData?.uiCulture,
            }
            
            appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/Online/AjaxReservation/Api_GetUdfsByReservationTypeOnReservationCreate?id=${orgId}&${encodeParamsObject(udfData)}`).then(rUdf => {
                console.log(rUdf)
                
                setCustomFields(rUdf);
            })
        }
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.Duration)) {
            let entTimeData = {
                reservationTypeId: formik?.values?.ReservationTypeId,
                startTime: dateTimeToFormat(start, 'MM/DD/YYYY HH:mm'),
                selectedDate: dateTimeToFormat(start, 'MM/DD/YYYY'),
                uiCulture: authData?.uiCulture,
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
                uiCulture: authData?.uiCulture,
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

    //members guest table
    const reloadPlayers = (orgMemberIdToRemove) => {
        setLoading('SelectedReservationMembers', true);

        let currentSelectedNumberOfGuests = formik?.values?.ReservationGuests?.length || 0;
        let numberOfGuests = formik?.values?.ReservationGuests?.length || 0;
        let registeringOrganizationMemberId = null;
        let membersWithDisclosures = [];
        let refillDisclosureMemberIds = [];

        const guestsArray = () => {
            let reservationGuests = [];

            if (anyInList(formik?.values?.ReservationGuests)) {
                reservationGuests = formik.values.ReservationGuests.map(guest => ({
                    FirstName: guest.FirstName,
                    LastName: guest.LastName,
                    PhoneNumber: guest.PhoneNumber,
                    GuestOwnerId: guest.GuestOwnerId
                }))
            }

            return reservationGuests;
        }

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
            End: toBoolean(reservation.IsAllowedToPickStartAndEndTime) ? formik?.values?.EndTime : formik?.values?.EndTime,
            CourtType: reservation.CourtTypeEnum,
            ResourceIds: formik?.values?.ResourceIds,
            MiscFees: null,  //costs,
            ReservationTypeId: formik?.values?.ReservationTypeId,
            RegisteringOrganizationMemberId: registeringOrganizationMemberId,
            RegisteringMemberId: formik?.values?.RegisteringMemberId,
            Date: toAspNetDateTime(reservation.Date),
            NumberOfGuests: numberOfGuests,
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
            InstructorId: reservation.InstructorId,
            MembersWithDisclosures: membersWithDisclosures,
            RefillMemberDisclosures: refillDisclosureMemberIds,
            GuestsString: JSON.stringify(guestsArray()),
            IsOpenReservation: toBoolean(formik?.values?.IsOpenReservation) && toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker),
            CourtId: formik?.values?.CourtId,
            SelectedNumberOfGuests: currentSelectedNumberOfGuests,
            FeeResponsibility: formik?.values.FeeResponsibility,
            AuthUserId: reservation.MemberId,
            IsMobileLayout: true,
            IsFamilyMember: anyInList(reservation.FamilyMembers),
            IsModernTemplate: true
        };


        appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxController/Api_CalculateReservationCostMemberPortal?id=${orgId}&authUserId=${reservation.MemberId}&uiCulture=${authData?.uiCulture}&isMobileLayout=true`, postData).then(r => {
            if (r.IsValid) {
                setReservationMembers(r.Data.MemberData.SelectedMembers);
                let responseReservationGuests = r.Data.MemberData.ReservationGuests;

                if (anyInList(responseReservationGuests)) {
                    formik.setValues('ReservationGuests', responseReservationGuests)
                }

                setPlayersModelData(r.Data.MemberData);
            }

            setLoading('SelectedReservationMembers', false);
        });
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.RegisteringMemberId) || !isNullOrEmpty(formik?.values?.Duration)) {
            reloadPlayers()
        }
    }, [formik?.values?.RegisteringMemberId, formik?.values?.Duration]);

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
            //UiCulture: uiCulture, double param
            timeZone: authData?.timezone,
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
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Continue
            </Button>
        </PaddingBlock>)
    }, [isFetching, isLoading]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, [isFetching, isLoading]);

    const isValidMatchMakerData = async () => {
        await formik.validateField('MatchMakerTypeId');
        //await formik.validateField('MatchMakerGender');
        // await formik.validateField('MatchMakerRatingCategoryId');
        // await formik.validateField('MatchMakerMemberGroupIds');
        // await formik.validateField('MatchMakerMinNumberOfPlayers');
        // await formik.validateField('MatchMakerMaxNumberOfPlayers');
        // await formik.validateField('MatchMakerJoinCode');

        const matchMakerTypeIdError = formik.errors.MatchMakerTypeId;
        const matchMakerGenderError = formik.errors.MatchMakerGender;
        const matchMakerRatingCategoryIdError = formik.errors.MatchMakerRatingCategoryId;
        const matchMakerMemberGroupIdsError = formik.errors.MatchMakerMemberGroupIds;
        const matchMakerMinNumberOfPlayersError = formik.errors.MatchMakerMinNumberOfPlayers;
        const matchMakerMaxNumberOfPlayersError = formik.errors.MatchMakerMaxNumberOfPlayers;
        const matchMakerJoinCodeError = formik.errors.MatchMakerJoinCode;

        return matchMakerTypeIdError || matchMakerGenderError || matchMakerRatingCategoryIdError ||
            matchMakerMemberGroupIdsError || matchMakerMinNumberOfPlayersError ||
            matchMakerMaxNumberOfPlayersError || matchMakerJoinCodeError;
    }

    const closeAndCheckMatchMakerData = async () => {
        setShowMatchMakerDrawer(false);
        setIsOpenMatchFilled(true);
        let isInvalidMatchMakerInfo = await isValidMatchMakerData();
        await formik.setFieldValue('IsValidOpenMatch', !isInvalidMatchMakerInfo);
    }

    const addPlayers = () => {
        setShowSearchPlayers(false);
    }

    const onPlayersSearch = (searchVal) => {
        if (isMockData) {
            setIsPlayersSearch(true);

            setTimeout(function () {
                setIsPlayersSearch(false);
                setSearchPlayersText(searchVal);
            }, 2000);
        } else {
            setSearchPlayersText(searchVal);
        }
    }

    useEffect(() => {
        if (showSearchPlayers) {

            if (isMockData) {
                let data = mockData;
                if (isNullOrEmpty(searchPlayersText)) {
                    setSearchingPlayers(data.favplayers);
                } else {
                    setSearchingPlayers(data.players);
                }
            } else {
                setIsPlayersSearch(true);

                if (!isNullOrEmpty(searchPlayersText) && searchingPlayers.length < 3) {
                    setIsPlayersSearch(false);
                    return;
                }

                let searchPlayersData = {
                    costTypeId: reservation.MembershipId,
                    IsMobileLayout: true,
                    userId: reservation.MemberId,
                    customSchedulerId: reservation.CustomSchedulerId,
                    IsOpenReservation: toBoolean(formik?.values?.IsOpenReservation) && toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker),
                    filterValue: searchPlayersText,
                    organizationMemberIdsString: reservationMembers.map(member => member.OrgMemberId).join(',')
                }

                appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/Api_Reservation_GetMembersToPlayWith?id=${orgId}&${encodeParamsObject(searchPlayersData)}`).then(rSearchPlayers => {
                    setSearchingPlayers(rSearchPlayers);
                    setIsPlayersSearch(false);
                })
            }
        } else {

        }
    }, [showSearchPlayers, searchPlayersText, reservationMembers]);

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

    const handleMiscItemChange = (increment, index) => {
        if (increment) {
            setMiscFeesQuantities((prevItemsState) => {
                const newItemsState = [...prevItemsState];
                newItemsState[index].Quantity += 1;
                return newItemsState;
            });
        } else {
            setMiscFeesQuantities((prevItemsState) => {
                const newItemsState = [...prevItemsState];
                if (newItemsState[index].Quantity > 0) {
                    newItemsState[index].Quantity -= 1;
                }
                return newItemsState;
            });
        }
    };

    return (
        <>
            {isFetching &&
                <PaddingBlock topBottom={true}>
                    <Flex vertical={true} gap={16}>
                        {emptyArray(15).map((item, index) => (
                            <div key={index}>
                                <Flex vertical={true} gap={8}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                    <Skeleton.Button active={true} block style={{height: `40px`}}/>
                                </Flex>
                            </div>
                        ))}
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Title level={5} className={globalStyles.noTopPadding}>Reservation Details</Title>

                        {!isNullOrEmpty(reservation?.InstructorId) &&
                            <FormInput form={formik}
                                       disabled={true}
                                       label={'Instructor'}
                                       name={`InstructorName`}/>
                        }

                        {anyInList(reservation?.FamilyMembers) &&
                            <FormSelect form={formik}
                                        ref={selectRegisteringMemberIdRef}
                                        name={`RegisteringMemberId`}
                                        label='Reserve For'
                                        options={reservation?.FamilyMembers}
                                        required={true}
                                //onValueChange={onReservationTypeChange}
                                        propText='FullName'
                                        propValue='Id'/>
                        }

                        {toBoolean(reservation?.IsResourceReservation) ? (
                            <FormSelect form={formik}
                                        name={`ReservationTypeId`}
                                        label={!isNullOrEmpty(reservation?.InstructorId) ? 'Reservation Type' : 'Reservation Type'}
                                        options={reservation?.ReservationTypesSelectListItem}
                                        required={true}
                                        onValueChange={onReservationTypeChange}
                                        propText='Text'
                                        propValue='Value'/>
                        ) : (
                            <FormSelect form={formik}
                                        name={`ReservationTypeId`}
                                        label={!isNullOrEmpty(reservation?.InstructorId) ? 'Reservation Type' : 'Reservation Type'}
                                        options={reservationTypes}
                                        required={true}
                                        onValueChange={onReservationTypeChange}
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

                        {toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker) &&
                            <>
                                <FormSwitch label={'Allow Players to join this Reservation'}
                                            form={formik}
                                            name={'IsOpenReservation'}/>

                                {toBoolean(formik?.values?.IsOpenReservation) &&
                                    <>
                                        {isOpenMatchFilled &&
                                            <>
                                                <div style={{marginBottom: token.Custom.buttonPadding}}>
                                                    {toBoolean(formik?.values?.IsValidOpenMatch) ? (
                                                            <>
                                                                <Alert
                                                                    message={<div>
                                                                        <Flex align={'center'} justify={'space-between'}>
                                                                            <Text>
                                                                                <strong>Match Type</strong>
                                                                            </Text>
                                                                            <Text>
                                                                                {formik?.values?.MatchMakerTypeId}
                                                                            </Text>
                                                                        </Flex>
                                                                        <Divider variant="dashed" dashed
                                                                                 className={globalStyles.alertDivider}/>

                                                                        <Flex align={'center'} justify={'space-between'}>
                                                                            <Text>
                                                                                <strong>Gender Restriction</strong>
                                                                            </Text>
                                                                            <Text>
                                                                                Male
                                                                            </Text>
                                                                        </Flex>
                                                                    </div>}
                                                                    type="info"/>
                                                            </>
                                                        ) :
                                                        (
                                                            <>
                                                                <Alert
                                                                    message="Ensure all required fields for the open match are filled before proceeding"
                                                                    type="warning"/>
                                                            </>
                                                        )}
                                                </div>
                                            </>
                                        }

                                        <Button type="primary"
                                                block
                                                ghost
                                                htmlType={'button'}
                                                onClick={() => {
                                                    setShowMatchMakerDrawer(true)
                                                }}>
                                            {toBoolean(formik?.values?.IsValidOpenMatch) ? (<>Edit Join
                                                Criteria</>) : (<>Setup
                                                Join
                                                Criteria</>)}
                                        </Button>
                                    </>
                                }
                            </>
                        }


                        <Divider className={globalStyles.formDivider}/>

                        <Flex vertical gap={token.padding}>
                            <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                <Flex justify={'space-between'} align={'center'}>
                                    <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                        <Title level={5} className={cx(globalStyles.noSpace)}>Players
                                            Information</Title>
                                    </Flex>

                                    <Text type="secondary">(1/8)</Text>
                                </Flex>
                            </Flex>

                            <Alert
                                message={<div><strong>Reservation TypeName</strong> min number... 5 minutes note</div>}
                                type="info"/>

                            {toBoolean(authData?.allowAbilityToSplitFeeAcrossReservationPlayers) && equalString(selectedReservationType?.CalculationType, 4) &&
                                <div>
                                    <label style={{
                                        fontSize: token.Form.labelFontSize,
                                        padding: token.Form.verticalLabelPadding,
                                        marginLeft: token.Form.labelColonMarginInlineStart,
                                        display: 'block'
                                    }}>
                                        Fee Responsibility
                                    </label>

                                    <Segmented
                                        value={formik?.values?.FeeResponsibility}
                                        block={true}
                                        onChange={(e) => {
                                            formik.setFieldValue('FeeResponsibility', e.value)
                                        }}
                                        options={[
                                            {value: '1', label: 'Reservation Owner'},
                                            {value: '2', label: 'Each Player Equally'},
                                        ]}
                                    />
                                </div>
                            }

                            <div>
                                <Text
                                    style={{
                                        marginBottom: `${token.Custom.buttonPadding}px`,
                                        display: 'block'
                                    }}>Player(s)</Text>
                                <Card className={cx(globalStyles.card, styles.playersCard)}>
                                    <Flex vertical>
                                        {toBoolean(loadingState.SelectedReservationMembers) &&
                                            <>
                                                {emptyArray(anyInList(reservationMembers) ? reservationMembers.length : 1).map((item, index) => (
                                                    <div key={index}>
                                                        <Skeleton.Button block key={index} active={true}
                                                                         style={{height: `48px`}}/>
                                                        <Divider className={styles.playersDivider}/>
                                                    </div>
                                                ))}
                                            </>
                                        }

                                        {!toBoolean(loadingState.SelectedReservationMembers) &&
                                            <>
                                                {reservationMembers.map((reservationMember, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <Flex justify={'space-between'} align={'center'}>
                                                                <Flex gap={token.Custom.cardIconPadding}>
                                                                    <Flex justify={'center'} align={'center'}
                                                                          style={{
                                                                              width: 48,
                                                                              height: 48,
                                                                              borderRadius: 50,
                                                                              backgroundColor: 'red'
                                                                          }}>
                                                                        <Title level={5}
                                                                               className={cx(globalStyles.noSpace)}>{fullNameInitials(reservationMember.FullName)}</Title>
                                                                    </Flex>

                                                                    <Flex vertical
                                                                          gap={token.Custom.cardIconPadding / 2}>
                                                                        <Text>
                                                                            <Ellipsis direction='end'
                                                                                      content={reservationMember.FullName}/>
                                                                        </Text>
                                                                        <Text
                                                                            type="secondary">{costDisplay(reservationMember.PriceToPay)}</Text>
                                                                    </Flex>
                                                                </Flex>

                                                                {(toBoolean(reservationMember.IsOwner) && anyInList(reservation.FamilyMembers)) &&
                                                                    <div onClick={() => {
                                                                        selectRegisteringMemberIdRef.current.open();
                                                                    }}>
                                                                        <SVG icon={'edit-user'} size={23}
                                                                             color={token.colorLink}/>
                                                                    </div>
                                                                }
                                                                {(!toBoolean(reservationMember.IsOwner) && toBoolean(playersModelData?.IsAllowedToEditPlayers)) &&
                                                                    <div onClick={() => {
                                                                        setReservationMembers(reservationMembers.filter(
                                                                            member => member.OrgMemberId !== reservationMember.OrgMemberId
                                                                        ));
                                                                        setShouldRebindPlayers(true);
                                                                    }}>
                                                                        <SVG icon={'circle-minus'} size={23}
                                                                             color={token.colorError}/>
                                                                    </div>
                                                                }
                                                            </Flex>

                                                            <Divider className={styles.playersDivider}/>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }


                                        <Button type="primary"
                                                block
                                                ghost
                                                htmlType={'button'}
                                                disabled={toBoolean(loadingState.SelectedReservationMembers)}
                                                style={{marginTop: `${token.padding}px`}}
                                                onClick={() => {
                                                    setShowSearchPlayers(true)
                                                }}>
                                            Search Player(s)
                                        </Button>
                                    </Flex>
                                </Card>
                            </div>

                            {(toBoolean(selectedReservationType?.AllowGuestsOnMemberPortal) && isNullOrEmpty(reservation.InstructorId)) &&
                                <div>
                                    <Text
                                        style={{
                                            marginBottom: `${token.Custom.buttonPadding}px`,
                                            display: 'block'
                                        }}>Guest(s)</Text>
                                    <Card
                                        className={cx(globalStyles.card, anyInList(formik?.values?.ReservationGuests) ? styles.playersCard : styles.noPlayersCard)}>
                                        <Flex vertical>
                                            {anyInList(formik?.values?.ReservationGuests) &&
                                                <>
                                                    {formik?.values?.ReservationGuests.map((guest, index) => {
                                                        const isLastIndex = index === (formik?.values?.ReservationGuests).length - 1;
                                                        const firstName = guest?.FirstName;
                                                        const lastName = guest?.LastName;

                                                        let secondRowText = '';
                                                        let ownerText = '';

                                                        if (!isNullOrEmpty(guest.GuestOwnerId)) {
                                                            let reservationOwner = reservationMembers?.find(v => v.OrgMemberId === guest.GuestOwnerId);
                                                            if (!isNullOrEmpty(reservationOwner)) {
                                                                ownerText = reservationOwner.FullName;
                                                            }
                                                        }

                                                        const hasGuestsWithPayment = formik?.values?.ReservationGuests?.some(v =>
                                                            (v.PaidAmt ?? 0) > 0 || v.PriceToPay > 0
                                                        )

                                                        if (hasGuestsWithPayment && !isNullOrEmpty(ownerText)) {
                                                            secondRowText = `${costDisplay(v.PriceToPay)} (${ownerText})`;
                                                        } else if (hasGuestsWithPayment) {
                                                            secondRowText = `${costDisplay(v.PriceToPay)}`;
                                                        } else if (!isNullOrEmpty(ownerText)) {
                                                            secondRowText = ownerText;
                                                        }

                                                        let fullName = '';
                                                        if (!isNullOrEmpty(firstName) && !isNullOrEmpty(lastName)) {
                                                            fullName = `${firstName} ${lastName}`;
                                                        } else if (!isNullOrEmpty(firstName)) {
                                                            fullName = `${firstName}`;
                                                        } else if (!isNullOrEmpty(lastName)) {
                                                            fullName = `${lastName}`;
                                                        } else {
                                                            //initials
                                                            fullName = `G ${index + 1}`;
                                                        }

                                                        const displayFullName = isNullOrEmpty(firstName) && isNullOrEmpty(lastName) ?
                                                            `Guest #${index + 1}` :
                                                            `${fullName}`;

                                                        return (
                                                            <div key={index}
                                                                 style={{marginBottom: isLastIndex ? `${token.padding}px` : ''}}>
                                                                <Flex justify={'space-between'}
                                                                      align={'center'}
                                                                      onClick={() => {
                                                                          setSelectedGuest(guest);
                                                                      }}>
                                                                    <Flex gap={token.Custom.cardIconPadding}>
                                                                        <Flex justify={'center'} align={'center'}
                                                                              style={{
                                                                                  width: 48,
                                                                                  height: 48,
                                                                                  borderRadius: 50,
                                                                                  backgroundColor: 'red'
                                                                              }}>
                                                                            <Title level={5}
                                                                                   className={cx(globalStyles.noSpace)}>{fullNameInitials(fullName)}</Title>
                                                                        </Flex>

                                                                        <Flex vertical
                                                                              gap={token.Custom.cardIconPadding / 2}>
                                                                            <Text>
                                                                                <Ellipsis direction='end'
                                                                                          content={displayFullName}/>
                                                                            </Text>
                                                                            <Text
                                                                                type="secondary">${secondRowText}</Text>
                                                                        </Flex>
                                                                    </Flex>

                                                                    <SVG icon={'edit-user'} size={23}
                                                                         color={token.colorLink}/>

                                                                </Flex>
                                                                {(!isLastIndex) &&
                                                                    <Divider className={styles.playersDivider}/>
                                                                }
                                                            </div>
                                                        )
                                                    })}
                                                </>

                                            }
                                            <Button type="primary"
                                                    block
                                                    ghost
                                                    disabled={toBoolean(loadingState.SelectedReservationMembers)}
                                                    htmlType={'button'}
                                                    onClick={() => {
                                                        let guestObject = {
                                                            Index: isNullOrEmpty(formik?.values?.ReservationGuests?.length) ? 0 : formik.values.ReservationGuests.length,
                                                            FirstName: '',
                                                            LastName: '',
                                                            PhoneNumber: '',
                                                            GuestOwnerId: ''
                                                        };

                                                        let currentReservationGuests = formik.values.ReservationGuests || [];
                                                        formik.setFieldValue('ReservationGuests', [...currentReservationGuests, guestObject]);

                                                        setSelectedGuest(guestObject);
                                                    }}>
                                                Add Guest
                                            </Button>
                                        </Flex>
                                    </Card>
                                </div>
                            }
                        </Flex>

                        <Divider className={globalStyles.formDivider}/>

                        {anyInList(miscFeesQuantities) &&
                            <>
                                <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                    <Flex justify={'space-between'} align={'center'}>
                                        <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                            <Title level={5} className={cx(globalStyles.noSpace)}>Miscellaneous
                                                Items</Title>
                                            <Text
                                                type="secondary">({miscFeesQuantities.length})</Text>
                                        </Flex>

                                        <Link onClick={() => {
                                            setShowMiscItems(true)
                                        }}>
                                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                                {anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                                                    <>
                                                        <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                                                        <strong>chnageicon Edit Items</strong>
                                                    </>
                                                }

                                                {!anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                                                    <>
                                                        <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                                                        <strong>Add Items</strong>
                                                    </>
                                                }
                                            </Flex>
                                        </Link>
                                    </Flex>
                                </Flex>

                                {anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                                    <div style={{marginTop: `${token.padding / 2}px`}}>
                                        <Card
                                            className={cx(globalStyles.card, styles.playersCard)}>
                                            {miscFeesQuantities.filter(item => item.Quantity > 0).map((item, index) => {
                                                const isLastIndex = index === miscFeesQuantities.filter(item => item.Quantity > 0).length - 1;

                                                return (
                                                    <div key={index}>
                                                        <Flex justify={'space-between'} align={'center'}>
                                                            <Text
                                                                className={cx(globalStyles.noSpace)}>{item.Text}</Text>

                                                            <Flex gap={token.padding} align={'center'}>
                                                                <Title level={5} className={cx(globalStyles.noSpace)}>
                                                                    <Text style={{opacity: '0.6'}}>x </Text>
                                                                    {item.Quantity}
                                                                </Title>
                                                            </Flex>
                                                        </Flex>

                                                        {!isLastIndex &&
                                                            <Divider className={globalStyles.formDivider}
                                                                     style={{margin: '10px 0px'}}/>}
                                                    </div>
                                                )
                                            })}
                                        </Card>
                                    </div>
                                }


                                <Divider className={globalStyles.formDivider}/>
                            </>
                        }

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
                                <Title level={5} className={globalStyles.noTopPadding}>Additional Information</Title>

                                <FormCustomFields customFields={customFields} form={formik} loading={isFetching}/>
                                <Divider className={globalStyles.formDivider}/>
                            </>
                        }
                        
                        <Flex align={'center'}>
                            <Checkbox className={globalStyles.checkboxWithLink}>I agree to the </Checkbox>
                            <u style={{color: token.colorLink}} onClick={() => setShowTermAndCondition(true)}> Terms and
                                Conditions</u>
                        </Flex>
                    </PaddingBlock>

                    {/*//term drawer*/}
                    <DrawerBottom
                        showDrawer={showTermAndCondition}
                        closeDrawer={() => setShowTermAndCondition(false)}
                        label={'Terms and Conditions'}
                        showButton={false}
                        onConfirmButtonClick={() => setShowTermAndCondition(false)}
                    >
                        <Text>Test content dispaly</Text>
                    </DrawerBottom>

                    {/*Match maker drawer*/}
                    <DrawerBottom
                        maxHeightVh={90}
                        showDrawer={showMatchMakerDrawer}
                        closeDrawer={closeAndCheckMatchMakerData}
                        label={'Match Maker Criteria'}
                        showButton={true}
                        confirmButtonText={'Save'}
                        onConfirmButtonClick={closeAndCheckMatchMakerData}
                    >
                        <PaddingBlock>
                            {toBoolean(matchMakerShowSportTypes) &&
                                <FormSelect form={formik}
                                            name={`SportTypeId`}
                                            label='Sport Type'
                                            options={matchMaker?.ActiveSportTypes}
                                            disabled={oneListItem(matchMaker?.ActiveSportTypes)}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>
                            }

                            {(anyInList(matchMaker?.MatchMakerTypes) && toBoolean(matchMaker?.IsMatchTypeEnabled)) &&
                                <FormSelect form={formik}
                                            name={`MatchMakerTypeId`}
                                            label='Match Type'
                                            options={matchMaker?.MatchMakerTypes}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>
                            }

                            {toBoolean(matchMaker?.IsGenderCriteriaMatch) &&
                                <FormSelect form={formik}
                                            name={`MatchMakerGender`}
                                            label='Gender Restrictions'
                                            options={matchmakerGenderList}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>
                            }

                            {(anyInList(matchMaker?.RatingCategoryIds) && anyInList(matchMakerRatingCategories)) &&
                                <>
                                    <FormSelect form={formik}
                                                name={`MatchMakerRatingCategoryId`}
                                                label='Rating Restriction'
                                                options={matchMakerRatingCategories}
                                                required={true}
                                                propText='Name'
                                                propValue='Id'/>

                                    {(anyInList(matchMakerRatingCategories) ? matchMakerRatingCategories : []).map((matchMakerRatingCateg, index) => {
                                        if (!equalString(matchMakerRatingCateg.Id, formik?.values?.MatchMakerRatingCategoryId)) {
                                            return (<div key={index}></div>);
                                        }

                                        let selectedRatingCategory = matchMakerRatingCategories.find(v => equalString(v.Id, formik?.values?.MatchMakerRatingCategoryId));

                                        return (
                                            <div key={index}>
                                                <FormSelect form={formik}
                                                            multi={true}
                                                            name={`MatchMakerRatingCategoryRatingIds`}
                                                            label={`${selectedRatingCategory?.Name} Eligible Rating(s)`}
                                                            options={matchMakerRatingCateg.Ratings}
                                                            required={!oneListItem(matchMakerRatingCategories)}
                                                            propText='Name'
                                                            propValue='Id'/>
                                            </div>
                                        )
                                    })}
                                </>
                            }

                            {anyInList(matchMaker?.MemberGroupIds) &&
                                <FormSelect form={formik}
                                            name={`MatchMakerMemberGroupIds`}
                                            label='Member Groups'
                                            options={matchMakerMemberGroups}
                                            required={true}
                                            propText='NavigationName'
                                            propValue='Id'/>
                            }

                            <InlineBlock>
                                <FormSelect form={formik}
                                            name={`MatchMakerMinNumberOfPlayers`}
                                            label='Min. Players'
                                            options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                            required={true}
                                            onValueChange={(e) => {
                                                let selectedMinValueInt = parseInt(e.Value);
                                                let selectedMaxValue = formik?.values?.MatchMakerMaxNumberOfPlayers;
                                                if (!isNullOrEmpty(selectedMaxValue)) {
                                                    let selectedMaxValueInt = parseInt(selectedMaxValue);
                                                    if (selectedMaxValueInt < selectedMinValueInt) {
                                                        formik?.setFieldValue('MatchMakerMaxNumberOfPlayers', selectedMinValueInt);
                                                    }
                                                }
                                            }}
                                            propText='Text'
                                            propValue='Value'/>

                                <FormSelect form={formik}
                                            name={`MatchMakerMaxNumberOfPlayers`}
                                            label='Max. Players'
                                            options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                            required={true}
                                            onValueChange={(e) => {
                                                let selectedMaxValueInt = parseInt(e.Value);
                                                let selectedMinValue = formik?.values?.MatchMakerMinNumberOfPlayers;
                                                if (!isNullOrEmpty(selectedMinValue)) {
                                                    let selectedMinValueInt = parseInt(selectedMinValue);
                                                    if (selectedMinValueInt > selectedMaxValueInt) {
                                                        formik?.setFieldValue('MatchMakerMinNumberOfPlayers', selectedMaxValueInt);
                                                    }
                                                }
                                            }}
                                            propText='Text'
                                            propValue='Value'/>
                            </InlineBlock>

                            {toBoolean(matchMaker?.IsAgeCriteriaMatch) &&
                                <InlineBlock>
                                    <FormSelect form={formik}
                                                name={`MatchMakerMinAge`}
                                                label='Min Age'
                                                options={numberList(1, 99)}
                                                onValueChange={(e) => {
                                                    let selectedMinValueInt = parseInt(e.Value);
                                                    let selectedMaxValue = formik?.values?.MatchMakerMaxAge;
                                                    if (!isNullOrEmpty(selectedMaxValue)) {
                                                        let selectedMaxValueInt = parseInt(selectedMaxValue);
                                                        if (selectedMaxValueInt < selectedMinValueInt) {
                                                            formik?.setFieldValue('MatchMakerMaxAge', selectedMinValueInt);
                                                        }
                                                    }
                                                }}
                                                required={true}
                                                propText='Text'
                                                propValue='Value'/>

                                    <FormSelect form={formik}
                                                name={`MatchMakerMaxAge`}
                                                label='Max Age'
                                                options={numberList(1, 99)}
                                                onValueChange={(e) => {
                                                    let selectedMaxValueInt = parseInt(e.Value);
                                                    let selectedMinValue = formik?.values?.MatchMakerMinAge;
                                                    if (!isNullOrEmpty(selectedMinValue)) {
                                                        let selectedMinValueInt = parseInt(selectedMinValue);
                                                        if (selectedMinValueInt > selectedMaxValueInt) {
                                                            formik?.setFieldValue('MatchMakerMinAge', selectedMaxValueInt);
                                                        }
                                                    }
                                                }}
                                                required={true}
                                                propText='Text'
                                                propValue='Value'/>
                                </InlineBlock>
                            }

                            <FormTextarea form={formik}
                                          max={200}
                                          label={'What to expect in this match'}
                                          name={`Description`}/>

                            {toBoolean(matchMaker?.AllowPrivateMatches) &&
                                <>
                                    <FormSwitch label={'Is this a private match'}
                                                form={formik}
                                                name={'MatchMakerIsPrivateMatch'}/>

                                    {toBoolean(formik?.values?.MatchMakerIsPrivateMatch) &&
                                        <FormInput form={formik}
                                                   required={true}
                                                   label={'Join Code'}
                                                   name={`MatchMakerJoinCode`}/>
                                    }
                                </>
                            }
                        </PaddingBlock>
                    </DrawerBottom>

                    {/*Search player*/}
                    <DrawerBottom
                        maxHeightVh={80}
                        showDrawer={showSearchPlayers}
                        closeDrawer={addPlayers}
                        label={'Search Player(s)'}
                        onSearch={onPlayersSearch}
                        showButton={true}
                        fullHeight={true}
                        searchType={2}
                        addSearch={true}
                        isSearchLoading={isPlayersSearch}
                        ref={searchPlayerDrawerBottomRef}
                        confirmButtonText={'Close'}
                        onConfirmButtonClick={addPlayers}
                    >
                        <PaddingBlock>
                            {/*//todo iv change to dynamic calculation*/}
                            <Flex vertical style={{minHeight: `calc(80vh - 98px - 72px)`}}>
                                {isPlayersSearch &&
                                    <Flex vertical={true} gap={token.padding}>
                                        {emptyArray(anyInList(searchingPlayers) ? searchingPlayers.length : 8).map((item, index) => (
                                            <div key={index}>
                                                <Skeleton.Button block key={index} active={true}
                                                                 style={{height: `48px`}}/>
                                            </div>
                                        ))}
                                    </Flex>
                                }

                                {!isPlayersSearch &&
                                    <>
                                        {!anyInList(searchingPlayers) &&
                                            <Text>No players meessage</Text>
                                        }

                                        {anyInList(searchingPlayers) &&
                                            <Flex vertical gap={token.padding}>
                                                {searchingPlayers.map((player, index) => (
                                                    <div key={index}>
                                                        <Flex justify={'space-between'} align={'center'}>
                                                            <div onClick={() => {
                                                                setReservationMembers((prevMembers) => [...prevMembers, {OrgMemberId: player.MemberOrgId}]);
                                                                setSearchPlayersText('');
                                                                searchPlayerDrawerBottomRef.current.setValue('');
                                                                setShouldRebindPlayers(true);
                                                            }} style={{width: '100%'}}>
                                                                <Flex gap={token.Custom.cardIconPadding}
                                                                      align={'center'}>
                                                                    <Flex justify={'center'} align={'center'}
                                                                          style={{
                                                                              width: 48,
                                                                              height: 48,
                                                                              borderRadius: 50,
                                                                              backgroundColor: 'red'
                                                                          }}>
                                                                        <Title level={5}
                                                                               className={cx(globalStyles.noSpace)}>{player.FullNameInitial}</Title>
                                                                    </Flex>

                                                                    <Text>
                                                                        <Ellipsis direction='end'
                                                                                  content={player.DisplayName}/>
                                                                    </Text>
                                                                </Flex>
                                                            </div>

                                                            <Flex gap={token.padding}>
                                                                <div onClick={() => {
                                                                    alert('todo')
                                                                }}>
                                                                    {toBoolean(player.IsFavoriteMember) ?
                                                                        (<SVG icon={'hearth-filled'} size={24}
                                                                              color={token.colorPrimary}/>) :
                                                                        (<SVG icon={'hearth'} size={24}
                                                                              color={token.colorPrimary}/>)}

                                                                </div>

                                                                <div onClick={() => {
                                                                    alert('todo')
                                                                }}>
                                                                    <SVG icon={'circle-plus'} size={24}
                                                                         color={token.colorPrimary}/>
                                                                </div>
                                                            </Flex>
                                                        </Flex>
                                                    </div>
                                                ))}
                                            </Flex>
                                        }
                                    </>
                                }


                            </Flex>
                        </PaddingBlock>
                    </DrawerBottom>

                    {/*Edit guest*/}
                    <DrawerBottom
                        maxHeightVh={80}
                        showDrawer={!isNullOrEmpty(selectedGuest)}
                        closeDrawer={() => {
                            setSelectedGuest(null)
                        }}
                        label={`Edit Guest #${((selectedGuest?.Index) ?? 0)}`}
                        showButton={false}
                        confirmButtonText={''}
                        onConfirmButtonClick={() => {
                            setSelectedGuest(null)
                        }}
                    >
                        <PaddingBlock>
                            {(anyInList(formik.values?.ReservationGuests) ? formik.values.ReservationGuests : []).map((guest, index) => {
                                const showGuest = guest.Index === selectedGuest?.Index;
                                const isOverriden = guest.IsOverriden;

                                if (!showGuest) {
                                    return (<div key={index}></div>)
                                }

                                const hasGuestsWithPayment = formik?.values?.ReservationGuests?.some(v =>
                                    (v.PaidAmt ?? 0) > 0 || v.PriceToPay > 0
                                )

                                return (
                                    <div key={index}>
                                        <FormInput label="First Name"
                                                   form={formik}
                                                   required={true}
                                                   name={`ReservationGuests[${index}].FirstName`}
                                        />

                                        <FormInput label="Last Name"
                                                   form={formik}
                                                   required={true}
                                                   name={`ReservationGuests[${index}].LastName`}
                                        />

                                        <FormInput label="Phone Number"
                                                   form={formik}
                                                   required={true}
                                                   name={`ReservationGuests[${index}].PhoneNumber`}
                                        />

                                        {toBoolean(authData?.allowMembersToChangeGuestOwnerOnMemberPortal) &&
                                            <FormSelect form={formik}
                                                        name={`ReservationGuests[${index}].GuestOwnerId`}
                                                        label='Owner'
                                                        options={reservationMembers}
                                                        required={true}
                                                        onValueChange={() => {

                                                            //reloadPlayers();
                                                        }}
                                                        propText='FullName'
                                                        propValue='OrgMemberId'/>
                                        }

                                        {hasGuestsWithPayment &&
                                            <>
                                                <FormInput label={isOverriden ? "Daily Cost" : "Cost"}
                                                           form={formik}
                                                           name={isOverriden ? `ReservationGuests[${index}].OverriddenPrice` : `ReservationGuests[${index}].PriceToPay`}
                                                />

                                                {(!isNullOrEmpty(playersModelData?.ReservationId) && playersModelData?.ReservationId > 0) &&
                                                    <>
                                                        <FormInput label="Subtotal"
                                                                   form={formik}
                                                                   required={true}
                                                                   name={`ReservationGuests[${index}].Subtotal`}
                                                        />

                                                        <FormInput label="Paid"
                                                                   form={formik}
                                                                   required={true}
                                                                   name={`ReservationGuests[${index}].PaidAmt`}
                                                        />

                                                        <FormInput label="Due"
                                                                   form={formik}
                                                                   required={true}
                                                                   name={`ReservationGuests[${index}].TotalDue`}
                                                        />
                                                    </>
                                                }
                                            </>
                                        }


                                    </div>
                                )
                            })}

                            <div style={{paddingBottom: `${token.padding}px`}}>
                                <InlineBlock>
                                    <Button type="primary"
                                            danger
                                            block
                                            ghost
                                            htmlType={'button'}
                                            onClick={() => {
                                                ModalRemove({
                                                    content: 'Are you sure you want to remove Guest?',
                                                    showIcon: false,
                                                    onRemove: (e) => {
                                                        let currentReservationGuests = formik.values.ReservationGuests || [];
                                                        const updatedGuests = currentReservationGuests
                                                            .filter(g => g !== selectedGuest)
                                                            .map((guest, index) => ({
                                                                ...guest,
                                                                Index: index + 1
                                                            }));

                                                        console.log(updatedGuests)
                                                        formik.setFieldValue('ReservationGuests', updatedGuests);
                                                        setSelectedGuest(null);
                                                    }
                                                });
                                            }}>
                                        Remove
                                    </Button>

                                    <Button type="primary"
                                            block
                                            htmlType={'button'}
                                            onClick={() => {
                                                setSelectedGuest(null)
                                            }}>
                                        Save
                                    </Button>
                                </InlineBlock>
                            </div>
                        </PaddingBlock>
                    </DrawerBottom>

                    {/*Misc item*/}
                    <DrawerBottom
                        maxHeightVh={60}
                        showDrawer={showMiscItems}
                        closeDrawer={() => {
                            setShowMiscItems(false)
                        }}
                        label={'Miscellaneous Items'}
                        showButton={true}
                        confirmButtonText={'Save'}
                        onConfirmButtonClick={() => {
                            setShowMiscItems(false)
                        }}
                    >
                        <PaddingBlock>
                            {anyInList(miscFeesQuantities) &&
                                <Flex vertical>
                                    {miscFeesQuantities.map((miscItem, index) => {
                                        const isLastIndex = index === miscFeesQuantities.length - 1;

                                        return (
                                            <div key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <Title level={5}
                                                           className={cx(globalStyles.noSpace)}>{miscItem.Text}</Title>

                                                    <Flex gap={token.padding} align={'center'}>
                                                        <div onClick={() => {
                                                            handleMiscItemChange(false, index)
                                                        }}
                                                             style={{
                                                                 opacity: miscItem.Quantity === 0 ? '0.4' : '1'
                                                             }}
                                                        >
                                                            <SVG icon={'circle-minus'} size={30}
                                                                 color={token.colorError}/>
                                                        </div>

                                                        <Title level={5} style={{minWidth: '26px', textAlign: 'center'}}
                                                               className={cx(globalStyles.noSpace)}>{miscItem.Quantity}</Title>

                                                        <div onClick={() => {
                                                            handleMiscItemChange(true, index)
                                                        }}>
                                                            <SVG icon={'circle-plus'} size={30}
                                                                 color={token.colorPrimary}/>
                                                        </div>
                                                    </Flex>
                                                </Flex>

                                                {!isLastIndex &&
                                                    <Divider className={styles.playersDivider}/>
                                                }
                                            </div>
                                        )
                                    })}
                                </Flex>
                            }
                        </PaddingBlock>
                    </DrawerBottom>
                </>
            }
        </>
    )
}

export default ReservationRegistration
