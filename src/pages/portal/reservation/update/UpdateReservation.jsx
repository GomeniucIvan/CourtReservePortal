
import {data, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {Alert, Button, Divider, Flex, Segmented, Skeleton, Typography} from "antd";
import * as Yup from "yup";
import {cx} from "antd-style";
import {useApp} from "@/context/AppProvider.jsx";
import {useLoadingState} from "@/utils/LoadingUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {
    anyInList,
    encodeParam,
    encodeParamsObject,
    equalString,
    isNullOrEmpty,
    nullToEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {
    fromDateTimeStringToDateFormat, fromDateTimeStringToDateTime,
    fromTimeSpanString
} from "@/utils/DateUtils.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import {useTranslation} from "react-i18next";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import CreateOrUpdateReservationTermsAndCondition
    from "@portal/reservation/modules/CreateOrUpdateReservation.TermsAndCondition.jsx";
import CreateOrUpdateReservationMiscItems from "@portal/reservation/modules/CreateOrUpdateReservation.MiscItems.jsx";
import CreateOrUpdateReservationMatchMaker from "@portal/reservation/modules/CreateOrUpdateReservation.MatchMaker.jsx";
import {
    reservationCreateOrUpdateFormik, reservationCreateOrUpdateInitialValues as anyIncResData,
    reservationCreateOrUpdateInitialValues,
    reservationCreateOrUpdateLoadDataSuccessResponse,
    reservationCreateOrUpdateLoadEndTime,
    reservationCreateOrUpdateLoadResources,
    reservationCreateOrUpdateOnFormikReservationTypeChange,
    reservationCreateOrUpdateOnReservationTypeChange,
    reservationCreateOrUpdateReloadCourts,
    reservationCreateOrUpdateReloadPlayers
} from "@services/reservation/reservationServices.js";
import CreateOrUpdateReservationPlayers from "@portal/reservation/modules/CreateOrUpdateReservation.Players.jsx";

const {Title, Text, Link} = Typography;

function UpdateReservation() {
    const navigate = useNavigate();
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const location = useLocation();
    const {t} = useTranslation('');
    let {reservationId} = useParams();
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();

    const {
        setIsFooterVisible,
        shouldFetch,
        resetFetch,
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
    const [paymentList, setPaymentList] = useState([]);

    let selectRegisteringMemberIdRef = useRef();
    let selectReservationTypeIdRef = useRef();
    let searchPlayerDrawerBottomRef = useRef();

    const initialValues = {
        ...reservationCreateOrUpdateInitialValues,
        ReservationId: reservationId,
        // CustomSchedulerId: customSchedulerId,
        // EndTime: fromTimeSpanString(end),
        OrgId: orgId
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

    const isLesson = !isNullOrEmpty(reservation?.InstructorId);

    //FORMIK
    const formik = reservationCreateOrUpdateFormik(initialValues,
        validationSchema,
        t,
        matchMaker,
        reservationMembers,
        authData,
        setIsLoading,
        orgId,
        navigate,
        isLesson,
        true);

    const loadData = async (refresh) => {
        let r = await appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/ReservationsApi/UpdateMyReservation?id=${orgId}&reservationId=${reservationId}`);

        if (toBoolean(r?.IsValid)) {
            let incResData = r.Data.ReservationModel;

            setHeaderTitle(!isNullOrEmpty(incResData?.InstructorId) ? 'Lesson Details' : 'Reservation Details');
            
            await reservationCreateOrUpdateLoadDataSuccessResponse(r,
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
                formik?.values?.StartTime,
                formik?.values?.EndTime
            );
            await formik.setValues({
                ...initialValues,
                ReservationTypeId: incResData.ReservationTypeId,
                Duration: incResData.Duration,
                Udfs: anyInList(incResData?.Udfs) ? incResData?.Udfs : [],
                CourtId: anyInList(incResData?.CourtId) ? incResData?.CourtId : [],
                StartTime: incResData.DateStartTimeStringDisplay,
                EndTime: incResData.EndTime,
                ReservationGuests: incResData?.ReservationGuests,
                MemberId: incResData.MemberId,
                Date: incResData.DateStringDisplay,
            });
            
            if (!toBoolean(r.Data.IsResourceReservation)) {
                setLoading('ReservationTypeId', true);

                // if (!isNullOrEmpty(dataItem?.Value) && isNullOrEmpty(incResData.InstructorId)) {
                //     setCourts([{
                //         DisplayName: `${dataItem.CourtTypeName} - ${dataItem.DisplayMobilSchedulerHeaderName}`,
                //         Id: dataItem.Value
                //     }]);
                //     await formik.setFieldValue('CourtId', dataItem.Value);
                // }
                
                setReservationMembers(incResData.InitialMembers);
                
                let reservationTypeData = {
                    customSchedulerId: incResData.CustomSchedulerId,
                    userId: incResData.RegisteringMemberId,
                    startTime: formik?.values?.StartTime,
                    date: formik?.values?.StartTime,
                    courtId: formik?.values?.CourtId,
                    courtType: incResData.CourtTypeEnum,
                    endTime: formik?.values?.EndTime,
                    isDynamicSlot:incResData.IsFromDynamicSlots,
                    instructorId: incResData.InstructorId
                }

                let rTypes = await appService.getRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/AjaxReservation/GetAvailableReservationTypes?id=${orgId}&${encodeParamsObject(reservationTypeData)}`);
                setReservationTypes(rTypes);
                setLoading('ReservationTypeId', false);
            }
        } else {
            setIsFetching(false);

            if (!isNullOrEmpty(r?.Path)) {
                navigate(r.Path);
            } else {
                displayMessageModal({
                    title: "Error",
                    html: (onClose) => r.Message,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            }
        }

        resetFetch();
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.ReservationTypeId)){
            onReservationTypeChange();
        }
    }, [formik?.values?.ReservationTypeId]);

    const onReservationTypeChange = async () => {
        await reservationCreateOrUpdateOnReservationTypeChange(setLoading,
            formik,
            reservation.DateStartTimeStringDisplay,
            reservation,
            authData,
            orgId,
            setDurations,
            setCustomFields)
    }

    useEffect(() => {

        const loadEndTime = async () => {
            await reservationCreateOrUpdateLoadEndTime(formik, reservation?.DateStartTimeStringDisplay, authData, orgId, reloadCourts, reloadPlayers);
        }

        loadEndTime();

    }, [formik?.values?.Duration])

    useEffect(() => {
        const loadResources = async () => {
            await reservationCreateOrUpdateLoadResources(showResources,
                setLoading,
                reservation?.DateStartTimeStringDisplay,
                formik,
                reservation,
                courts,
                authData,
                orgId,
                setResources)
        }

        loadResources();
    }, [formik?.values?.EndTime]);

    useEffect(() => {
        if ((!isNullOrEmpty(formik?.values?.RegisteringMemberId) &&
                !isNullOrEmpty(formik?.values?.Duration)) &&
            !isNullOrEmpty(formik?.values?.ReservationTypeId) &&
            !isNullOrEmpty(formik?.values?.EndTime) &&
            !isNullOrEmpty(formik?.values?.CourtId)) {
            reloadPlayers();
        }
    }, [formik?.values?.RegisteringMemberId, formik?.values?.Duration, formik?.values?.FeeResponsibility, formik?.values?.CourtId, formik?.values?.EndTime]);

    useEffect(() => {
        reservationCreateOrUpdateOnFormikReservationTypeChange(formik,
            setSelectedReservationType,
            reservation);

    }, [formik?.values?.ReservationTypeId]);

    useEffect(() => {
        if (shouldFetch) {
            //(true);
        }
    }, [shouldFetch, resetFetch]);

    //members guest table
    const reloadPlayers = async (orgMemberIdToRemove, incGuests, isGuestRemove) => {
        return reservationCreateOrUpdateReloadPlayers(setLoading,
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
            setPlayersModelData
        )
    }

    const reloadCourts = async (endTime) => {
        await reservationCreateOrUpdateReloadCourts(setLoading,
            reservation,
            reservation?.DateStartTimeStringDisplay,
            endTime,
            formik,
            authData,
            orgId,
            setCourts)
    }

    useEffect(() => {
        let paymentData = {
            list: anyInList(paymentList) ? paymentList.map(paymentItem =>({
                label: paymentItem.Text,
                value: paymentItem.Value
            })) : [],
            totalDue: totalPriceToPay,
            requireOnlinePayment: toBoolean(reservation?.RequirePaymentWhenBookingCourtsOnline),
            show: totalPriceToPay > 0,
            holdTimeForReservation: reservation?.HoldTimeForReservation
        };

        if (!isFetching && isNullOrEmpty(reservation)) {
            setFooterContent('')
        } else {
            setFooterContent(<PaymentDrawerBottom paymentData={paymentData}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        loading={isLoading}
                        disabled={isFetching}
                        onClick={formik.handleSubmit}>
                    Update
                </Button>
            </PaymentDrawerBottom>)
        }
    }, [isFetching, isLoading, totalPriceToPay, reservation,reservation]);

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

            {(!isFetching && !isNullOrEmpty(reservation)) &&
                <>
                    <PaddingBlock topBottom={true}>
                        <Flex vertical={true} gap={token.padding}>
                            <Title level={1} className={globalStyles.noTopPadding}>{isLesson ? 'Lesson Details' : 'Reservation Details'}</Title>

                            {!isNullOrEmpty(reservation?.DateStartTimeStringDisplay) &&
                                <>
                                    {!toBoolean(allowToSelectedStartTime(reservation)) &&
                                        <>
                                            <FormInputDisplay label="Date & Time"
                                                              disabled={true}
                                                              value={`${fromDateTimeStringToDateFormat(reservation?.DateStartTimeStringDisplay, 'dddd, MMMM D')}, ${fromTimeSpanString(reservation.DateStartTimeStringDisplay, 'h:mma', true)}`}
                                            />
                                        </>
                                    }
                                </>
                            }

                            {!isNullOrEmpty(reservation?.InstructorId) &&
                                <FormInput formik={formik}
                                           disabled={true}
                                           label={'Instructor'}
                                           name={`InstructorName`}/>
                            }

                            {anyInList(reservation?.FamilyMembers) &&
                                <div style={{display: 'none'}}>
                                    <FormSelect formik={formik}
                                                ref={selectRegisteringMemberIdRef}
                                                name={`RegisteringMemberId`}
                                                label='Reserve For'
                                                options={reservation?.FamilyMembers}
                                                required={true}
                                                propText='FullName'
                                                propValue='Id'/>
                                </div>
                            }

                            {toBoolean(reservation?.IsResourceReservation) ? (
                                <FormSelect formik={formik}
                                            name={`ReservationTypeId`}
                                            label={isLesson ? 'Lesson Type' : 'Reservation Type'}
                                            options={reservation?.ReservationTypesSelectListItem}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>
                            ) : (
                                <FormSelect formik={formik}
                                            name={`ReservationTypeId`}
                                            label={isLesson ? 'Lesson Type' : 'Reservation Type'}
                                            options={reservationTypes}
                                            ref={selectReservationTypeIdRef}
                                            required={true}
                                            loading={toBoolean(loadingState.ReservationTypeId)}
                                            propText='Name'
                                            propValue='Id'/>
                            )}

                            {toBoolean(reservation?.IsResourceReservation) &&
                                <FormInput formik={formik}
                                           disabled={true}
                                           label={'Resource'}
                                           name={`SelectedResourceName`}/>
                            }

                            <InlineBlock>
                                {toBoolean(allowToSelectedStartTime(reservation)) &&
                                    <>
                                        <FormInput label="Start Time"
                                                   formik={formik}
                                                   required={true}
                                                   name='StartTime'
                                        />

                                        <FormInput label="End Time"
                                                   formik={formik}
                                                   required={true}
                                                   name='EndTime'
                                        />
                                    </>
                                }

                                {!toBoolean(allowToSelectedStartTime(reservation)) &&
                                    <>
                                        <FormSelect label="Duration"
                                                    formik={formik}
                                                    name='Duration'
                                                    options={durations}
                                                    required={true}
                                                    loading={loadingState.Duration}
                                        />

                                        <FormInput label="End Time"
                                                   formik={formik}
                                                   required={true}
                                                   disabled={true}
                                                   name='EndTime'
                                        />
                                    </>
                                }
                            </InlineBlock>

                            {((!toBoolean(reservation?.IsConsolidatedScheduler) && !toBoolean(reservation?.IsResourceReservation) && !toBoolean(reservation?.InstructorId)) ||
                                    (toBoolean(reservation?.InstructorId) && toBoolean(reservation?.CanSelectCourt))) &&
                                <FormSelect formik={formik}
                                            name={`CourtId`}
                                            label='Court(s)'
                                            options={courts}
                                            required={(toBoolean(reservation?.InstructorId) && toBoolean(reservation?.IsCourtRequired)) || !toBoolean(reservation?.InstructorId)}
                                            loading={toBoolean(loadingState.CourtId)}
                                            propText='DisplayName'
                                            propValue='Id'/>
                            }

                            <CreateOrUpdateReservationMatchMaker
                                formik={formik}
                                matchMaker={matchMaker}
                                selectedReservationType={selectedReservationType}
                                matchMakerShowSportTypes={matchMakerShowSportTypes}
                                matchMakerMemberGroups={matchMakerMemberGroups}
                                matchMakerRatingCategories={matchMakerRatingCategories}
                            />

                            <CreateOrUpdateReservationPlayers
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
                                reloadPlayers={reloadPlayers}
                                setLoading={setLoading}
                                playersModelData={playersModelData}
                                searchPlayerDrawerBottomRef={searchPlayerDrawerBottomRef}
                            />

                            <Divider className={cx(globalStyles.formDivider, globalStyles.noMargin)}/>

                            {!toBoolean(formik?.values?.IsOpenReservation) &&
                                <CreateOrUpdateReservationMiscItems miscFeesQuantities={miscFeesQuantities}
                                                                    setMiscFeesQuantities={setMiscFeesQuantities}/>
                            }

                            {(showResources && anyInList(resources)) &&
                                <FormSelect formik={formik}
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

                                    <FormCustomFields customFields={formik?.values?.Udfs} formik={formik} loading={isFetching} name={`Udfs[{udfIndex}].Value`}/>
                                    <Divider className={cx(globalStyles.formDivider, globalStyles.noMargin)}/>
                                </>
                            }

                            <CreateOrUpdateReservationTermsAndCondition disclosure={disclosure} formik={formik} />
                        </Flex>
                    </PaddingBlock>
                </>
            }
        </>
    )
}

export default UpdateReservation;
