import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import {cx} from "antd-style";

function LayoutExtra() {
    const { isMockData } = useApp();
    const { styles } = useStyles();
    
    if (!isMockData){
        return(<></>)
    }
    
    return (
        <div className={cx(styles.layoutExtra)}>
test
        </div>
    )
}

export default LayoutExtra;