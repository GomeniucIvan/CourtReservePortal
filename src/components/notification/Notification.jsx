import React, {useEffect, useRef, useState} from 'react';
import {Flex, theme, Typography} from 'antd';
import {CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled} from '@ant-design/icons';
import {useStyles} from "./styles.jsx";
import {equalString, isNullOrEmpty} from "../../utils/Utils.jsx";

const {useToken} = theme;
const {Title, Text} = Typography;

const Notification = ({type, title, description, onClose, duration}) => {
    const alertRef = useRef(null);
    const [swipeDistance, setSwipeDistance] = useState({x: 0, y: 0});
    const [startX, setStartX] = useState(0);
    const {styles} = useStyles();
    const [removing, setRemoving] = useState(false);
    const [transition, setTransition] = useState('');

    //not use from useApp it is not accessible
    const {token} = useToken();

    const handleTouchStart = (e) => {
        setTransition(`none`);
        setStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        if (removing) return;

        setTransition(`none`);

        const currentX = e.touches[0].clientX;
        const distanceX = currentX - startX;

        setSwipeDistance({
            x: distanceX,
        });
    };

    useEffect(() => {
        const hideNotificationByDuration = () => {
            const direction = 'left';
            setTransition(`transform 0.3s ease-in-out`);
            handleRemove(direction);
        }

        setTimeout(hideNotificationByDuration, duration * 1000)
    }, [])

    const handleTouchEnd = () => {
        const swipeThresholdX = 30;

        if (Math.abs(swipeDistance.x) > swipeThresholdX) {
            const direction = swipeDistance.x > 0 ? 'right' : 'left';
            setTransition(`transform 0.3s ease-in-out`);
            handleRemove(direction);
        } else {
            setTransition(`initial`);
            setSwipeDistance({x: 0});
        }
    };

    const handleRemove = (direction) => {
        setRemoving(true);

        setSwipeDistance({
            x: direction === 'right' ? window.innerWidth : -window.innerWidth,
        });

        setTimeout(onClose, 5000);
    };

    useEffect(() => {
        if (removing) {
            setTransition('');
        }
    }, [removing]);

    let colorToFill = token.colorSuccess;

    if (equalString(type, 'danger')) {
        colorToFill = token.colorError;
    } else if (equalString(type, 'info')) {
        colorToFill = token.colorInfo;
    } else if (equalString(type, 'warning')) {
        colorToFill = token.colorWarning;
    }

    const iconTypes = {
        success: <CheckCircleFilled style={{color: colorToFill, fontSize: '22px'}}/>,
        danger: <CloseCircleFilled style={{color: colorToFill, fontSize: '22px'}}/>,
        info: <InfoCircleFilled style={{color: colorToFill, fontSize: '22px'}}/>,
        warning: <WarningFilled style={{color: colorToFill, fontSize: '22px'}}/>,
    };

    if (isNullOrEmpty(title) && isNullOrEmpty(description)) {
        return (<></>);
    }

    return (
        <div
            style={{
                transform: `translateX(${swipeDistance.x}px)`,
                transition: transition,
            }}
            className={styles.notification}
            ref={alertRef}
            onTouchStart={(e) => handleTouchStart(e)}
            onTouchMove={(e) => handleTouchMove(e)}
            onTouchEnd={(e) => handleTouchEnd(e)}
        >
            <Flex gap={token.padding / 2} style={{padding: `${token.padding}px`}}>
                <div className={styles.leftBorder} style={{backgroundColor: colorToFill}}></div>
                <Flex justify={'start'} align={'start'} style={{paddingTop: (!isNullOrEmpty(title) ? '5px' : '0px')}}
                      className={'icon'}>{iconTypes[type]}</Flex>
                <div style={{flex: 1}}>
                    {!isNullOrEmpty(title) &&
                        <>
                            <Title level={4} style={{margin: 0}}>{title}</Title>
                            <Text>{description}</Text>
                        </>
                    }
                    {isNullOrEmpty(title) &&
                        <>
                            <Title level={5} style={{margin: 0}}>{description}</Title>
                        </>
                    }
                </div>
            </Flex>
        </div>
    );
};

export default Notification;