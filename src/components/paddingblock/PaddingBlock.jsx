import {Flex, Typography} from "antd";
const { Text } = Typography;
import SVG from "../svg/SVG.jsx";
import {useApp} from "../../context/AppProvider.jsx";

function CardIconLabel({description, icon}) {
    const {globalStyles, token} = useApp();
    const { styles } = useStyles();
    
    return (
        <Flex gap={token.Custom.cardIconPadding} align={'center'} className={styles.flexRow}>
            <div className={globalStyles.cardIconBlock}>
                <Flex justify={'center'}>
                    <SVG icon={icon}/>
                </Flex>
            </div>
            
            <Text>
                {description}
            </Text>
        </Flex>
    )
}

export default CardIconLabel
