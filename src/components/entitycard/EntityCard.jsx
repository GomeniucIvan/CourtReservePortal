import {Flex, Skeleton, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {toBoolean} from "../../utils/Utils.jsx";
const { Title } = Typography;
const { useToken } = theme;
import {useStyles} from "./EntityCard.styles.jsx";
import { cx } from 'antd-style';
import { useTranslation } from 'react-i18next';

const EntityCard = ({children, title, link, addPadding, isFetching}) => {
    const { token } = useToken();
    const navigate = useNavigate();
    const { styles } = useStyles();
    const { t } = useTranslation('');
    
    return (
        <>
            {isFetching &&
                <div className={cx(styles.header, toBoolean(addPadding) && styles.headerPadding)} style={{paddingBottom: '2px'}}>
                    <Flex justify={'space-between'} style={{width : '100%'}}>
                        <Skeleton.Button active/>
                        <Skeleton.Button active />
                    </Flex>
                </div>
            }

            {!isFetching &&
                <div className={cx(styles.header, toBoolean(addPadding) && styles.headerPadding)}>
                    <Title level={1}>{title}</Title>

                    <Title level={3} style={{color: token.colorLink}} onClick={() => navigate(link)}>
                        {t('seeAll')}
                    </Title>
                </div>
            }

            <div className={toBoolean(addPadding) ? styles.cardPadding : null}>
                {children}
            </div>
        </>
    )
}

export default EntityCard;
