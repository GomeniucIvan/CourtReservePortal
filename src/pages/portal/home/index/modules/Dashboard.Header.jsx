import {Flex, Typography} from "antd";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, isNullOrEmpty, organizationLogoSrc, toBoolean} from "@/utils/Utils.jsx";
import {useStyles} from ".././styles.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import apiService from "@/api/api.jsx";
import {orgLogoSrc} from "@/utils/ImageUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {DownOutlined} from "@ant-design/icons";
const {Text, Title} = Typography;

const DashboardHeader = ({ dashboardData }) => {
    const [showOrganizationDrawer, setShowOrganizationDrawer] = useState(false);
    const [orgList, setOrgList] = useState([]);
    const [weather, setWeather] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [showInCelsius, setShowInCelsius] = useState(true);
    const [windMeasurements, setWindMeasurements] = useState('');
    const { styles } = useStyles();
    const {token} = useApp();
    const {spGuideId, orgId} = useAuth();

    const loadData = async () => {
        let response = await apiService.get(`/api/dashboard/weather?id=${orgId}`);

        if (toBoolean(response?.IsValid)) {
            let data = response.Data;
            
            if (toBoolean(data?.displayWeather)) {
                setWeather(data.weatherInfo);  
            }
            setShowInCelsius(data?.showInCelsius);
            setWindMeasurements(data?.windMeasurements);
        }

        setIsFetching(false);
    }
    
    useEffect(() => {
        loadData();
    }, [])
    
    const WEATHER_TYPE = {
        temperature: 'temperature',
        rainPercentage: 'rainPercentage',
        wind: 'wind'
    }
    
    const renderWeatherData = (type, value, unit) => {
        switch (type) {
            case WEATHER_TYPE.temperature:
                return (
                    <Flex align={"center"} gap={token.paddingXS}>
                        <img
                            alt="weather image"
                            src={weather?.CurrentWeatherImage}
                            className={styles.weatherHeaderIcon}
                        />
                        <Text className={styles.weatherHeaderText}>{value}&deg;</Text>
                    </Flex>
                );
            case WEATHER_TYPE.rainPercentage:
                return (
                    <Flex align={"center"} gap={4}>
                        <SVG icon={'cloud-showers'} size={16} color={token.colorPrimary} />
                        <Text className={styles.weatherHeaderText}>{value}%</Text>
                    </Flex>
                );
            case WEATHER_TYPE.wind:
                return (
                    <Flex align={"center"} gap={token.paddingXS}>
                        <SVG icon={'wind'} size={16} color={token.colorPrimary} />

                        <Text className={styles.weatherHeaderText}>
							{`${weather?.WindDirection}
								${unit === 'mph' ? weather?.WindMph : weather?.WindKph}
								${unit}`}
						</Text>
                    </Flex>
                );
            default:
                return null;
        }
    };
    const temperatureLabel = showInCelsius ? 'TempC' : 'TempF';
    
    return (
        <>
            <Flex vertical={true} gap={token.paddingLG}>
                <Flex justify={'space-between'} align={'center'} onClick={() => setShowOrganizationDrawer(true)}>
                    <Flex gap={token.paddingLG} flex={1} align={'center'}>
                        <img src={orgLogoSrc(dashboardData?.LogoUrl, dashboardData?.OrgId)} alt={dashboardData?.OrgName}
                             style={{
                                 maxHeight: '44px',
                                 maxWidth: '72px',
                                 width: '100%',
                                 height: 'auto',
                                 objectFit: 'contain'
                             }}/>

                        <Flex vertical={true}>
                            <Title level={3}> <Ellipsis direction='end' content={dashboardData?.OrgName}/></Title>
                            {(toBoolean(dashboardData?.ShowLocation) && !isNullOrEmpty(dashboardData?.OrgLocation)) && <Ellipsis direction='end' content={dashboardData?.OrgLocation} />}
                        </Flex>
                    </Flex>

                    <DownOutlined />
                </Flex>

                {weather &&
                    <Flex gap={token.padding} align={"center"}>
                        {weather[temperatureLabel] && renderWeatherData(WEATHER_TYPE.temperature, weather[temperatureLabel])}
                        {weather.RainPercentage && renderWeatherData(WEATHER_TYPE.rainPercentage, weather.RainPercentage)}
                        {windMeasurements && renderWeatherData(WEATHER_TYPE.wind, weather[windMeasurements], windMeasurements)}
                    </Flex>
                }
            </Flex>

            <DrawerBottom
                showDrawer={showOrganizationDrawer}
                closeDrawer={() => setShowOrganizationDrawer(false)}
                label={!spGuideId || equalString(spGuideId, 'courtreserve') ? "My Organization(s)" : "My Location(s)"}
                showButton={(isNullOrEmpty(spGuideId) || !toBoolean(dashboardData?.HideJoinOrganization))}
                confirmButtonText={!spGuideId ? "Add Organization" : "Add Location"}
                onConfirmButtonClick={() => {
                    //window.location.href = `/Online/MyProfile/JoinClub/${orgId}`
                }}>
                {orgList.map((orgListItem) => {
                    const innerLogoSrc = organizationLogoSrc(orgListItem.Id, orgListItem.LogoUrl);

                    return (
                        <div
                            key={orgListItem.Id}
                            onClick={() => {
                                //setSelectedRedirectOrganizationId(orgListItem.Id);
                                //orgChanged(orgListItem.Id)
                            }}
                            style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}
                            className={`fn-org-list-item-${orgListItem.Id} modal-footer-row with-bb ${orgListItem.Id === orgId ? " selected-modal-row" : ""}`}
                        >
                            <div className="modal-icon-badge-wrapper">
                                <img src={innerLogoSrc} alt={orgListItem.Name} />
                                <span>{orgListItem.Name}</span>
                            </div>

                            {/*<div className={`organization-drawer-spinner ${equalString(selectedRedirectOrganizationId, orgListItem.Id) ? '' : 'hide'}`}>*/}
                            {/*    <i className="fas fa-circle-notch rotate-animation"></i>*/}
                            {/*</div>*/}
                        </div>
                    )
                })}
            </DrawerBottom>
        </>
    );
};

export default DashboardHeader
