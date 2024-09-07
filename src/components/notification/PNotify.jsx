import React from 'react';
import { createRoot } from 'react-dom/client';
import Notification from './Notification';
import {equalString, isNullOrEmpty} from "../../utils/Utils.jsx";

const createNotificationContainer = () => {
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0px';
        container.style.zIndex = '9999';
        container.style.width = '100%';
        document.body.appendChild(container);
    }
    return container;
};

export const pNotify = (title, description, type = 'success', duration) => {
    if (equalString(type, 'error')){
        type = 'danger';
    }
    
    if (isNullOrEmpty(duration)){
        switch (type) {
            case 'danger':
                duration = 10;
                break;
            case 'success':
                duration = 7;
                break;
            case 'info':
                duration = 7;
                break;
            case 'warning':
                duration = 10;
                break;
            default:
                break;
        } 
    }

    const container = createNotificationContainer();

    const notificationWrapper = document.createElement('div');
    container.appendChild(notificationWrapper);

    const removeNotification = () => {
        root.unmount();

        setTimeout(function(){
            container.remove();
        }, 100);
    };

    const root = createRoot(notificationWrapper);
    root.render(
        <Notification
            type={type}
            title={title}
            description={description}
            duration={duration}
            onClose={removeNotification}
        />
    );

    setTimeout(removeNotification, (duration * 1000) + 1000); //animation hide 1000
};