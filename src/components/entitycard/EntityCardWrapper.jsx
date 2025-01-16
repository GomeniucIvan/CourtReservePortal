﻿import {Flex, Skeleton, theme, Typography} from "antd";
import {useNavigate} from "react-router-dom";
const { Title } = Typography;
const { useToken } = theme;
import {useStyles} from "./styles.jsx";
import { cx } from 'antd-style';
import { useTranslation } from 'react-i18next';
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";

const EntityCardWrapper = ({children, title, onClick, addPadding, isFetching}) => {
    const { token } = useToken();
    const navigate = useNavigate();
    const { styles } = useStyles();
    const { t } = useTranslation('');
    
    return (
        <Flex vertical={true}>
            {isFetching &&
                <PaddingBlock>
                    <Flex align={'center'} justify={'space-between'} className={cx(styles.cardHeader)}>
                        <Skeleton.Button active/>

                        <Skeleton.Button active/>
                    </Flex>
                </PaddingBlock>
            }

            {!isFetching &&
                <PaddingBlock>
                    <Flex align={'center'} justify={'space-between'} className={cx(styles.cardHeader)}>
                        <Title level={1}>{title}</Title>

                        <Title level={3} style={{color: token.colorLink}} onClick={onClick}>
                            {t('seeAll')}
                        </Title>
                    </Flex>
                </PaddingBlock>
            }

            {children}
        </Flex>
    )
}

export default EntityCardWrapper;
