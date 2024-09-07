import React, {useEffect, useRef, useState} from 'react';
import {Typography} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined} from '@ant-design/icons';
import {useStyles} from "./styles.jsx";

const {Title, Text} = Typography;

const Notification = ({type, title, description, onClose}) => {
    const alertRef = useRef(null);
    const [swipeDistance, setSwipeDistance] = useState({x: 0, y: 0});
    const [startX, setStartX] = useState(0);
    const{styles} = useStyles();
    const [removing, setRemoving] = useState(false);
    const [transition, setTransition] = useState('');
    
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

    const handleTouchEnd = () => {
        const swipeThresholdX = 30; 

        if (Math.abs(swipeDistance.x) > swipeThresholdX) {
            const direction = swipeDistance.x > 0 ? 'right' : 'left';
            setTransition(`transform 0.3s ease-in-out`);
            handleRemove(direction);
        } else {
            setTransition(`initial`);
            setSwipeDistance({ x: 0 });
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
    
    const iconTypes = {
        success: <CheckCircleOutlined style={{color: '#4caf50', fontSize: '20px'}}/>,
        danger: <CloseCircleOutlined style={{color: '#f44336', fontSize: '20px'}}/>,
        info: <InfoCircleOutlined style={{color: '#2196f3', fontSize: '20px'}}/>,
        warning: <WarningOutlined style={{color: '#ff9800', fontSize: '20px'}}/>,
    };

    return (
        <div
            style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                transform: `translateX(${swipeDistance.x}px)`,
                transition: transition,
            }}
            className={styles.notification}
            ref={alertRef}
            onTouchStart={(e) => handleTouchStart(e)}
            onTouchMove={(e) => handleTouchMove(e)}
            onTouchEnd={(e) => handleTouchEnd(e)}
        >
            <div style={{marginRight: '10px'}}>{iconTypes[type]}</div>
            <div style={{flex: 1}}>
                <Title level={5} style={{margin: 0}}>{title}</Title>
                <Text>{description}</Text>
            </div>
            <button onClick={onClose}
                    style={{marginLeft: 'auto', cursor: 'pointer', border: 'none', background: 'none'}}>×
            </button>
        </div>
    );
};

export default Notification;