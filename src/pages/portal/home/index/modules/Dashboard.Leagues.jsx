import {useEffect, useRef, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import EntityCardWrapper from "@/components/entitycard/EntityCardWrapper.jsx";
import ModernDashboardLeaguesDates from "./Dashboard.LeagueDates.jsx";
import {Input, Menu, Typography} from "antd";
import {DownOutline} from "antd-mobile-icons";
import {useStyles} from ".././styles.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import {useNavigate} from "react-router-dom";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import FormDrawerRadio from "@/form/formradio/FormDrawerRadio.jsx";
import {stringToJson} from "@/utils/ListUtils.jsx";
import {SlickSlider} from "@/components/slickslider/SlickSlider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";

const {Text} = Typography;

const DashboardLeagues = ({dashboardData, isFetching}) => {
    let [showLeaguesDrawer, setShowLeaguesDrawer] = useState(false);
    let [leagueDatesLoading, setLeagueDatesLoading] = useState(false);
    let [leagueItems, setLeagueItems] = useState([]);
    let [selectedLeagueId, setSelectedLeagueId] = useState(null);
    let [selectedLeagueName, setSelectedLeagueName] = useState('');
    const [myLeaguesDropdown, setMyLeaguesDropdown] = useState([]);
    const [showLeaguesBlock, setShowLeaguesBlock] = useState(false);
    const [leaguesDates, setLeaguesDates] = useState([]);
    const [hideLeagues, setHideLeagues] = useState(false);

    const {styles} = useStyles();
    const navigation = useNavigate();

    useEffect(() => {
        if (!isNullOrEmpty(dashboardData)) {
            let myLeagues = stringToJson(dashboardData?.MyLeaguesDropdownJson);

            setMyLeaguesDropdown(myLeagues);
            setShowLeaguesBlock(toBoolean(dashboardData?.ShowLeaguesBlock) && anyInList(myLeagues));
            setLeaguesDates(dashboardData?.LeagueDates);
            setHideLeagues(!anyInList(myLeagues) || isNullOrEmpty(dashboardData?.SelectedLeagueSessionId));

            if (!isNullOrEmpty(dashboardData?.SelectedLeagueSessionId) && isNullOrEmpty(selectedLeagueId)) {
                const selectedLeague = myLeagues.find(league => equalString(league.Id, dashboardData?.SelectedLeagueSessionId));
                setSelectedLeagueId(dashboardData?.SelectedLeagueSessionId);
                setSelectedLeagueName(selectedLeague.Name);
            }
        }
    }, [dashboardData]);

    useEffect(() => {
        if (anyInList(myLeaguesDropdown)) {
            setLeagueItems(myLeaguesDropdown);
        } else {
            setLeagueItems([]);
        }
    }, [myLeaguesDropdown]);


    if (!showLeaguesBlock) {
        return (<></>)
    }
    
    return (
        <EntityCardWrapper title={'Leagues'} link={'/leagues'} isFetching={isFetching} addPadding={true}>

            {isFetching &&
                <SlickSlider>
                    <CardSkeleton type={SkeletonEnum.DASHBOARD_LEAGUE} count={1}/>
                </SlickSlider>
            }

            {!isFetching &&
                <>
                    {showLeaguesBlock &&
                        <div className={styles.leagueBlock}>
                            <Text className={styles.selectLeagueLabel}>
                                <small>
                                    Select League
                                </small>
                            </Text>
                            <Input
                                rootClassName={styles.leagueSelector}
                                readOnly={true}
                                value={selectedLeagueName}
                                onClick={() => {
                                    setShowLeaguesDrawer(true)
                                }}
                                suffix={
                                    <DownOutline style={{color: 'rgba(0,0,0,.45)'}}/>
                                }
                            />

                            <DrawerBottom showDrawer={showLeaguesDrawer}
                                          redirect={true}
                                          closeDrawer={() => setShowLeaguesDrawer(false)}
                                          showButton={true}
                                          confirmButtonText={'Join A League'}
                                          label='Leagues'
                                          onConfirmButtonClick={() => {
                                              setShowLeaguesDrawer(false);
                                              navigation(HomeRouteNames.LEAGUES_LIST);
                                          }}>

                                <FormDrawerRadio
                                    options={leagueItems}
                                    selectedCurrentValue={selectedLeagueId}
                                    propText={'Name'}
                                    propValue={'Id'}
                                    onValueSelect={(e) => {
                                        const selectedLeagueId = e.Id;
                                        const selectedLeague = myLeaguesDropdown.find(league => equalString(league.Id, selectedLeagueId));
                                        setSelectedLeagueName(selectedLeague.Name);
                                        setSelectedLeagueId(selectedLeagueId);
                                        setShowLeaguesDrawer(false);
                                    }}
                                    name={'league_selector'}
                                />
                            </DrawerBottom>
                        </div>
                    }

                    <div>
                        <ModernDashboardLeaguesDates leaguesDates={leaguesDates}
                                                     leagueDatesLoading={leagueDatesLoading}/>
                    </div>
                </>
            }


        </EntityCardWrapper>
    );
};

export default DashboardLeagues
