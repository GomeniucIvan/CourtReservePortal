import { useApp } from "../../context/AppProvider.jsx";
import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, equalString, fullNameInitials, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import FormInput from "../../form/input/FormInput.jsx";
import FormSelect from "../../form/formselect/FormSelect.jsx";
import InlineBlock from "../inlineblock/InlineBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {ModalRemove} from "../../utils/ModalUtils.jsx";
import React, {useState} from "react";
import {cx} from "antd-style";
import {costDisplay} from "../../utils/CostUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import FormCustomFields from "../../form/formcustomfields/FormCustomFields.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {emptyArray} from "../../utils/ListUtils.jsx";
const {Title, Text, Link} = Typography;

function RegistrationGuestBlock({formik, 
                                    disableAddGuest, 
                                    reservationMembers=[],
                                    showAllCosts,
                                    udfs,
                                    reloadPlayers,
                                    loadingState,
                                    setLoading,
                                    guestOrgMemberIdValue}) {
    
    const { token, globalStyles } = useApp();
    const { authData } = useAuth();
    const [selectedGuest, setSelectedGuest] = useState(null);

    const addNewGuest = async () => {
        let guestObject = {
            FirstName: '',
            LastName: '',
            PhoneNumber: '',
            GuestOwnerId: '',
            MemberUdfs: anyInList(udfs) ? udfs : []
        };

        let currentReservationGuests = formik.values.ReservationGuests || [];
        
        let updatedReservationGuests = [...currentReservationGuests, guestObject];
        await formik.setFieldValue('ReservationGuests', updatedReservationGuests);

        console.log(updatedReservationGuests);
        
        setLoading('ReservationGuests', true);
        setLoading('SelectedReservationMembers', true);
        
        //should recalculate prices and add new guest with all pricing
        let newGuests = await reloadPlayers(null, updatedReservationGuests);
        
        let lastGuest = newGuests && newGuests.length > 0
            ? newGuests[newGuests.length - 1]
            : null;
        
        if (lastGuest){
            setSelectedGuest(lastGuest);
        }

        setLoading('ReservationGuests', false);
        setLoading('SelectedReservationMembers', false);
    }
    
    const getGuestIndex = (incPlayer) => {
        if (isNullOrEmpty(incPlayer)){
            return 1;
        }

        const reservationGuests = formik.values.ReservationGuests || []; 
        return reservationGuests.findIndex(guest => equalString(guest.Guid, incPlayer?.Guid)) + 1;
    }
    
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
                        {toBoolean(loadingState.ReservationGuests) &&
                            <>
                                {emptyArray(anyInList(formik?.values?.ReservationGuests) ? formik?.values?.ReservationGuests.length : 1).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button block key={index} active={true} style={{height: `48px`}}/>
                                        <Divider className={globalStyles.playersDivider}/>
                                    </div>
                                ))}
                            </>
                        }
                        
                        {(anyInList(formik?.values?.ReservationGuests) && !toBoolean(loadingState.ReservationGuests)) &&
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
                                                        <Title level={1}
                                                               className={cx(globalStyles.noSpace)}>{fullNameInitials(fullName)}</Title>
                                                    </Flex>

                                                    <Flex vertical
                                                          gap={token.Custom.cardIconPadding / 2}>
                                                        <Text>
                                                            <Ellipsis direction='end' content={displayFullName}/>
                                                        </Text>
                                                        <Text type="secondary">{secondRowText}</Text>
                                                    </Flex>
                                                </Flex>

                                                <SVG icon={'edit-user'} size={23} color={token.colorLink}/>

                                            </Flex>
                                            {(!isLastIndex) &&
                                                <Divider className={globalStyles.playersDivider}/>
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
                                onClick={addNewGuest}>
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
                label={`Edit Guest #${getGuestIndex(selectedGuest)}`}
                showButton={false}
                confirmButtonText={''}
                onConfirmButtonClick={() => {
                    setSelectedGuest(null)
                }}
            >
                <PaddingBlock>
                    {(anyInList(formik.values?.ReservationGuests) ? formik.values.ReservationGuests : []).map((guest, index) => {
                        const showGuest = equalString(guest.Guid, selectedGuest?.Guid);
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

                                {toBoolean(authData?.AllowMembersToChangeGuestOwnerOnMemberPortal) &&
                                    <FormSelect form={formik}
                                                name={`ReservationGuests[${index}].GuestOwnerId`}
                                                label='Owner'
                                                options={reservationMembers}
                                                required={true}
                                                onValueChange={() => {

                                                    //reloadPlayers();
                                                }}
                                                propText='FullName'
                                                propValue={isNullOrEmpty(guestOrgMemberIdValue) ? 'OrgMemberId' : guestOrgMemberIdValue}/>
                                }

                                <FormCustomFields customFields={selectedGuest?.MemberUdfs} form={formik} index={index} name={'ReservationGuests[{index}].MemberUdfs[{udfIndex}].Value'}/>
                                
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
                                                    .filter(g => !equalString(g.Guid, selectedGuest.Guid));
                                                
                                                formik.setFieldValue('ReservationGuests', updatedGuests);
                                                setSelectedGuest(null);
                                            }
                                        });
                                    }}>
                                Remove
                            </Button>

                            <Button block
                                    htmlType={'button'}
                                    onClick={() => {
                                        setSelectedGuest(null)
                                    }}>
                                Close
                            </Button>
                        </InlineBlock>
                    </div>
                </PaddingBlock>
            </DrawerBottom>
        </>
    );
}

export default RegistrationGuestBlock;