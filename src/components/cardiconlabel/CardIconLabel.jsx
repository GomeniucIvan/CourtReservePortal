import {useStyles} from "./styles.jsx";
import {Flex, Typography} from "antd";

const {Text} = Typography;
import SVG from "../svg/SVG.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {isNullOrEmpty} from "@/utils/Utils.jsx";

function CardIconLabel({description, icon, iconColor, size, preventFill = false, preventStroke = true, gap = null, textColor = null}) {
    const {globalStyles, token} = useApp();
    const {styles} = useStyles();
    const colorToFill = iconColor || token.colorPrimary;

    return (
        <Flex gap={isNullOrEmpty(gap) ? token.Custom.cardIconPadding : gap} align={'center'} className={styles.flexRow}>
            <div className={globalStyles.cardIconBlock}>
                <Flex justify={'center'}>
                    <SVG icon={icon}
                         color={colorToFill}
                         size={size}
                         preventFill={preventFill}
                         preventStroke={preventStroke}/>
                </Flex>
            </div>

            <Text style={{color: textColor}}>
                {description}
            </Text>
        </Flex>
    )
}

export default CardIconLabel
