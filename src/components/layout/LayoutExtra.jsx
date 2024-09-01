import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Button, Image} from "antd";
import {useAntd} from "../../context/AntdProvider.jsx";
import {fromLocalStorage, toLocalStorage} from "../../storage/AppStorage.jsx";
import {useState} from "react";
import {useTranslation} from "react-i18next";

function LayoutExtra() {
    const { isMockData } = useApp();
    const { styles } = useStyles();
    const {setPrimaryColor, setIsDarkMode, isDarkMode} = useAntd();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isLanguageOpened, setIsLanguageOpened] = useState(false);
    const { i18n } = useTranslation();
    const storageLanguage = fromLocalStorage("language_seo", 'en');
    
    if (!isMockData){
        return(<></>)
    }
    
    const changeThemeMode = () => {
        setIsDarkMode(!isDarkMode);
        toLocalStorage('darkmode', !isDarkMode);
    }

    const openLanguage = () => {
        setIsLanguageOpened(!isLanguageOpened);
    }
    
    const openPrimaryColor = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    }

    const handleColorSelect = (color) => {
        setPrimaryColor(color);
        toLocalStorage('primary-color', color);
        setIsColorPickerOpen(false);
    }
    
    const changeLanguage = (selectedLanguage) => {
        i18n.changeLanguage(selectedLanguage).then(r => {
            toLocalStorage("language_seo", selectedLanguage);
            setIsLanguageOpened(false);
        });
    }
    
    return (
        <div className={cx(styles.layoutExtra)}>
            <div className={styles.languagePickerContainer}>
                <Button shape="circle" onClick={openLanguage} className={styles.primaryColor}>
                    <Image
                        preview={false}
                        style={{borderRadius: '50px'}}
                        width={24}
                        src={`/public/images/${storageLanguage}-flag.png`}
                    />
                </Button>
                {isLanguageOpened && (
                    <div className={styles.languageOptions}>
                        <Button shape="circle"
                                className={styles.colorOption}
                                onClick={() => {changeLanguage('en')}}>
                            <Image
                                preview={false}
                                style={{borderRadius: '50px'}}
                                width={24}
                                src="/public/images/en-flag.png"
                            />
                        </Button>

                        <Button shape="circle"
                                className={styles.colorOption}
                                onClick={() => {changeLanguage("ru")}}>
                            <Image
                                preview={false}
                                style={{borderRadius: '50px'}}
                                width={24}
                                src="/public/images/ru-flag.png"
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
        </div>
    )
}

export default LayoutExtra;