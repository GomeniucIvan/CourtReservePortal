import {Divider, Flex, Typography} from "antd";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import React, {useEffect, useState} from "react";
import {useAuth} from "@/context/AuthProvider.jsx";
import {equalString, isNullOrEmpty, organizationLogoSrc, setCookie, toBoolean} from "@/utils/Utils.jsx";
import {useStyles} from ".././styles.jsx";
import {cx} from 'antd-style';
import {useApp} from "@/context/AppProvider.jsx";
import {Ellipsis} from "antd-mobile";
import apiService, {setRequestData} from "@/api/api.jsx";
import {imageSrc} from "@/utils/ImageUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import portalService from "@/api/portal.jsx";
import {useNavigate} from "react-router-dom";
import {useAntd} from "@/context/AntdProvider.jsx";
import {toAuthLocalStorage} from "@/storage/AppStorage.jsx";
import {setClientUiCulture} from "@/utils/DateUtils.jsx";
import {isValidJson} from "@/utils/ListUtils.jsx";
const {Text, Title} = Typography;

const DashboardHeader = ({ dashboardData, organizationList, isReloadFetching }) => {
    const [showOrganizationDrawer, setShowOrganizationDrawer] = useState(false);
    const [weather, setWeather] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [showInCelsius, setShowInCelsius] = useState(true);
    const [windMeasurements, setWindMeasurements] = useState('');
    const { styles } = useStyles();
    const {token, globalStyles, setCustomHeader} = useApp();
    const {spGuideId, orgId, authData, setAuthData,setOrgId } = useAuth();
    const [loadingOrganizationId, setLoadingOrganizationId] = useState(null);
    const navigate = useNavigate();
    const {setPrimaryColor} = useAntd();
    
    let cookieWeatherKey = `Dashboard_Weather_${orgId}`;
    
    const loadData = async () => {
        let currentDateTimeString = dashboardData?.currentOrgDateTimeString;
        let response = await apiService.get(`/api/dashboard/weather?id=${orgId}&currentDateTime=${currentDateTimeString}`);

        if (toBoolean(response?.IsValid)) {
            let data = response.Data;
            setCookie(cookieWeatherKey, JSON.stringify(data), 30);
            
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
        
        if (isValidJson(weatherCookieData)) {
            let weatherData = JSON.parse(weatherCookieData);

            if (toBoolean(weatherData?.displayWeather)) {
                setWeather(weatherData.weatherInfo);
            }
            setShowInCelsius(weatherData?.showInCelsius);
            setWindMeasurements(weatherData?.windMeasurements);
            setIsFetching(false);
        }
    }, [])
    
    useEffect(() => {
        if (!isNullOrEmpty(dashboardData) && !isReloadFetching){
            loadData();
        }
    }, [dashboardData]);
    
    useEffect(() => {
        setCustomHeader(<PaddingBlock>
            <div className={cx(styles.headerDashboardBlock)}>
                <Flex justify={'space-between'} align={'center'} onClick={() => setShowOrganizationDrawer(true)} flex={1}>
                    <Flex gap={token.paddingLG} flex={1} align={'center'}>
                        <img src={imageSrc(authData?.LogoUrl, authData?.OrgId)} alt={authData?.OrgName}
                             style={{
                                 maxHeight: '40px',
                                 maxWidth: '72px',
                                 //width: '100%',
                                 height: 'auto',
                                 objectFit: 'contain'
                             }}/>

                        <Flex vertical={true}>
                            <Title level={3}> <Ellipsis direction='end' content={authData?.OrgName}/></Title>
                            {(toBoolean(authData?.ShowLocation) && !isNullOrEmpty(authData?.OrgLocation)) &&
                                <Ellipsis direction='end' content={'111'}/>}
                        </Flex>
                    </Flex>

                    <SVG icon={'chevron-down-regular'} size={14}/>
                </Flex>
            </div>
        </PaddingBlock>);

    }, [authData])

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
                        <SVG icon={'cloud-showers'} size={16} color={token.colorPrimary}/>
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
    
    const loadOrganizationData = async (requestData) => {

        let memberResponseData = requestData.OrganizationData;
        
        if (!isNullOrEmpty(memberResponseData.RequestData)){
            setRequestData(memberResponseData.RequestData)
        }

        if (!isNullOrEmpty(memberResponseData.DashboardButtonBgColor)) {
            setPrimaryColor(memberResponseData.DashboardButtonBgColor);
        }
        
        //prevent set auth data it will throw exception because it is used by hook 
        //setAuthData(memberResponseData);
        
        toAuthLocalStorage('memberData', memberResponseData);
        setOrgId(memberResponseData.OrgId);
        setClientUiCulture(memberResponseData.UiCulture);
        
        //setAuthorizationData will not work because dashboard already check this hook state
        //await setAuthorizationData(requestData.OrganizationData);
        
        //navigate will not reload required information like request data
        //navigate(HomeRouteNames.INDEX);
        
        window.location.reload();
    } 
    
    const changeViewingOrganization = async (selectedOrg) => {
        setLoadingOrganizationId(selectedOrg.Id);

        let requestData = await portalService.requestData(navigate, selectedOrg.Id);
        if (toBoolean(requestData?.IsValid)) {
            setTimeout(function(){
                loadOrganizationData(requestData)
            }, 1000)
        }
    }
    
    return (
        <>
            {!isReloadFetching &&
                <Flex vertical={true} gap={token.paddingLG}>
                    {weather &&
                        <Flex gap={token.padding} align={"center"}>
                            {weather[temperatureLabel] && renderWeatherData(WEATHER_TYPE.temperature, weather[temperatureLabel])}
                            {weather.RainPercentage && renderWeatherData(WEATHER_TYPE.rainPercentage, weather.RainPercentage)}
                            {windMeasurements && renderWeatherData(WEATHER_TYPE.wind, weather[windMeasurements], windMeasurements)}
                        </Flex>
                    }
                </Flex>
            }

            <DrawerBottom
                showDrawer={showOrganizationDrawer || !isNullOrEmpty(loadingOrganizationId)}
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
                                      style={{opacity : `${isNullOrEmpty(loadingOrganizationId) ? 1 : 0.8}`}}
                                      onClick={() => {
                                          if (isNullOrEmpty(loadingOrganizationId)) {
                                              changeViewingOrganization(orgListItem)
                                          } else {
                                             //already change
                                          }
                                      }}>
                                    <Flex justify={'space-between'} align={'center'} flex={1}>
                                        <Flex gap={token.padding} align={'center'}>
                                            <img style={{maxHeight: '40px', height: '100%', maxWidth: '100px'}}
                                                 src={innerLogoSrc} alt={orgListItem.Name}/>

                                            <Text style={{fontSize: `${token.fontSizeLG}px`}}>
                                                <Ellipsis direction='end' rows={1} content={orgListItem.Name}/>
                                            </Text>
                                        </Flex>

                                        {equalString(loadingOrganizationId, orgListItem.Id) &&
                                            <div className={styles.rotateNotch}>
                                                <SVG icon={'circle-notch-regular'} size={18}  />
                                            </div>
                                        }
                                    </Flex>
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
