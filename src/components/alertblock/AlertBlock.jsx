import {Button, Flex, Typography} from "antd";
import {useState} from "react";
import SVG from "@/components/svg/SVG.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
const{Title, Text} = Typography;
import {useStyles} from "./styles.jsx";
import { cx } from 'antd-style';

function AlertBlock({type = 'danger', title, description, onButtonClick, buttonText, removePadding}) {
    const [isLoading, setIsLoading] = useState(false);
    const {token} = useApp();
    const {styles} = useStyles();
    
    const config = {
        warning: {
            icon: <SVG icon={'alert-custom'} size={28} preventFill={true} />,
            borderColor: '#fcd47e'
        },
        info: {
            icon: <SVG icon={'alert-info'} size={28} preventFill={true} />,
            borderColor: '#8ca1f5'
        },
        danger: {
            icon: <SVG icon={'alert-triangle'} size={28} color={token.colorError} />,
            borderColor: '#e68e8e'
        },
        error: {
            icon: <SVG icon={'alert-triangle'} size={28} color={token.colorError} />,
            borderColor: '#e68e8e'
        },
    };

    const currentConfig = config[type] || config.warning;

    let blockClassName = styles.dangerBlock;
    let buttonClassName = styles.dangerButton;
    
    if (equalString(type, 'warning')){
        blockClassName =  styles.warningBlock;
        buttonClassName = styles.warningButton;
    } else if (equalString(type, 'info')){
        blockClassName =  styles.infoBlock;
        buttonClassName = styles.infoButton;
    }
    
    return (
        <Flex className={cx(styles.block, blockClassName, toBoolean(removePadding) && styles.removePaddingBlock)} style={{borderLeft: `5px solid ${config[type]?.borderColor}`}}>
           <Flex justify={'space-between'} align={'center'} flex={1} style={{paddingRight: token.padding}}>
               <Flex gap={token.paddingLG} style={{paddingLeft: token.padding, marginTop: '12px', marginBottom: '12px'}} flex={1}>
                   {currentConfig.icon}
                   <Flex vertical={true} flex={1}>
                       <Title level={3}>{title}</Title>
                       <Text className={token.colorSecondary}>{description}</Text>
                   </Flex>
                   {!isNullOrEmpty(buttonText) &&
                       <Button htmlType="button"
                               size="small"
                               className={cx(styles.button, buttonClassName)}
                               onClick={onButtonClick}
                               loading={isLoading}
                       >
                           {buttonText}
                       </Button>
                   }
               </Flex>
           </Flex>
        </Flex>
    );
}

export default AlertBlock;