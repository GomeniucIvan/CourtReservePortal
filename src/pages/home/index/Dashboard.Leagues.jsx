import {useEffect, useRef, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import ModernDashboardLeaguesDates from "./Dashboard.LeagueDates.jsx";
import {Input, Menu, Typography} from "antd";
import {DownOutline} from "antd-mobile-icons";
import {useStyles} from "./styles.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {useNavigate} from "react-router-dom";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import FormDrawerRadio from "../../../form/formradio/FormDrawerRadio.jsx";
const { Text } = Typography;

const DashboardLeagues = ({ dashboardData, isFetching }) => {
    let [showLeaguesDrawer, setShowLeaguesDrawer] = useState(false);
    let [leagueDatesLoading, setLeagueDatesLoading] = useState(false);
    let [leagueItems, setLeagueItems] = useState([]);
    let [selectedLeagueId, setSelectedLeagueId] = useState(null);
    let [selectedLeagueName, setSelectedLeagueName] = useState('');

    let myLeaguesDropdown = dashboardData?.MyLeaguesDropdown;
    let showLeaguesBlock = dashboardData?.ShowLeaguesBlock;
    let leaguesDates = dashboardData?.LeagueDates
    let hideLeagues = !anyInList(dashboardData?.MyLeaguesDropdown) || isNullOrEmpty(dashboardData?.SelectedLeagueSessionId);
    const { styles } = useStyles();
    const navigation = useNavigate();
    const {globalStyles} = useApp();
    
    if (!toBoolean(showLeaguesBlock) && !toBoolean(hideLeagues)){
        return '';
    }

    useEffect(() => {
        if (!isNullOrEmpty(dashboardData?.SelectedLeagueSessionId) && isNullOrEmpty(selectedLeagueId)){
            const selectedLeague = myLeaguesDropdown.find(league => equalString(league.Id, dashboardData?.SelectedLeagueSessionId));
            setSelectedLeagueId(dashboardData?.SelectedLeagueSessionId);
            setSelectedLeagueName(selectedLeague.Name);
        }
    }, [dashboardData]);
    
    useEffect(() => {
        if (anyInList(myLeaguesDropdown)) {
            setLeagueItems(myLeaguesDropdown);
        } else{
            setLeagueItems([]);
        }
    }, [myLeaguesDropdown]);
    

    
    return (
        <EntityCard title={'Leagues'} link={'/leagues'} isFetching={isFetching} addPadding={true}>
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
        </EntityCard>
    );
};

export default DashboardLeagues
