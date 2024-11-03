import { useApp } from "../../context/AppProvider.jsx";
import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, fullNameInitials, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import FormInput from "../../form/input/FormInput.jsx";
import FormSelect from "../../form/formselect/FormSelect.jsx";
import InlineBlock from "../inlineblock/InlineBlock.jsx";
import {Button, Card, Divider, Flex, Typography} from "antd";
import {ModalRemove} from "../../utils/ModalUtils.jsx";
import React, {useState} from "react";
import {cx} from "antd-style";
import {costDisplay} from "../../utils/CostUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import FormCustomFields from "../../form/formcustomfields/FormCustomFields.jsx";
const {Title, Text, Link} = Typography;

function RegistrationGuestBlock({formik, disableAddGuest, showGuestOwner, reservationMembers=[], showAllCosts, udfs}) {
    const { token,globalStyles } = useApp();
    const [selectedGuest, setSelectedGuest] = useState(null);

    return (
        <>
            <div>
                <Text
                    style={{
                        marginBottom: `${token.Custom.buttonPadding}px`,
                        display: 'block'
                    }}>Guest(s)</Text>
                <Card
                    className={cx(globalStyles.card, anyInList(formik?.values?.ReservationGuests) ? globalStyles.playersCard : globalStyles.noPlayersCard)}>
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
                                        secondRowText = `${costDisplay(guest.PriceToPay)} (${ownerText})`;
                                    } else if (hasGuestsWithPayment) {
                                        secondRowText = `${costDisplay(guest.PriceToPay)}`;
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
                                                            <Ellipsis direction='end' content={displayFullName}/>
                                                        </Text>
                                                        <Text type="secondary">${secondRowText}</Text>
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
                            </>

                        }
                        <Button type="primary"
                                block
                                ghost
                                disabled={disableAddGuest}
                                htmlType={'button'}
                                onClick={() => {
                                    let guestObject = {
                                        Index: isNullOrEmpty(formik?.values?.ReservationGuests?.length) ? 1 : formik.values.ReservationGuests.length + 1,
                                        FirstName: '',
                                        LastName: '',
                                        PhoneNumber: '',
                                        GuestOwnerId: '',
                                        MemberUdfs: anyInList(udfs) ? udfs : []
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
            
            <DrawerBottom
                maxHeightVh={80}
                showDrawer={!isNullOrEmpty(selectedGuest)}
                closeDrawer={() => {
                    setSelectedGuest(null)
                }}
                label={`Edit Guest #${((selectedGuest?.Index) ?? 1)}`}
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

                                {showGuestOwner &&
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

                                <FormCustomFields customFields={selectedGuest.MemberUdfs} form={formik} index={index} name={'ReservationGuests[{index}].MemberUdfs[{Id}]'}/>
                                
                                {hasGuestsWithPayment &&
                                    <>
                                        <FormInput label={isOverriden ? "Daily Cost" : "Cost"}
                                                   form={formik}
                                                   disabled={true}
                                                   name={isOverriden ? `ReservationGuests[${index}].OverriddenPrice` : `ReservationGuests[${index}].PriceToPay`}
                                        />

                                        {showAllCosts &&
                                            <>
                                                <FormInput label="Subtotal"
                                                           form={formik}
                                                           disabled={true}
                                                           name={`ReservationGuests[${index}].Subtotal`}
                                                />

                                                <FormInput label="Paid"
                                                           form={formik}
                                                           disabled={true}
                                                           name={`ReservationGuests[${index}].PaidAmt`}
                                                />

                                                <FormInput label="Due"
                                                           form={formik}
                                                           disabled={true}
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
        </>
    );
}

export default RegistrationGuestBlock;