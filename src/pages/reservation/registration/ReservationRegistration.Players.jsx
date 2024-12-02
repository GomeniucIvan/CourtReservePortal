import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    toBoolean
} from "../../../utils/Utils.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import SVG from "../../../components/svg/SVG.jsx";
import React, {useEffect, useState} from "react";
import mockData from "../../../mocks/reservation-data.json";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {costDisplay} from "../../../utils/CostUtils.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {ModalRemove} from "../../../utils/ModalUtils.jsx";

const {Title, Text} = Typography;

function ReservationRegistrationPlayers({formik,
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
                                            searchPlayerDrawerBottomRef}) {

    const [isPlayersSearch, setIsPlayersSearch] = useState(false);
    const [searchingPlayers, setSearchingPlayers] = useState([]);
    const [searchPlayersText, setSearchPlayersText] = useState('');
    const {orgId} = useAuth();
    
    const { globalStyles, token} = useApp();
    
    
    // PLAYERS FUNCTIONS START
    const onPlayersSearch = (searchVal) => {
        setSearchPlayersText(searchVal);
    }

    const addPlayers = () => {
        setShowSearchPlayers(false);
    }
    
    useEffect(() => {
        if (showSearchPlayers) {

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
        } else {

        }
    }, [showSearchPlayers, searchPlayersText, reservationMembers]);
    
    const addRemovePlayerFromFavourite = async (player, addToFavList) => {
        let response = await appService.postRoute(apiRoutes.CREATE_RESERVATION, `/app/Online/OrganizationMemberFavoriteApi/AddOrRemoveOrgMemberFromFavoriteList?id=${orgId}&orgMemberIdToAdd=${player.MemberOrgId}&addToFavList=${addToFavList}`)

        if (toBoolean(response?.IsValid)) {
            if (addToFavList){
                setSearchPlayersText('');
                searchPlayerDrawerBottomRef.current.setValue('');
                setShouldRebindPlayers(true);
            } else{
                setSearchingPlayers((prevMembers) =>
                    prevMembers.filter((member) => !equalString(member.MemberOrgId, player.MemberOrgId))
                ); 
            }
        } else {
            pNotify(response.Message, '', 'error');
        }
    }
    
    const addPlayerToReservation = (player) => {
        setReservationMembers((prevMembers) => [...prevMembers, {OrgMemberId: player.MemberOrgId}]);
        setSearchPlayersText('');
        searchPlayerDrawerBottomRef.current.setValue('');
        setShouldRebindPlayers(true);
    }
    
    const removePlayer = (player) => {
        ModalRemove({
            content: `Are you sure you want to remove ${player.FirstName} ${player.LastName}?`,
            showIcon: false,
            onRemove: (e) => {
                setReservationMembers(reservationMembers.filter(
                    member => member.OrgMemberId !== player.OrgMemberId
                ));
                setShouldRebindPlayers(true);
            }
        })
    }
    // PLAYERS FUNCTIONS END

    // GUESTS FUNCTIONS START

    // GUESTS FUNCTIONS END
    
    return (
        <>
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
                                                    <Flex justify={'center'} align={'center'}
                                                          style={{
                                                              width: 48,
                                                              height: 48,
                                                              borderRadius: 50,
                                                              backgroundColor: 'red'
                                                          }}>
                                                        <Title level={1}
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
                                                    <div onClick={() => { removePlayer(reservationMember) }}>
                                                        <SVG icon={'circle-minus'} size={23} preventFill={true}/>
                                                    </div>
                                                }
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
                                    <Text>No players message</Text>
                                }

                                {anyInList(searchingPlayers) &&
                                    <Flex vertical gap={token.padding}>
                                        {searchingPlayers.map((player, index) => (
                                            <div key={index}>
                                                <Flex justify={'space-between'} align={'center'}>
                                                    <div onClick={() => { addPlayerToReservation(player); }} style={{width: '100%'}}>
                                                        
                                                        <Flex gap={token.Custom.cardIconPadding}
                                                              align={'center'}>
                                                            <Flex justify={'center'} align={'center'}
                                                                  style={{
                                                                      width: 48,
                                                                      height: 48,
                                                                      borderRadius: 50,
                                                                      backgroundColor: 'red'
                                                                  }}>
                                                                <Title level={1}
                                                                       className={cx(globalStyles.noSpace)}>{player.FullNameInitial}</Title>
                                                            </Flex>

                                                            <Text>
                                                                <Ellipsis direction='end'
                                                                          content={player.DisplayName}/>
                                                            </Text>
                                                        </Flex>
                                                    </div>

                                                    <Flex gap={token.padding}>
                                                        <div onClick={() => { addRemovePlayerFromFavourite(player, !player.IsFavoriteMember); }}>
                                                            
                                                            {toBoolean(player.IsFavoriteMember) ?
                                                                (<SVG icon={'hearth-filled'} size={24}
                                                                      color={token.colorPrimary}/>) :
                                                                (<SVG icon={'hearth'} size={24}
                                                                      color={token.colorPrimary}/>)}
                                                        </div>

                                                        <div onClick={() => { addPlayerToReservation(player); }}>
                                                            <SVG icon={'circle-plus'} size={24} color={token.colorPrimary}/>
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
        </>
    )
}

export default ReservationRegistrationPlayers