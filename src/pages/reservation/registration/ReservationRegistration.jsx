import {useStyles} from "./../styles.jsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Alert, Button, Card, Checkbox, Divider, Flex, Skeleton, Typography} from "antd";
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
    isNullOrEmpty, randomNumber,
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
import {dateTimeToFormat, dateToTimeString, toReactDate} from "../../../utils/DateUtils.jsx";
import {costDisplay} from "../../../utils/CostUtils.jsx";
import {any} from "prop-types";

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
    const [reservation, setReservation] = useState([]);
    const [reservationTypes, setReservationTypes] = useState([]);
    const [durations, setDurations] = useState([]);
    const [courts, setCourts] = useState([]);
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);
    const [showMatchMakerDrawer, setShowMatchMakerDrawer] = useState([]);
    const [matchTypes, setMatchTypes] = useState([]);
    const [isOpenMatchFilled, setIsOpenMatchFilled] = useState(false);
    const [showSearchPlayers, setShowSearchPlayers] = useState(false);
    const [guests, setGuests] = useState([]);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [isPlayersSearch, setIsPlayersSearch] = useState(false);
    const [searchingPlayers, setSearchingPlayers] = useState([]);
    const [searchPlayersText, setSearchPlayersText] = useState('');
    const [showMiscItems, setShowMiscItems] = useState(false);
    const [miscItems, setMiscItems] = useState([]);
    const [reservationMembers, setReservationMembers] = useState([]);
    const [reservationGuests, setReservationGuests] = useState([]);

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
        MatchMakerTypeId: '',
        MatchMakerGender: '',
        MatchMakerRatingCategoryId: null,
        MatchMakerMemberGroupIds: [],
        MatchMakerMinNumberOfPlayers: null,
        MatchMakerMaxNumberOfPlayers: null,
        Description: null,
        MatchMakerIsPrivateMatch: false,
        MatchMakerJoinCode: '',
        InstructorName: '',
        SelectedReservationMembers: []

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
            setMatchTypes(resv.MatchTypes);
            setMiscItems(resv.MiscFeesSelectListItems);
            setIsFetching(false);
        } else {

            appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/CreateReservation?id=${orgId}&start=${start}&end=${end}&courtType=${encodeParam(dataItem.CourtTypeName)}&courtLabel=${encodeParam(dataItem.Label)}`).then(r => {
                if (toBoolean(r?.IsValid)) {
                    let incResData = r.Data;
                    setReservation(incResData);

                    formik.setValues({
                        ReservationId: incResData.ReservationId,
                        Duration: incResData.Duration,
                        CourtId: incResData.CourtId,
                        RegisteringMemberId: incResData.RegisteringMemberId,
                        SelectedResourceName: incResData.SelectedResourceName,
                        StartTime: incResData.StartTime,
                        EndTime: dateToTimeString(end, true),
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
                if (selectedDuration) {
                    formik.setFieldValue('Duration', selectedDuration.Value);
                }
                setLoading('Duration', false);
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

    //members guest table
    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.RegisteringMemberId) || !isNullOrEmpty(formik?.values?.Duration)) {
            setLoading('SelectedReservationMembers', true);

            let currentSelectedNumberOfGuests = 0;
            let numberOfGuests = 0;
            let registeringOrganizationMemberId = null;
            let organizationMembers = [];
            let membersWithDisclosures = [];
            let removeGuestAtIndex = null;
            let refillDisclosureMemberIds = [];

            const guestsArray = (removeGuestAtIndex) => {
                return [];
            }

            const getFeeResponsibility = () => {

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
                Date: toReactDate(reservation.Date),
                NumberOfGuests: numberOfGuests,
                MembersString: JSON.stringify(organizationMembers),
                InstructorId: reservation.InstructorId,
                MembersWithDisclosures: membersWithDisclosures,
                RefillMemberDisclosures: refillDisclosureMemberIds,
                GuestsString: JSON.stringify(guestsArray(removeGuestAtIndex)),
                IsOpenReservation: toBoolean(formik?.values?.IsOpenReservation),
                CourtId: formik?.values?.CourtId,
                SelectedNumberOfGuests: currentSelectedNumberOfGuests,
                FeeResponsibility: getFeeResponsibility(),
                AuthUserId: reservation.MemberId,
                IsMobileLayout: true,
                IsFamilyMember: anyInList(reservation.FamilyMembers),
                IsModernTemplate: true
            };

            appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxController/Api_CalculateReservationCostMemberPortal?id=${orgId}&authUserId=${reservation.MemberId}&uiCulture=${authData?.uiCulture}&isMobileLayout=true`, postData).then(r => {
                if (r.IsValid) {
                    setReservationMembers(r.Data.MemberData.SelectedMembers);
                    setReservationGuests(r.Data.MemberData.ReservationGuests);
                }

                setLoading('SelectedReservationMembers', false);
            });
        }
    }, [formik?.values?.RegisteringMemberId, formik?.values?.Duration]);

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
            console.log(rCourts)
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
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Continue
            </Button>
        </PaddingBlock>)
        loadData();
    }, []);

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

    const updateSelectedGuest = () => {
        setGuests(prevGuests => prevGuests.map(guest =>
            guest === selectedGuest
                ? {
                    ...guest,
                    FirstName: formik.values.guestFirstName,
                    LastName: formik.values.guestLastName,
                    Email: formik.values.guestEmail
                }
                : guest
        ));
        setSelectedGuest(null);
    }

    const onPlayersSearch = (searchVal) => {
        if (isMockData) {
            setIsPlayersSearch(true);

            setTimeout(function () {
                setIsPlayersSearch(false);
                setSearchPlayersText(searchVal);
            }, 2000);
        }
    }

    useEffect(() => {
        if (isMockData) {
            let data = mockData;
            if (showSearchPlayers) {
                if (isNullOrEmpty(searchPlayersText)) {
                    setSearchingPlayers(data.favplayers);
                } else {
                    setSearchingPlayers(data.players);
                }
            } else {
                //setSearchingPlayers([]);
            }
        }
    }, [showSearchPlayers, searchPlayersText]);

    const allowToSelectedStartTime = (reserv) => {
        let isFromWaitlisting = !isNullOrEmpty(reserv.ReservationQueueSlotId) || !isNullOrEmpty(reserv.ReservationQueueId);
        return toBoolean(reserv.IsAllowedToPickStartAndEndTime) && !isFromWaitlisting || isFromWaitlisting && equalString(reserv.DurationType, 1);
    }

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
                                    {toBoolean(formik?.values?.IsValidOpenMatch) ? (<>Edit Join Criteria</>) : (<>Setup
                                        Join
                                        Criteria</>)}
                                </Button>
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
                                                {emptyArray(anyInList(reservationMembers) ? reservationMembers.length : 4).map((item, index) => (
                                                    <div key={index}>
                                                        <Skeleton.Button block key={index} active={true} style={{height: `48px`}}/>
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

                                                                    <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                                                        <Text>
                                                                            <Ellipsis direction='end'
                                                                                      content={reservationMember.FullName}/>
                                                                        </Text>
                                                                        <Text
                                                                            type="secondary">{costDisplay(reservationMember.PriceToPay)}</Text>
                                                                    </Flex>
                                                                </Flex>

                                                                {(reservationMember.IsOwner && anyInList(reservation.FamilyMembers)) &&
                                                                    <SVG icon={'edit-user'} size={23} color={token.colorLink}/>
                                                                }
                                                            </Flex>

                                                            <Divider className={styles.playersDivider}/>
                                                        </div>
                                                    )
                                                })}
                                            </>
                                        }
                                        {/*<Flex justify={'space-between'} align={'center'}>*/}
                                        {/*    <Flex gap={token.Custom.cardIconPadding}>*/}
                                        {/*        <Flex justify={'center'} align={'center'}*/}
                                        {/*              style={{*/}
                                        {/*                  width: 48,*/}
                                        {/*                  height: 48,*/}
                                        {/*                  borderRadius: 50,*/}
                                        {/*                  backgroundColor: 'red'*/}
                                        {/*              }}>*/}
                                        {/*            <Title level={5} className={cx(globalStyles.noSpace)}>SM</Title>*/}
                                        {/*        </Flex>*/}

                                        {/*        <Flex vertical gap={token.Custom.cardIconPadding / 2}>*/}
                                        {/*            <Text>*/}
                                        {/*                <Ellipsis direction='end' content={'Smith Valmont'}/>*/}
                                        {/*            </Text>*/}
                                        {/*            <Text type="secondary">$2.50</Text>*/}
                                        {/*        </Flex>*/}
                                        {/*    </Flex>*/}

                                        {/*    <div onClick={() => ModalRemove({*/}
                                        {/*        content: 'Are you sure you want to remove Smith Valmont?',*/}
                                        {/*        showIcon: false,*/}
                                        {/*        onRemove: (e) => {*/}
                                        {/*            console.log(e)*/}

                                        {/*        }*/}
                                        {/*    })}>*/}
                                        {/*        <SVG icon={'circle-minus'} size={23} color={token.colorError}/>*/}
                                        {/*    </div>*/}
                                        {/*</Flex>*/}

                                        <Button type="primary"
                                                block
                                                ghost
                                                htmlType={'button'}
                                                style={{marginTop: `${token.padding}px`}}
                                                onClick={() => {
                                                    setShowSearchPlayers(true)
                                                }}>
                                            Search Player(s)
                                        </Button>
                                    </Flex>
                                </Card>
                            </div>

                            <div>
                                <Text
                                    style={{
                                        marginBottom: `${token.Custom.buttonPadding}px`,
                                        display: 'block'
                                    }}>Guest(s)</Text>
                                <Card
                                    className={cx(globalStyles.card, anyInList(guests) ? styles.playersCard : styles.noPlayersCard)}>
                                    <Flex vertical>
                                        {guests.map((guest, index) => {
                                            const isLastIndex = index === guests.length - 1;
                                            const firstName = guest?.FirstName;
                                            const lastName = guest?.LastName;
                                            const displayFullName = isNullOrEmpty(firstName) && isNullOrEmpty(lastName) ?
                                                `Guest #${index + 1}` :
                                                `${firstName} ${lastName}`;

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
                                                                       className={cx(globalStyles.noSpace)}>NM</Title>
                                                            </Flex>

                                                            <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                                                <Text>
                                                                    <Ellipsis direction='end'
                                                                              content={displayFullName}/>
                                                                </Text>
                                                                <Text type="secondary">$2.50</Text>
                                                            </Flex>
                                                        </Flex>

                                                        <SVG icon={'edit-user'} size={23} color={token.colorLink}/>

                                                    </Flex>
                                                    {(!isLastIndex) &&
                                                        <Divider className={styles.playersDivider}/>
                                                    }
                                                </div>
                                            )
                                        })}
                                        <Button type="primary"
                                                block
                                                ghost
                                                htmlType={'button'}
                                                onClick={() => {
                                                    setGuests((prevGuests) => [...prevGuests, {}]);
                                                }}>
                                            Add Guest
                                        </Button>
                                    </Flex>
                                </Card>
                            </div>
                        </Flex>

                        <Divider className={globalStyles.formDivider}/>

                        <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                            <Flex justify={'space-between'} align={'center'}>
                                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                    <Title level={5} className={cx(globalStyles.noSpace)}>Miscellaneous Items</Title>
                                    <Text type="secondary">(0)</Text>
                                </Flex>

                                <Link onClick={() => {
                                    setShowMiscItems(true)
                                }}>
                                    <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                        <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                                        <strong>Add Items</strong>
                                    </Flex>
                                </Link>
                            </Flex>

                        </Flex>

                        <Divider className={globalStyles.formDivider}/>

                        <Title level={5} className={globalStyles.noTopPadding}>Additional Information</Title>
                        <FormInput label="Hand"
                                   form={formik}
                                   required={true}
                                   name='hand'
                        />
                        <FormInput label="Play Serve Lift"
                                   form={formik}
                                   required={true}
                                   name='play'
                        />

                        <Divider className={globalStyles.formDivider}/>

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
                            <FormSelect form={formik}
                                        name={`MatchMakerTypeId`}
                                        label='Match Type'
                                        options={matchTypes}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>

                            <FormSelect form={formik}
                                        name={`MatchMakerGender`}
                                        label='Gender Restrictions'
                                        options={[]}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>

                            <FormSelect form={formik}
                                        name={`MatchMakerRatingCategoryId`}
                                        label='Rating Restriction'
                                        options={[]}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>

                            <InlineBlock>
                                <FormSelect form={formik}
                                            name={`MatchMakerMinNumberOfPlayers`}
                                            label='Min. Players'
                                            options={[]}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>

                                <FormSelect form={formik}
                                            name={`MatchMakerMaxNumberOfPlayers`}
                                            label='Max. Players'
                                            options={[]}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>
                            </InlineBlock>

                            <InlineBlock>
                                <FormSelect form={formik}
                                            name={`MatchMakerMinNumberOfPlayers`}
                                            label='Min. Players'
                                            options={[]}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>

                                <FormSelect form={formik}
                                            name={`MatchMakerMaxNumberOfPlayers`}
                                            label='Max. Players'
                                            options={[]}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>
                            </InlineBlock>

                            <FormTextarea form={formik}
                                          max={200}
                                          label={'What to expect in this match'}
                                          name={`Description`}/>

                            <FormSwitch label={'Is this a private match'}
                                        form={formik}
                                        name={'MatchMakerIsPrivateMatch'}/>

                            {toBoolean(formik?.values?.MatchMakerIsPrivateMatch) &&
                                <FormInput form={formik}
                                           required={true}
                                           label={'Join Code'}
                                           name={`MatchMakerJoinCode`}/>
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
                        searchType={2}
                        addSearch={true}
                        isSearchLoading={isPlayersSearch}
                        confirmButtonText={'Close'}
                        onConfirmButtonClick={addPlayers}
                    >
                        <PaddingBlock>
                            {/*//todo iv change to dynamic calculation*/}
                            <Flex vertical style={{minHeight: `calc(80vh - 98px - 72px)`}}>
                                {anyInList(searchingPlayers) &&
                                    <Flex vertical gap={token.padding}>
                                        {searchingPlayers.map((player, index) => (
                                            <div key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <Flex gap={token.Custom.cardIconPadding} align={'center'}>
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
                                                            <Ellipsis direction='end' content={player.DisplayName}/>
                                                        </Text>
                                                    </Flex>

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
                            </Flex>
                        </PaddingBlock>
                    </DrawerBottom>

                    {/*Edit guest*/}
                    <DrawerBottom
                        maxHeightVh={80}
                        showDrawer={!isNullOrEmpty(selectedGuest)}
                        closeDrawer={updateSelectedGuest}
                        label={'Edit Guest'}
                        showButton={false}
                        confirmButtonText={''}
                        onConfirmButtonClick={updateSelectedGuest}
                    >
                        <PaddingBlock>
                            <FormInput label="First Name"
                                       form={formik}
                                       required={true}
                                       name='guestFirstName'
                            />
                            <FormInput label="Last Name"
                                       form={formik}
                                       required={true}
                                       name='guestLastName'
                            />
                            <FormInput label="Email"
                                       form={formik}
                                       required={true}
                                       name='guestEmail'
                            />

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
                                                        console.log(e)
                                                        setGuests(prevGuests => prevGuests.filter(g => g !== selectedGuest));
                                                        setSelectedGuest(null);
                                                    }
                                                });
                                            }}>
                                        Remove
                                    </Button>

                                    <Button type="primary"
                                            block
                                            htmlType={'button'}
                                            onClick={updateSelectedGuest}>
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
                            {anyInList(miscItems) &&
                                <Flex vertical>
                                    {miscItems.map((miscItem, index) => {
                                        const isLastIndex = index === miscItems.length - 1;

                                        return (
                                            <div key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <Title level={5}
                                                           className={cx(globalStyles.noSpace)}>{miscItem.Text}</Title>

                                                    <Flex gap={token.padding} align={'center'}>
                                                        <SVG icon={'circle-minus'} size={30} color={token.colorError}/>
                                                        <Title level={5} className={cx(globalStyles.noSpace)}>0</Title>
                                                        <SVG icon={'circle-plus'} size={30} color={token.colorPrimary}/>
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
