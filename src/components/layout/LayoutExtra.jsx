import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";
import {Button} from "antd";
import {useAntd} from "../../context/AntdProvider.jsx";
import {toLocalStorage} from "../../storage/AppStorage.jsx";
import {useState} from "react";

function LayoutExtra() {
    const { isMockData } = useApp();
    const { styles } = useStyles();
    const {setPrimaryColor, setIsDarkMode, isDarkMode} = useAntd();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    
    if (!isMockData){
        return(<></>)
    }
    
    const changeThemeMode = () => {
        setIsDarkMode(!isDarkMode);
        toLocalStorage('darkmode', !isDarkMode);
    }

    const openPrimaryColor = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    }

    const handleColorSelect = (color) => {
        setPrimaryColor(color);
        toLocalStorage('primary-color', color);
        setIsColorPickerOpen(false);
    }
    
    return (
        <div className={cx(styles.layoutExtra)}>
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