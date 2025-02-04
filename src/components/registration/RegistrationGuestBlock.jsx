import { useApp } from "../../context/AppProvider.jsx";
import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {
    anyInList,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    moreThanOneInList,
    toBoolean
} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import FormInput from "../../form/input/FormInput.jsx";
import FormSelect from "../../form/formselect/FormSelect.jsx";
import {useStyles} from "./styles.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {cx} from "antd-style";
import {costDisplay} from "../../utils/CostUtils.jsx";
import {Ellipsis} from "antd-mobile";
import SVG from "../svg/SVG.jsx";
import FormCustomFields from "../../form/formcustomfields/FormCustomFields.jsx";
import {useAuth} from "../../context/AuthProvider.jsx";
import {emptyArray} from "../../utils/ListUtils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
const {Title, Text, Link} = Typography;
import { v4 as uuidv4 } from 'uuid';

const RegistrationGuestBlock = forwardRef(({formik, 
                                    disableAddGuest, 
                                    reservationMembers,
                                    showAllCosts,
                                    udfs,
                                    reloadPlayers,
                                    loadingState,
                                    setLoading,
                                    onGuestRemove,
                                    type,
                                    guestOrgMemberIdValue}, ref) => {
    
    const { token, globalStyles } = useApp();
    const { authData } = useAuth();
    const [selectedGuest, setSelectedGuest] = useState(null);
    const { styles } = useStyles();

    useImperativeHandle(ref, () => ({
        open: (guestGuid) => {
            let guestOwner = formik?.values?.ReservationGuests?.find(v => v.Guid === guestGuid);
            if (guestOwner) {
                setSelectedGuest(guestOwner);
            }
        },
    }));
    
    const addNewGuest = async () => {
        let guestObject = {
            FirstName: '',
            LastName: '',
            PhoneNumber: '',
            GuestOwnerId: '',
            MemberUdfs: anyInList(udfs) ? udfs : [],
            Guid: equalString(type,'event') ? uuidv4() : ''
        };

        let currentReservationGuests = formik.values.ReservationGuests || [];
        
        let updatedReservationGuests = [...currentReservationGuests, guestObject];
        await formik.setFieldValue('ReservationGuests', updatedReservationGuests);
        
        if (typeof setLoading == 'function') {
            setLoading('ReservationGuests', true);
            setLoading('SelectedReservationMembers', true);
        }
        
        if (typeof reloadPlayers == 'function') {
            //should recalculate prices and add new guest with all pricing
            let newGuests = await reloadPlayers(null, updatedReservationGuests);

            let lastGuest = newGuests && newGuests.length > 0
                ? newGuests[newGuests.length - 1]
                : null;

            if (lastGuest){
                setSelectedGuest(lastGuest);
            }
        }

        if (typeof setLoading == 'function') {
            setLoading('ReservationGuests', false);
            setLoading('SelectedReservationMembers', false);
        }
    }
    
    const getGuestDisplayIndex = (incPlayer) => {
        return getGuestIndex(incPlayer) + 1;
    }

    const getGuestIndex = (incPlayer) => {
        if (isNullOrEmpty(incPlayer)){
            return 0;
        }

        const reservationGuests = formik.values.ReservationGuests || [];
        return reservationGuests.findIndex(guest => equalString(guest.Guid, incPlayer?.Guid));
    }
    
    const removeGuest = async (guestIndex) => {
        let currentReservationGuests = formik.values.ReservationGuests || [];

        const updatedGuests = currentReservationGuests.filter(g => !equalString(g.Guid, selectedGuest.Guid));

        if (typeof setLoading == 'function') {
            setLoading('SelectedReservationMembers', true);
            setLoading('ReservationGuests', true); 
        }

        if (typeof onGuestRemove == 'function') {
            onGuestRemove(guestIndex)
        }
        
        setSelectedGuest(null);

        if (typeof reloadPlayers == 'function') {
            let newGuests = await reloadPlayers(null, updatedGuests, true);
        }
    }
    
    return (
        <>
            <div>
                <Text style={{ marginBottom: `${token.Custom.buttonPadding}px`, display: 'block' }}>
                    Guest(s)
                </Text>
                <Card
                    className={cx(globalStyles.card, anyInList(formik?.values?.ReservationGuests) ? globalStyles.playersCard : globalStyles.noPlayersCard)}>
                    <Flex vertical>
                        {toBoolean(loadingState?.ReservationGuests) &&
                            <>
                                {emptyArray(anyInList(formik?.values?.ReservationGuests) ? formik?.values?.ReservationGuests.length : 1).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button block key={index} active={true} style={{height: `48px`}}/>
                                        <Divider className={globalStyles.playersDivider}/>
                                    </div>
                                ))}
                            </>
                        }
                        
                        {(anyInList(formik?.values?.ReservationGuests) && !toBoolean(loadingState?.ReservationGuests)) &&
                            <>
                                {formik?.values?.ReservationGuests.map((guest, index) => {
                                    const isLastIndex = index === (formik?.values?.ReservationGuests).length - 1;
                                    const firstName = guest?.FirstName;
                                    const lastName = guest?.LastName;

                                    let secondRowText = '';
                                    let ownerText = '';

                                    const hasGuestsWithPayment = formik?.values?.ReservationGuests?.some(v =>
                                        (v.PaidAmt ?? 0) > 0 || v.PriceToPay > 0
                                    )

                                    if (equalString(type, 'event')) {
                                        if (moreThanOneInList(reservationMembers)){
                                            let guestOwner = reservationMembers?.find(v => v.OrganizationMemberId === guest.GuestOwnerId);
                                         
                                            if (!isNullOrEmpty(guestOwner)){
                                                secondRowText = `${guestOwner.FirstName} ${guestOwner.LastName}`;
                                            }
                                        }
                                    } else {
                                        if (!isNullOrEmpty(guest.GuestOwnerId)) {
                                            let reservationOwner = reservationMembers?.find(v => v.OrgMemberId === guest.GuestOwnerId);
                                            if (!isNullOrEmpty(reservationOwner)) {
                                                ownerText = reservationOwner.FullName;
                                            }
                                        }
                                        
                                        if (hasGuestsWithPayment && !isNullOrEmpty(ownerText)) {
                                            secondRowText = `${costDisplay(guest.PriceToPay)} (${ownerText})`;
                                        } else if (hasGuestsWithPayment) {
                                            secondRowText = `${costDisplay(guest.PriceToPay)}`;
                                        } else if (!isNullOrEmpty(ownerText)) {
                                            secondRowText = ownerText;
                                        }
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
                                                    <Flex justify={'center'} align={'center'} className={globalStyles.orgCircleMember}>
                                                        <Title level={1} className={cx(globalStyles.noSpace)}>{fullNameInitials(fullName)}</Title>
                                                    </Flex>

                                                    <Flex vertical gap={token.Custom.cardIconPadding / 2} justify={'center'}>
                                                        <Text className={cx(equalString(type, 'event') && styles.eventFullName)}>
                                                            <Ellipsis direction='end' content={displayFullName}/>
                                                        </Text>
                                                        {!isNullOrEmpty(secondRowText) &&
                                                            <Text type="secondary">{secondRowText}</Text>
                                                        }
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
                label={`Edit Guest #${getGuestDisplayIndex(selectedGuest)}`}
                showButton={true}
                customFooter={<PaddingBlock>
                    <Flex gap={token.padding}>
                        <Button type="primary"
                                danger
                                block
                                ghost
                                htmlType={'button'}
                                onClick={() => {
                                    displayMessageModal({
                                        title: 'Remove',
                                        html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                                            <Text>{'Are you sure you want to remove Guest?'}</Text>

                                            <Flex vertical={true} gap={token.padding}>
                                                <Button block={true} danger={true} type={'primary'} onClick={() => {
                                                    removeGuest(getGuestIndex(selectedGuest));
                                                    onClose();
                                                }}>
                                                    Remove
                                                </Button>

                                                <Button block={true} onClick={() => {
                                                    onClose();
                                                }}>
                                                    Save
                                                </Button>
                                            </Flex>
                                        </Flex>,
                                        type: "warning",
                                    })
                                }}>
                            Remove
                        </Button>
                        <Button block
                                htmlType={'button'}
                                type="primary"
                                onClick={() => {
                                    setSelectedGuest(null)
                                }}>
                            Save
                        </Button>
                    </Flex>
                 </PaddingBlock>}
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

                        if (!equalString(getGuestIndex(selectedGuest), index)){
                            return (<div key={index}></div>);
                        }
                        
                        return (
                            <div key={index}>
                                <Flex vertical={true} gap={token.padding}>
                                    <FormInput label="First Name"
                                               formik={formik}
                                               required={true}
                                               name={`ReservationGuests[${index}].FirstName`}
                                    />

                                    <FormInput label="Last Name"
                                               formik={formik}
                                               required={true}
                                               name={`ReservationGuests[${index}].LastName`}
                                    />

                                    <FormInput label="Phone Number"
                                               formik={formik}
                                               required={true}
                                               name={`ReservationGuests[${index}].PhoneNumber`}
                                    />

                                    {(toBoolean(authData?.AllowMembersToChangeGuestOwnerOnMemberPortal) && moreThanOneInList(reservationMembers)) &&
                                        <FormSelect formik={formik}
                                                    name={`ReservationGuests[${index}].GuestOwnerId`}
                                                    label='Owner'
                                                    options={reservationMembers}
                                                    required={true}
                                                    propText='FullName'
                                                    propValue={isNullOrEmpty(guestOrgMemberIdValue) ? 'OrgMemberId' : guestOrgMemberIdValue}/>
                                    }

                                    <FormCustomFields customFields={selectedGuest?.MemberUdfs}
                                                      formik={formik}
                                                      index={index}
                                                      name={'ReservationGuests[{index}].MemberUdfs[{udfIndex}].Value'}/>

                                    {hasGuestsWithPayment &&
                                        <>
                                            <FormInput label={isOverriden ? "Daily Cost" : "Cost"}
                                                       formik={formik}
                                                       disabled={true}
                                                       name={isOverriden ? `ReservationGuests[${index}].OverriddenPrice` : `ReservationGuests[${index}].PriceToPay`}
                                            />

                                            {showAllCosts &&
                                                <>
                                                    <FormInput label="Subtotal"
                                                               formik={formik}
                                                               disabled={true}
                                                               name={`ReservationGuests[${index}].Subtotal`}
                                                    />

                                                    <FormInput label="Paid"
                                                               formik={formik}
                                                               disabled={true}
                                                               name={`ReservationGuests[${index}].PaidAmt`}
                                                    />

                                                    <FormInput label="Due"
                                                               formik={formik}
                                                               disabled={true}
                                                               name={`ReservationGuests[${index}].TotalDue`}
                                                    />
                                                </>
                                            }
                                        </>
                                    }
                                </Flex>
                            </div>
                        )
                    })}
                </PaddingBlock>
            </DrawerBottom>
        </>
    );
});

export default RegistrationGuestBlock;