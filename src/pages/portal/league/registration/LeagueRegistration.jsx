import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {anyInList, equalString, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import {Button, Flex, List, Skeleton, Switch, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {dateTimeToFormat, dateTimeToTimes} from "@/utils/DateUtils.jsx";
import {displayLeaguePlayerFormat, leagueDisplayEventDates} from "@portal/league/functions.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import LeagueSessionDetailsPartial from "@portal/league/modules/LeagueSessionDetailsPartial.jsx";
import {Toast} from "antd-mobile";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {invalidEventGuestsErrors, validateEventMembersUdfs} from "@/utils/ValidationUtils.jsx";
import {generateEventPostModel} from "@portal/event/registration/modules/functions.jsx";
import {removeLastHistoryEntry} from "@/toolkit/HistoryStack.js";
import {eventValidResponseRedirect} from "@/utils/RedirectUtils.jsx";
import {any} from "prop-types";
import PaymentDrawerBottom from "@/components/drawer/PaymentDrawerBottom.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";
import LeagueSessionRestrictionBlock from "@portal/league/modules/LeagueSessionRestrictionBlock.jsx";
const {Title, Text} = Typography;

function LeagueRegistration() {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const [errorData, setErrorData] = useState(null);

    const {
        setIsFooterVisible,
        setFooterContent,
        token,
        globalStyles,
        isLoading,
        setIsLoading,
        setDynamicPages
    } = useApp();
    const {orgId, authDataOrgMemberIds} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("sessionId");
    const leagueId = queryParams.get("leagueId");
    const resId = queryParams.get("resId");

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

            if (countListItems(authDataOrgMemberIds) > 0) {
                let checkedMembers = formik?.values?.FamilyMembers.filter(member => toBoolean(member.IsChecked));
                isValid = countListItems(checkedMembers) > 0;
                if (countListItems(checkedMembers) === 0) {
                    displayMessageModal({
                        title: "Registration Error",
                        html: (onClose) => 'Select Member(s) to register.',
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

            let postModel = {
                ...sessionDetails,
                FamilyMembers: values.FamilyMembers,
            }

            let response = await appService.post(`/app/Online/Leagues/RegisterOrEdit?id=${orgId}`, postModel);
            if (toBoolean(response?.IsValid)) {
                //remove current page
                removeLastHistoryEntry();
                pNotify('Successfully Registered');

                let route = toRoute(LeagueRouteNames.LEAGUE_DETAIL, 'id', orgId);
                route = toRoute(route, 'lsid', sessionId);
                setPage(setDynamicPages, sessionDetails?.LeagueSession.Name, route);
                navigate(route);
            } else {
                displayMessageModal({
                    title: "Registration Error",
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

        let response = await appService.get(navigate, `/app/Online/Leagues/RegisterOrEdit?id=${orgId}&sessionId=${sessionId}&leagueId=${leagueId}&resId=${resId}`);
        if (toBoolean(response?.IsValid)){
            let respData = response.Data;

            setSessionDetails(respData);
            formik.setFieldValue("FamilyMembers", respData.FamilyMembers);
        } else {

            if (!isNullOrEmpty(response?.RestrictionData)) {
                //hide submit button
                let respData = response.RestrictionData;
                setErrorData(respData);
            } else {
                displayMessageModal({
                    title: 'Error',
                    html: (onClose) => `${response?.Message}.`,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            }
        }

        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        setFooterContent('');
        loadData();
    }, []);

    useEffect(() => {
        let members = [];

        if (anyInList(formik?.values?.FamilyMembers)) {
            members = formik.values?.FamilyMembers;
        }

        let checkedMembers = members.filter(member => toBoolean(member.IsChecked));
        let membersWithDue = checkedMembers.filter(member => member.Price > 0);

        let totalPriceToPay = membersWithDue.reduce((sum, member) => sum + member.Price, 0);

        let paymentLists = [];
        if (anyInList(membersWithDue)){
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
            requireOnlinePayment: toBoolean(sessionDetails?.RequireOnlinePayment),
            show: totalPriceToPay > 0,
            holdTimeForReservation: sessionDetails?.HoldTimeForReservation
        };

        if (isNullOrEmpty(errorData)) {
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
        } else {
            setFooterContent('');
        }


    }, [isFetching, isLoading, formik.values, errorData])

    const toggleInitialCheck = (index) => {
        formik.setFieldValue(
            'FamilyMembers',
            formik.values.FamilyMembers.map((member, idx) =>
                idx === index ? { ...member, IsChecked: !member.IsChecked } : member
            )
        );
    };

    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                <Flex vertical={true} gap={token.paddingMD}>
                    {isFetching &&
                        <Flex vertical={true} gap={token.padding}>
                            {emptyArray(8).map((item, index) => (
                                <Skeleton.Button block key={index} active={true} style={{height : `60px`}} />
                            ))}
                        </Flex>
                    }

                    {(!isFetching && !isNullOrEmpty(sessionDetails)) &&
                        <>
                            <div>
                                <Text type="secondary">{sessionDetails?.LeagueSession.Name}</Text>
                                <Title level={3} style={{marginBottom: 0}}>
                                    {sessionDetails?.LeagueSession.LeagueName}
                                </Title>
                            </div>

                            <Flex vertical={true} gap={token.paddingXXS}>
                                <LeagueSessionDetailsPartial sessionDetails={sessionDetails?.LeagueSession}/>
                            </Flex>
                        </>
                    }

                    {(!isFetching && !isNullOrEmpty(errorData)) &&
                        <LeagueSessionRestrictionBlock model={errorData} memberIds={authDataOrgMemberIds} />
                    }
                </Flex>


                {/*//TODO FIND A WAY TO MERGE WITH EVENTS*/}
                {(countListItems(authDataOrgMemberIds) > 1 && anyInList(formik.values.FamilyMembers)) &&
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={formik.values.FamilyMembers}
                            bordered
                            renderItem={(member, index) => {
                                return (
                                    <List.Item className={globalStyles.listItemSM}>
                                        <Flex vertical={true} gap={token.padding} flex={1}>
                                            <Flex justify={'space-between'} align={'center'}>
                                                <Title level={3} onClick={() => {
                                                    toggleInitialCheck(index)
                                                }}>
                                                    {member.FirstName} {member.LastName}
                                                </Title>
                                                <Switch checked={member.IsChecked} onChange={() => toggleInitialCheck(index)}/>
                                            </Flex>
                                        </Flex>
                                    </List.Item>
                                )
                            }}
                        />
                    </>
                }
            </Flex>

        </PaddingBlock>
    )
}

export default LeagueRegistration
