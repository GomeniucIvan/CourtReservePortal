import {useEffect, useRef, useState} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {t} from "../../../utils/OrganizationUtils.jsx";
import ModernDashboardLeaguesDates from "./Dashboard.LeagueDates.jsx";
import {Input, Menu, Typography} from "antd";
import {DownOutline} from "antd-mobile-icons";
import {Card} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import {useNavigate} from "react-router-dom";
import {HomeRouteNames} from "../../../routes/HomeRoutes.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
const { Text } = Typography;

const DashboardLeagues = ({ dashboardData, isFetching }) => {
    let [showLeaguesDrawer, setShowLeaguesDrawer] = useState(false);
    let [leagueDatesLoading, setLeagueDatesLoading] = useState(false);
    let [leagueItems, setLeagueItems] = useState([]);
    let [selectedLeagueIdArray, setSelectedLeagueIdArray] = useState([dashboardData?.SelectedLeagueSessionId]);
    let [selectedLeagueName, setSelectedLeagueName] = useState('test');
    
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
        if (anyInList(myLeaguesDropdown)) {
            setLeagueItems(myLeaguesDropdown.map((gameDay) => ({
                key: gameDay.Id.toString(),
                label: gameDay.Name,
            })))
        } else{
            setLeagueItems([]) 
        }
    }, [myLeaguesDropdown]);
    

    
    return (
        <EntityCard title={t('Leagues')} link={'/leagues'} isFetching={isFetching} addPadding={true}>
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

                        <Menu
                            className={globalStyles.drawerMenu}
                            defaultSelectedKeys={selectedLeagueIdArray}
                            mode={'inline'}
                            items={leagueItems}
                            onClick={(e) => {
                                const selectedLeagueIdKey = e.key;

                                if (selectedLeagueIdArray.some(leagueId => equalString(leagueId, selectedLeagueIdKey))) {
                                    setShowLeaguesDrawer(false);
                                }
                            }}
                            onSelect={(e) => {
                                const selectedLeagueIdKey = e.key;
                                const selectedLeague = myLeaguesDropdown.find(league => equalString(league.Id, selectedLeagueIdKey));
                                setSelectedLeagueName(selectedLeague.Name)
                                setSelectedLeagueIdArray([selectedLeagueIdKey]);
                                setShowLeaguesDrawer(false);
                            }}
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
