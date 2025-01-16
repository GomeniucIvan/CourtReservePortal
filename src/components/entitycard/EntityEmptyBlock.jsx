import {Badge, Flex, Tag, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
const { useToken } = theme;
import { cx } from 'antd-style';
import { useTranslation } from 'react-i18next';
import {Card, Ellipsis} from "antd-mobile";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";
import useCombinedStyles from "@/hooks/useCombinedStyles.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Text} = Typography;

const EntityEmptyBlock = ({text, height}) => {
    const {globalStyles} = useApp();
    const { styles } = useStyles();

    return (
        <PaddingBlock>
            <Card className={cx(globalStyles.card)}>
                <Flex align={'center'} justify={'center'} className={styles.emptyFlexBlock} style={{height: `${height}px`}}>
                    <Text className={styles.emptyText}>{text}</Text>
                </Flex>
            </Card>
        </PaddingBlock>
    )
}

export default EntityEmptyBlock;
