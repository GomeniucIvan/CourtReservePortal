import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Button, Image} from "antd";
import {useAntd} from "../../context/AntdProvider.jsx";
import {fromLocalStorage, toLocalStorage} from "../../storage/AppStorage.jsx";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import SVG from "@/components/svg/SVG.jsx";
import {equalString, isNullOrEmpty, setCookie} from "@/utils/Utils.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {getCookie} from "@/utils/CookieUtils.jsx";
import portalService from "@/api/portal.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import toast from "react-hot-toast";
import appService from "@/api/app.jsx";
import {AuthRouteNames} from "@/routes/AuthRoutes.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import {DevRouteNames} from "@/routes/DevRoutes.jsx";
import DevConsole from "@/pages/dev/DevConsole.jsx";

function LayoutExtra() {
    const { isMockData } = useApp();
    const { orgId } = useAuth();
    const location = useLocation();
    const { styles } = useStyles();
    const {setPrimaryColor, setIsDarkMode, isDarkMode} = useAntd();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isLanguageOpened, setIsLanguageOpened] = useState(false);
    const [isDashboardTypeOpened, setIsDashboardTypeOpened] = useState(false);
    const [selectedDashboardType, setSelectedDashboardType] = useState('empty-set-sharp-regular');
    const [isPrimaryPageTypeOpened, setIsPrimaryPageTypeOpened] = useState(false);
    const [showConsole, setShowConsole] = useState(false);
    const [selectedPrimaryPageType, setSelectedPrimaryPageType] = useState('empty-set-sharp-regular');
    const isDebugMode = getConfigValue('IsDebugMode');
    
    //based on route
    const [showDashboardType, setShowDashboardType] = useState(false);
    const [showPrimaryPageType, setShowPrimaryPageType] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setShowDashboardType(equalString(location.pathname, HomeRouteNames.INDEX));
        setShowPrimaryPageType(equalString(location.pathname, AuthRouteNames.LOGIN));

    }, [location.pathname]);

    const updateDashboardDType = (type) => {
        let currentDashboardTypeIcon = 'empty-set-sharp-regular';

        if (equalString(type, '2')) {
            currentDashboardTypeIcon = 'list-regular';
        } else if (equalString(type, '3')) {
            currentDashboardTypeIcon = 'grid-2-light';
        } else if (equalString(type, '4')) {
            currentDashboardTypeIcon = 'grid-sharp-light';
        }

        setSelectedDashboardType(currentDashboardTypeIcon);
    }

    useEffect(() => {
        let selected = getCookie("dashboard_navigationType");
        updateDashboardDType(selected);
    }, []);

    const { i18n } = useTranslation();
    const storageLanguage = fromLocalStorage("language_seo", 'en');

    if (!isMockData && 1 == 2){
        return(<></>)
    }

    const changeThemeMode = () => {
        setIsDarkMode(!isDarkMode);
    }

    const openLanguage = () => {
        setIsLanguageOpened(!isLanguageOpened);
    }

    const openPrimaryColor = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    }

    const handleColorSelect = (color) => {
        setCookie('primary-color', color, 30);
        setPrimaryColor(color);
        setIsColorPickerOpen(false);
    }

    const changeLanguage = (selectedLanguage) => {
        i18n.changeLanguage(selectedLanguage).then(r => {
            toLocalStorage("language_seo", selectedLanguage);
            setIsLanguageOpened(false);
        });
    }

    const updateDashboardType = async (type) => {
        setCookie("dashboard_navigationType", type, 30);
        setIsDashboardTypeOpened(false);
        updateDashboardDType(type);

        if (!isNullOrEmpty(orgId)) {
            const response = await toast.promise(
                portalService.requestData(navigate, orgId),
                {
                    position: 'top-center',
                    loading: 'Loading...',
                    //className: 'safe-area-top-margin',
                    error: () => {},
                    success: () => {}
                }
            );

            navigate(HomeRouteNames.INDEX);
        }
    }

    return (
        <div className={cx(styles.layoutExtra)}>
            <div className={styles.languagePickerContainer}>
                <Button shape="circle" onClick={openLanguage} className={styles.primaryColor}>
                    <Image
                        preview={false}
                        style={{borderRadius: '50px'}}
                        width={24}
                        src={`/images/${storageLanguage}-flag.png`}
                    />
                </Button>
                {isLanguageOpened && (
                    <div className={styles.languageOptions}>
                        <Button shape="circle"
                                className={styles.colorOption}
                                onClick={() => {
                                    changeLanguage('en')
                                }}>
                            <Image
                                preview={false}
                                style={{borderRadius: '50px'}}
                                width={24}
                                src="/images/en-flag.png"
                            />
                        </Button>

                        <Button shape="circle"
                                className={styles.colorOption}
                                onClick={() => {
                                    changeLanguage("ru")
                                }}>
                            <Image
                                preview={false}
                                style={{borderRadius: '50px'}}
                                width={24}
                                src="/images/ru-flag.png"
                            />
                        </Button>
                    </div>
                )}
            </div>

            <div><Button shape="circle" onClick={changeThemeMode} className={styles.themeButton}/></div>

            <div className={styles.colorPickerContainer}>
                <Button shape="circle" onClick={openPrimaryColor} className={styles.primaryColor}/>
                {isColorPickerOpen && (
                    <div className={styles.colorOptions}>
                        <Button
                            shape="circle"
                            className={styles.colorOption}
                            style={{backgroundColor: "#873030"}}
                            onClick={() => handleColorSelect("#873030")}
                        />
                        <Button
                            shape="circle"
                            className={styles.colorOption}
                            style={{backgroundColor: "#61ca31"}}
                            onClick={() => handleColorSelect("#61ca31")}
                        />
                        <Button
                            shape="circle"
                            className={styles.colorOption}
                            style={{backgroundColor: "#3357FF"}}
                            onClick={() => handleColorSelect("#3357FF")}
                        />
                        <Button
                            shape="circle"
                            className={styles.colorOption}
                            style={{backgroundColor: "#FF33A8"}}
                            onClick={() => handleColorSelect("#FF33A8")}
                        />
                        <Button
                            shape="circle"
                            className={styles.colorOption}
                            style={{backgroundColor: "#FF8C33"}}
                            onClick={() => handleColorSelect("#FF8C33")}
                        />
                    </div>
                )}
            </div>
            
            {showDashboardType &&
                <div className={styles.dashboardTypeContainer}>
                    <Button shape="circle" onClick={() => {
                        setIsDashboardTypeOpened(!isDashboardTypeOpened)
                    }}>
                        <SVG icon={selectedDashboardType} size={16}/>
                    </Button>
                    {isDashboardTypeOpened && (
                        <div className={styles.dashboardTypes}>
                            <Button shape="circle"
                                    className={styles.colorOption}
                                    onClick={() => {
                                        updateDashboardType(2);
                                    }}>
                                <SVG icon={'list-regular'} size={16}/>
                            </Button>

                            <Button shape="circle"
                                    className={styles.colorOption}
                                    onClick={() => {
                                        updateDashboardType(3);
                                    }}>
                                <SVG icon={'grid-2-light'} size={16}/>
                            </Button>

                            <Button shape="circle"
                                    className={styles.colorOption}
                                    onClick={() => {
                                        updateDashboardType(4);
                                    }}>
                                <SVG icon={'grid-sharp-light'} size={16}/>
                            </Button>
                        </div>
                    )}
                </div>
            }

            {showPrimaryPageType &&
                <div className={styles.dashboardTypeContainer}>
                    <Button shape="circle" onClick={() => {
                        setIsPrimaryPageTypeOpened(!isPrimaryPageTypeOpened)
                    }}>
                        <SVG icon={selectedPrimaryPageType} size={16}/>
                    </Button>
                    {isPrimaryPageTypeOpened && (
                        <div className={styles.dashboardTypes}>
                            <Button shape="circle"
                                    className={styles.colorOption}
                                    onClick={() => {
                                        setSelectedPrimaryPageType(1);
                                    }}>
                                <SVG icon={'circle-sharp-solid'} size={16}/>
                            </Button>

                            <Button shape="circle"
                                    className={styles.colorOption}
                                    onClick={() => {
                                        setSelectedPrimaryPageType(2);
                                    }}>
                                <SVG icon={'event-courts'} size={16}/>
                            </Button>
                        </div>
                    )}
                </div>
            }

            {isDebugMode &&
                <>
                    <div className={styles.dashboardTypeContainer}>
                        <Button shape="circle" onClick={() => {
                            navigate(DevRouteNames.DEV_ALL);
                        }}>
                            <SVG icon={'pincode'} size={16}/>
                        </Button>

                    </div>

                    <div className={styles.dashboardTypeContainer}>
                        <Button shape="circle" onClick={() => {
                            setShowConsole(!showConsole);
                        }}>
                            <SVG icon={'message'} size={16}/>
                        </Button>
                        <DevConsole show={showConsole}/>
                    </div>
                </>
            }
        </div>
    )
}

export default LayoutExtra;