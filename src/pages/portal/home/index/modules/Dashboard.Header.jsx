import {Divider, Flex, Typography} from "antd";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, isNullOrEmpty, organizationLogoSrc, setCookie, toBoolean} from "@/utils/Utils.jsx";
import {useStyles} from ".././styles.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import apiService from "@/api/api.jsx";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {DownOutlined} from "@ant-design/icons";
import {getCookie} from "@/utils/CookieUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Text, Title} = Typography;

const DashboardHeader = ({ dashboardData, organizationList }) => {
    const [showOrganizationDrawer, setShowOrganizationDrawer] = useState(false);
    const [weather, setWeather] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [showInCelsius, setShowInCelsius] = useState(true);
    const [windMeasurements, setWindMeasurements] = useState('');
    const { styles } = useStyles();
    const {token, globalStyles} = useApp();
    const {spGuideId, orgId, authData} = useAuth();

    let cookieWeatherKey = `Dashboard_Weather_${orgId}`;
    
    const loadData = async () => {
        let currentDateTimeString = dashboardData?.currentDateTimeString;
        let response = await apiService.get(`/api/dashboard/weather?id=${orgId}&currentDateTime=${currentDateTimeString}`);

        if (toBoolean(response?.IsValid)) {
            let data = response.Data;
            setCookie(cookieWeatherKey, data, 30);
            
            if (toBoolean(data?.displayWeather)) {
                setWeather(data.weatherInfo);  
            }
            setShowInCelsius(data?.showInCelsius);
            setWindMeasurements(data?.windMeasurements);
        }

        setIsFetching(false);
    }
    
    useEffect(() => {
        const weatherCookieData = getCookie(cookieWeatherKey);
        if (!isNullOrEmpty(weatherCookieData)) {
            if (toBoolean(weatherCookieData?.displayWeather)) {
                setWeather(weatherCookieData.weatherInfo);
            }
            setShowInCelsius(weatherCookieData?.showInCelsius);
            setWindMeasurements(weatherCookieData?.windMeasurements);
            setIsFetching(false);
        }
    }, [])

    useEffect(() => {
        console.log(authData)
        
    }, [authData]);
    
    useEffect(() => {
        if (!isNullOrEmpty(dashboardData)){
            loadData();
        }
    }, [dashboardData]);
    
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
                        <img src={imageSrc(authData?.LogoUrl, authData?.OrgId)} alt={authData?.OrgName}
                             style={{
                                 maxHeight: '44px',
                                 maxWidth: '72px',
                                 width: '100%',
                                 height: 'auto',
                                 objectFit: 'contain'
                             }}/>

                        <Flex vertical={true}>
                            <Title level={3}> <Ellipsis direction='end' content={authData?.OrgName}/></Title>
                            {(toBoolean(authData?.ShowLocation) && !isNullOrEmpty(authData?.OrgLocation)) && <Ellipsis direction='end' content={authData?.OrgLocation} />}
                        </Flex>
                    </Flex>

                    <SVG icon={'chevron-down-regular'} size={14} />
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
                showButton={(isNullOrEmpty(spGuideId) || !toBoolean(authData?.HideJoinOrganization))}
                confirmButtonText={!spGuideId ? "Add Organization" : "Add Location"}
                onConfirmButtonClick={() => {
                    //window.location.href = `/Online/MyProfile/JoinClub/${orgId}`
                }}>
                {organizationList.map((orgListItem, index) => {
                    const innerLogoSrc = organizationLogoSrc(orgListItem.Id, orgListItem.LogoUrl);
                    let isLastItem = index === innerLogoSrc.length - 1;
                    
                    return (
                        <div key={orgListItem.Id}>
                            <PaddingBlock>
                                <Flex className={globalStyles.drawerRow}
                                      gap={token.padding} 
                                      onClick={() => {}}>
                                    <img style={{maxHeight: '40px', height: '100%', maxWidth: '100px'}}
                                         src={innerLogoSrc} alt={orgListItem.Name}/>

                                    <Text style={{fontSize: `${token.fontSizeLG}px`}}>
                                        <Ellipsis direction='end' rows={1} content={orgListItem.Name}/>
                                    </Text>
                                </Flex>
                            </PaddingBlock>
                            {!isLastItem &&
                                <Divider className={globalStyles.noMargin}/>
                            }
                        </div>
                    )
                })}
            </DrawerBottom>
        </>
    );
};

export default DashboardHeader
