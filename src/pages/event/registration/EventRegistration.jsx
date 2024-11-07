import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {AppProvider, useApp} from "../../../context/AppProvider.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, List, Typography, Switch, Skeleton } from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import mockData from "../../../mocks/event-data.json";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {AuthProvider, useAuth} from "../../../context/AuthProvider.jsx";

import {
    anyInList,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "../../../utils/DateUtils.jsx";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import PaymentDrawerBottom from "../../../components/drawer/PaymentDrawerBottom.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import {Toast} from "antd-mobile";
import DisclosuresPartial from "../../home/disclosure/DisclosuresPartial.jsx";
import Modal from "../../../components/modal/Modal.jsx";
import RegistrationGuestBlock from "../../../components/registration/RegistrationGuestBlock.jsx";

const {Title, Text} = Typography;

function EventRegistration({fullRegistration}) {
    const navigate = useNavigate();
    let {reservationId, eventId} = useParams();
    const {orgId, authData} = useAuth();
    const [event, setEvent] = useState(null);
    const [members, setMembers] = useState([]);
    const disclosureSignHandler = useRef();
    const disclosureRef = useRef();
    const [isFetching, setIsFetching] = useState(true);
    const [disclosureModalData, setDisclosureModalData] = useState(null);
    const [selectedReservationIds, setSelectedReservationIds] = useState([]);
    const [disclosureSubmitting, setDisclosureSubmitting] = useState(false);

    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        isLoading,
        setIsLoading,
        isMockData,
        shouldFetch,
        resetFetch,
        token,
        globalStyles
    } = useApp();

    const loadData = async (refresh) => {

        setIsFetching(true);
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
            setIsFetching(false);
        } else {
            let response = await appService.getRoute(apiRoutes.EventsApiUrl, `/app/Online/EventsApi/EventApi_SignUpToEvent_Get?id=${orgId}&reservationId=${reservationId}&eventId=${eventId}&ajaxCall=false&isFullEventReg=${toBoolean(fullRegistration)}`);

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
                setMembers(allMembers);
            }
            setIsFetching(false);
        }
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
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

        setFooterContent(<PaymentDrawerBottom paymentData={paymentData}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isFetching}
                    onClick={formik.handleSubmit}>
                Register
            </Button>
        </PaymentDrawerBottom>)
    }, [isFetching, isLoading, members])


    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, []);

    const initialValues = {
        reservationTypeId: '',
        ReservationGuests: []
    };

    const validationSchema = Yup.object({
        reservationTypeId: Yup.string().required('Reservation Type is require.'),
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

    const toggleInitialCheck = (index) => {
        setMembers((prevMembers) =>
            prevMembers.map((member, idx) =>
                idx === index ? { ...member, IsChecked: !member.IsChecked } : member
            )
        );
    };

    const onWaiverSignPostSuccess = () => {
        setDisclosureModalData(null)
        
        //todo we should persist all information, udf, checked and so on
        loadData();
    }

    const loadMemberWaivers = async (memberId) => {
        let selectedReservationId = toBoolean(event?.NoDropInRegistration) ? 0 : reservationId;
        let reservationIds = !toBoolean(event?.NoDropInRegistration) ? selectedReservationIds: '';

        let response = await appService.get(navigate, `/app/Online/Disclosures/Pending?id=${orgId}&userId=${memberId}&eventId=${eventId}&reservationId=${selectedReservationId}&selectedReservationIdsString=${reservationIds}`);

        if (toBoolean(response?.IsValid)) {
            disclosureSignHandler.current?.close();
            let disclosureData = response.Data;

            let members = disclosureData.Members;
            //show only for selected member
            disclosureData.Members = members.filter(member => equalString(member.MemberId, memberId));
            setDisclosureModalData(disclosureData);
        }
    }

    return (
        <>
            <PaddingBlock topBottom={true}>
                {isFetching &&
                    <Flex vertical={true} gap={16}>
                        <Flex vertical={true} gap={4}>
                            <Skeleton.Button active={true} block
                                             style={{height: `60px`, width: `${randomNumber(45, 75)}%`}}/>
                            <Skeleton.Button active={true} block
                                             style={{height: `40px`, width: `${randomNumber(45, 75)}%`}}/>
                        </Flex>

                        <Flex vertical={true} gap={4}>
                            {emptyArray(6).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block
                                                     style={{height: `50px`, width: `${randomNumber(45, 75)}%`}}/>
                                </div>
                            ))}
                        </Flex>

                        <Skeleton.Button active={true} block style={{height: `120px`}}/>
                    </Flex>
                }
                {!isFetching &&
                    <>
                        <div style={{marginBottom: `${token.padding}px`}}>
                            <Title level={4} style={{marginBottom: 0}}>
                                {event?.EventName}
                            </Title>
                            <Text type="secondary">{event?.Type}</Text>
                        </div>

                        <Flex vertical={true} gap={token.padding}>
                            <Flex vertical gap={4}>
                                {(!toBoolean(event?.IsSignUpForEntireEvent) && !toBoolean(event?.NoDropInRegistration)) &&
                                    <CardIconLabel icon={'calendar'}
                                                   description={dateTimeToFormat(event?.SelectedReservation.Start, 'ddd, MMM Do')}/>
                                }
                                {(anyInList(event?.OtherFromSameEvent) && toBoolean(event?.NoDropInRegistration)) &&
                                    <CardIconLabel icon={'calendar'} description={event?.GetDateDisplayNoDropInHeader}/>
                                }
                                <CardIconLabel icon={'clock'}
                                               description={dateTimeToTimes(event?.SelectedReservation.Start, event?.SelectedReservation.End, 'friendly')}/>
                            </Flex>

                            {moreThanOneInList(members) &&
                                <>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={members}
                                        bordered
                                        renderItem={(member, index) => {
                                            let requireToSignWaiver = equalString(member.DisclosureStatus, 2) && !toBoolean(member.InitialCheck);

                                            return (
                                                <List.Item className={globalStyles.listItemSM}>
                                                    <Flex justify={'space-between'} align={'center'} className={'width-100'}>
                                                        <Title level={5} onClick={() => {if (!requireToSignWaiver){toggleInitialCheck(index)}}}>
                                                            {member.FullName}
                                                        </Title>
                                                        <Switch checked={member.IsChecked}
                                                                onChange={() => toggleInitialCheck(index)} disabled={requireToSignWaiver}/>
                                                    </Flex>

                                                    {toBoolean(member.HasDisclosureToSign) &&
                                                        <div>
                                                            <label htmlFor={name} className={globalStyles.globalLabel}>
                                                                Sign Waiver(s)
                                                            </label>
                                                            <Button size={'small'} type={'primary'} onClick={() => {
                                                                disclosureSignHandler.current = Toast.show({
                                                                    icon: 'loading',
                                                                    content: '',
                                                                    maskClickable: false,
                                                                    duration: 0
                                                                })
                                                                loadMemberWaivers(member.Id);
                                                            }}>
                                                                Sign
                                                            </Button>
                                                        </div>
                                                    }

                                                    {toBoolean(member.IsChecked) &&
                                                        <>
                                                            <FormCustomFields customFields={member.MemberUdfs} form={formik} index={index} name={'members[{index}].MemberUdfs[{udfIndex}].Value'}/>
                                                        </>
                                                    }

                                                </List.Item>
                                            )
                                        }}
                                    />
                                </>
                            }

                            {(toBoolean(event?.AllowGuests) && members.filter(resMember => toBoolean(resMember.IsChecked)).length > 0) &&
                                <RegistrationGuestBlock disableAddGuest={false}
                                                        formik={formik}
                                                        udfs={event.Udfs}
                                                        guestOrgMemberIdValue={'OrganizationMemberId'}
                                                        showGuestOwner={members.filter(resMember => toBoolean(resMember.IsChecked)).length > 1}
                                                        reservationMembers={members.filter(resMember => toBoolean(resMember.IsChecked))}
                                                        showAllCosts={false}/>
                            }
                        </Flex>
                    </>
                }

            </PaddingBlock>

            <Modal show={!isNullOrEmpty(disclosureModalData)}
                   onClose={() => {setDisclosureModalData(null)}}
                   loading={disclosureSubmitting}
                   onConfirm={() => {
                       disclosureRef.current.submit();
                   }}
                   showConfirmButton={true}
                   confirmButtonText={'Sign'}
                   title={'Waiver(s)'}>

                <DisclosuresPartial orgId={orgId}
                                    ref={disclosureRef}
                                    isModal={true}
                                    isFormSubmit={(e) =>{
                                        setDisclosureSubmitting(e);
                                    }}
                                    disclosureData={disclosureModalData}
                                    onPostSuccess={onWaiverSignPostSuccess}
                                    navigate={navigate}/>
            </Modal>
        </>
    )
}

export default EventRegistration
