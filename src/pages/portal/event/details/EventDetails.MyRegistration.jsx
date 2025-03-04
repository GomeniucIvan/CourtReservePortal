import React from "react";
import {Card, List, Badge, Button, Modal, Flex, Typography} from "antd";
import { UserOutlined, CalendarOutlined, DollarOutlined, TeamOutlined } from "@ant-design/icons";
import {useApp} from "@/context/AppProvider.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";

const {Text, Title} = Typography;

const EventDetailsMyRegistration = ({ model }) => {
    const {token} = useApp();
    
    const authenticatedMembers = [...model.ReservationMembers].sort(
        (a, b) => new Date(b.SignUpOn) - new Date(a.SignUpOn) || a.ParentId - b.ParentId
    );

    const orderedWaitlistMemberIds = [...model.WaitingListMemberIds];

    if (
        model.ReservationWaitListMembers.length &&
        model.ReservationWaitListMembers.every((v) => v.SignUpOn) &&
        model.ReservationWaitListMembers.length === model.WaitingListMemberIds.length
    ) {
        orderedWaitlistMemberIds.sort((a, b) => new Date(a.SignUpOn) - new Date(b.SignUpOn));
    }

    const handleUnpairPlayer = (memberId, reservationMemberId, fullName) => {
        Modal.confirm({
            title: "Are you sure?",
            content: `Are you sure you want to unpair ${fullName}?`,
            onOk() {
                
            },
        });
    };

    
    return (
        <div>
            {authenticatedMembers.length > 0 || (model.AllowWaitList && model.ReservationWaitListMembers.length > 0) ? (
                <List
                    dataSource={authenticatedMembers}
                    renderItem={(member) => {
                        const status =
                            member.IsCancelled
                                ? "Canceled"
                                : member.IsApproved === null
                                    ? "Pending Approval"
                                    : member.IsApproved
                                        ? "Approved"
                                        : "Declined";

                        const showPayButton =
                            member.LeftAmountToPay > 0 &&
                            (!member.IsPaid || member.ReservationPaymentStatus === "PartialPaid") &&
                            model.AllowMembersToPayTransactionsOnPortal &&
                            model.AcceptPaymentsOnline;

                        return (
                            <Card title={`${member.FirstName} ${member.LastName}`}
                                  bordered={true} 
                                  style={{ marginBottom: token.padding }}>
                                <Flex vertical={true} gap={token.paddingMD}>
                                    <Text> Registered On: {member.SignUpOnDisplay}</Text>

                                    <Text> 
                                        Event Dates:{" "}
                                        {member.IsEntireEvent
                                            ? `${model.FirstEventDate} - ${model.LastEventDate}`
                                            : member.RegisteredDates.map((d) => new Date(d.StartTime).toLocaleDateString()).join(", ")}
                                    </Text>
                                    
                                    <Text>
                                        Price: ${costDisplay(member.PriceToPay)}
                                    </Text>

                                    {(member.IsPaired ||showPayButton) &&
                                        <Flex gap={token.padding}>
                                            {member.IsPaired && (
                                                <Button
                                                    block={true}
                                                    type="primary"
                                                    danger
                                                    onClick={() => handleUnpairPlayer(member.MemberId, member.ReservationMemberId, member.FullName)}
                                                >
                                                    Unpair
                                                </Button>
                                            )}

                                            {showPayButton && (
                                                <Button type="primary" block={true}>
                                                    Pay
                                                </Button>
                                            )}
                                        </Flex>
                                    }
                                </Flex>
                            </Card>
                        );
                    }}
                />
            ) : null}

            {model.AllowWaitList && model.ReservationWaitListMembers.length > 0 && (
                <List
                    header={<h3>Waitlist</h3>}
                    dataSource={model.ReservationWaitListMembers}
                    renderItem={(member) => (
                        <Card title={`${member.FirstName} ${member.LastName}`} bordered={true} style={{ marginBottom: 16 }}>
                            <p>
                                <TeamOutlined /> Waitlisted On: {new Date(member.SignUpOn).toLocaleDateString()}
                            </p>
                        </Card>
                    )}
                />
            )}
        </div>
    );
};

export default EventDetailsMyRegistration;
