import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Segmented, Skeleton, Tag, Typography} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import {cx} from "antd-style";
import {Ellipsis, Toast} from "antd-mobile";
import SVG from "@/components/svg/SVG.jsx";
import React, {useEffect, useRef, useState} from "react";
import appService, {apiRoutes} from "@/api/app.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import RegistrationGuestBlock from "@/components/registration/RegistrationGuestBlock.jsx";
import Sticky from "@/components/sticky/Sticky.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {useNavigate} from "react-router-dom";
import DisclosuresPartial from "@/form/formdisclosures/DisclosuresPartial.jsx";
import Modal from "@/components/modal/Modal.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";

const {Title, Text} = Typography;

function CreateOrUpdateReservationPlayers({formik,
                                            reservation,
                                            showSearchPlayers,
                                            setShowSearchPlayers,
                                            reservationMembers,
                                            selectedReservationType,
                                            loadingState,
                                            selectRegisteringMemberIdRef,
                                            setReservationMembers,
                                            setShouldRebindPlayers,
                                            playersModelData,
                                            reloadPlayers,
                                            setLoading,
            
                                            searchPlayerDrawerBottomRef}) {

    const [isPlayersSearch, setIsPlayersSearch] = useState(false);
    const [searchingPlayers, setSearchingPlayers] = useState([]);
    const [searchPlayersText, setSearchPlayersText] = useState('');
    const {orgId, authData} = useAuth();
    const { globalStyles, token} = useApp();
    const {tagStyles} = useCombinedStyles();
    const navigate = useNavigate();
    const disclosureSignHandler = useRef();
    const disclosureRef = useRef();
    const [disclosureModalData, setDisclosureModalData] = useState(null);
    const [disclosureSubmitting, setDisclosureSubmitting] = useState(false);
    
    // PLAYERS FUNCTIONS START
    const onPlayersSearch = (searchVal) => {
        setSearchPlayersText(searchVal);
    }

    const addPlayers = () => {
        setShowSearchPlayers(false);
    }

    const loadMemberWaivers = async (memberId) => {
        let selectedReservationId = reservation.Id;

        let response = await appService.get(navigate, `/app/Online/Disclosures/Pending?id=${orgId}&userId=${memberId}&reservationId=${selectedReservationId}`);

        if (toBoolean(response?.IsValid)) {
            disclosureSignHandler.current?.close();
            let disclosureData = response.Data;

            let members = disclosureData.Members;
            //show only for selected member
            disclosureData.Members = members.filter(member => equalString(member.MemberId, memberId));
            setDisclosureModalData(disclosureData);
        }
    }

    const onWaiverSignPostSuccess = () => {
        setDisclosureModalData(null)

        reloadPlayers();
    }
    
    useEffect(() => {
        const searchPlayersByFilter = async (showSearchPlayers, searchPlayersText, reservationMembers) => {
            if (showSearchPlayers) {
                setIsPlayersSearch(true);

                if (!isNullOrEmpty(searchPlayersText) && searchPlayersText.length < 3) {
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

                let response = await appService.getRoute(apiRoutes.ServiceMemberPortal, `/app/api/v1/portalreservationsapi/Api_Reservation_GetMembersToPlayWith?id=${orgId}&${encodeParamsObject(searchPlayersData)}`);

                if (response) {
                    setSearchingPlayers(response);
                    setIsPlayersSearch(false); 
                }
            } else {

            }
        }

        searchPlayersByFilter(showSearchPlayers, searchPlayersText, reservationMembers)
    }, [showSearchPlayers, searchPlayersText, reservationMembers]);

    const addRemovePlayerFromFavourite = async (player, addToFavList) => {
        let response = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/OrganizationMemberFavoriteApi/AddOrRemoveOrgMemberFromFavoriteList?id=${orgId}&orgMemberIdToAdd=${player.MemberOrgId}&addToFavList=${addToFavList}`)

        if (toBoolean(response?.IsValid)) {
            if (addToFavList){
                setSearchingPlayers((prevMembers) =>
                    prevMembers.map((member) =>
                        equalString(member.MemberOrgId, player.MemberOrgId)
                            ? { ...member, IsFavoriteMember: true }
                            : member
                    )
                );
                pNotify(`${player.FirstName} ${player.LastName} added to favourite list.`);
            } else{
                if (isNullOrEmpty(searchPlayersText)) {
                    setSearchingPlayers((prevMembers) =>
                        prevMembers.filter((member) => !equalString(member.MemberOrgId, player.MemberOrgId))
                    );
                    
                    // setSearchPlayersText('');
                    // searchPlayerDrawerBottomRef.current.setValue('');
                    //setShouldRebindPlayers(true);
                } else {
                    setSearchingPlayers((prevMembers) =>
                        prevMembers.map((member) =>
                            equalString(member.MemberOrgId, player.MemberOrgId)
                                ? { ...member, IsFavoriteMember: false }
                                : member
                        )
                    );
                }

                pNotify(`${player.FirstName} ${player.LastName} successfully removed from favourite list.`);
            }
        } else {
            pNotify(response.Message, 'error');
        }
    }

    const addPlayerToReservation = (player) => {
        setReservationMembers((prevMembers) => [...prevMembers, {OrgMemberId: player.MemberOrgId}]);
        setSearchPlayersText('');
        searchPlayerDrawerBottomRef.current.setValue('');
        setShouldRebindPlayers(true);
        pNotify(`${player.FirstName} ${player.LastName} successfully added.`);
    }

    const removePlayer = (player) => {
        displayMessageModal({
            title: 'Remove',
            html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                <Text>{`Are you sure you want to remove ${player.FirstName} ${player.LastName}?`}</Text>

                <Flex vertical={true} gap={token.padding}>
                    <Button block={true} danger={true} type={'primary'} onClick={() => {
                        setReservationMembers(reservationMembers.filter(
                            member => member.OrgMemberId !== player.OrgMemberId
                        ));
                        setShouldRebindPlayers(true);
                        onClose();
                    }}>
                        Remove
                    </Button>

                    <Button block={true} onClick={() => {
                        onClose();
                    }}>
                        Close
                    </Button>
                </Flex>
            </Flex>,
            type: "warning",
        })
    }

    const displayPlayersInformation = () => {
        let currentPlayersCount = ((reservationMembers?.length || 0));
        if (!isNullOrEmpty(formik?.values?.ReservationGuests?.length)){
            currentPlayersCount += formik?.values?.ReservationGuests?.length;
        }
        let minMaxLabel = '';
        
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
                minMaxLabel = `Min ${currentReservationTypeMinVariable} / Max ${currentReservationTypeMaxVariable}`;
            } else if(!isNullOrEmpty(currentReservationTypeMinVariable)){
                minMaxLabel = `Min ${currentReservationTypeMinVariable}`;
            } else if(!isNullOrEmpty(currentReservationTypeMaxVariable)){
                minMaxLabel = `Max ${currentReservationTypeMaxVariable}`;
            }
        }
        
        return (
            <>
                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                    <Title level={1} className={cx(globalStyles.noSpace)} id={'players-information'}>
                        Players Information</Title>
                    <Text type="secondary">({currentPlayersCount})</Text>
                </Flex>
                <Text type="secondary">
                    {minMaxLabel}
                </Text>
            </>
        )
    }

    return (
        <>
            {!isNullOrEmpty(formik?.values?.ReservationTypeId) &&
                <>
                    <Divider className={cx(globalStyles.formDivider, globalStyles.noMargin)}/>

                    <Flex vertical gap={token.padding}>
                        <Sticky disable={isNullOrEmpty(selectedReservationType?.MinimumNumberOfPlayers) && isNullOrEmpty(selectedReservationType?.MaximumNumberOfPlayers)}>
                            <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                <Flex justify={'space-between'} align={'center'}>
                                    {displayPlayersInformation()}
                                </Flex>
                            </Flex>
                        </Sticky>

                        {toBoolean(authData?.AllowAbilityToSplitFeeAcrossReservationPlayers) && equalString(selectedReservationType?.CalculationType, 4) &&
                            <div>
                                <label className={globalStyles.globalLabel}>
                                    Fee Responsibility
                                </label>

                                <Segmented
                                    value={(isNullOrEmpty(formik?.values?.FeeResponsibility) || formik?.values?.FeeResponsibility > 2) ? '1' : `${formik?.values?.FeeResponsibility}`}
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

                        <div>
                            <Text
                                style={{
                                    marginBottom: `${token.Custom.buttonPadding}px`,
                                    display: 'block'
                                }}>Player(s)</Text>
                            <Card className={cx(globalStyles.card, globalStyles.playersCard)}>
                                <Flex vertical>
                                    {toBoolean(loadingState.SelectedReservationMembers) &&
                                        <>
                                            {emptyArray(anyInList(reservationMembers) ? reservationMembers.length : 1).map((item, index) => (
                                                <div key={index}>
                                                    <Skeleton.Button block key={index} active={true}
                                                                     style={{height: `48px`}}/>
                                                    <Divider className={globalStyles.playersDivider}/>
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
                                                                <Flex justify={'center'} align={'center'} className={globalStyles.orgCircleMember}>
                                                                    <Title level={1} className={cx(globalStyles.noSpace)}>{fullNameInitials(reservationMember.FullName)}</Title>
                                                                </Flex>

                                                                <Flex vertical
                                                                      gap={token.Custom.cardIconPadding / 2}>
                                                                    <Text>
                                                                        <Ellipsis direction='end'
                                                                                  content={reservationMember.FullName}/>
                                                                    </Text>
                                                                    <Flex gap={token.paddingSM}>
                                                                        <Text type="secondary" delete={toBoolean(reservationMember?.IsMonthlyFree)}>{costDisplay(reservationMember.PriceToPay)}</Text>
                                                                        {toBoolean(reservationMember?.IsMonthlyFree) &&
                                                                            <Tag className={cx(globalStyles.tag, tagStyles.success)}>Monthly Free</Tag>
                                                                        }
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>

                                                            <Flex align={'center'} gap={token.paddingSM}>
                                                                {toBoolean(reservationMember.HasDisclosureToSign) &&
                                                                    <div onClick={() => {
                                                                        disclosureSignHandler.current = Toast.show({
                                                                            icon: 'loading',
                                                                            content: '',
                                                                            maskClickable: false,
                                                                            duration: 0
                                                                        })
                                                                        loadMemberWaivers(reservationMember.MemberId);
                                                                    }}>

                                                                        <SVG icon={'file-signature-regular'} 
                                                                             size={30}
                                                                            color={equalString(reservationMember.DisclosureStatus, 2) ? token.colorError : token.colorInfo}
                                                                        />
                                                                    </div>
                                                                }

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
                                                                        removePlayer(reservationMember)
                                                                    }}>
                                                                        <SVG icon={'circle-minus'} size={23} preventFill={true}/>
                                                                    </div>
                                                                }
                                                            </Flex>
                                                        </Flex>

                                                        <Divider className={globalStyles.playersDivider}/>
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
                                        //style={{marginTop: `${token.padding}px`}}
                                            onClick={() => {
                                                setShowSearchPlayers(true)
                                            }}>
                                        Search Player(s)
                                    </Button>
                                </Flex>
                            </Card>
                        </div>

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
                                        <Skeleton.Button block key={index} active={true} style={{height: `48px`}}/>
                                    </div>
                                ))}
                            </Flex>
                        }

                        {!isPlayersSearch &&
                            <>
                                {!anyInList(searchingPlayers) &&
                                    <Text>No players found</Text>
                                }

                                {anyInList(searchingPlayers) &&
                                    <Flex vertical gap={token.padding}>
                                        {searchingPlayers.map((player, index) => (
                                            <div key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <div onClick={() => { addPlayerToReservation(player);
                                                    }} style={{width: '100%'}}>

                                                        <Flex gap={token.Custom.cardIconPadding}
                                                              align={'center'}>
                                                            <Flex justify={'center'} align={'center'} className={globalStyles.orgCircleMember}>
                                                                <Title level={1} className={cx(globalStyles.noSpace)}>{player.FullNameInitial}</Title>
                                                            </Flex>

                                                            <Text>
                                                                <Ellipsis direction='end' content={player.DisplayName}/>
                                                            </Text>
                                                        </Flex>
                                                    </div>

                                                    <Flex gap={token.padding}>
                                                        <div onClick={() => {
                                                            addRemovePlayerFromFavourite(player, !player.IsFavoriteMember);
                                                        }}>

                                                            {toBoolean(player.IsFavoriteMember) ?
                                                                (<SVG icon={'hearth-filled'} size={24}
                                                                      color={token.colorPrimary}/>) :
                                                                (<SVG icon={'hearth'} size={24}
                                                                      color={token.colorPrimary}/>)}
                                                        </div>

                                                        <div onClick={() => {
                                                            addPlayerToReservation(player);
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

            <Modal show={!isNullOrEmpty(disclosureModalData)}
                   onClose={() => {
                       setDisclosureModalData(null)
                   }}
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

export default CreateOrUpdateReservationPlayers