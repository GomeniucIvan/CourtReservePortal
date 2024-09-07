import React from 'react';
import { createRoot } from 'react-dom/client';
import Notification from './Notification';
import {isNullOrEmpty} from "../../utils/Utils.jsx";

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
    if (isNullOrEmpty(duration)){
        switch (type) {
            case 'danger':
                duration = 15;
                break;
            case 'success':
                duration = 8;
                break;
            case 'info':
                duration = 8;
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
            onClose={removeNotification}
        />
    );

    setTimeout(removeNotification, duration * 1000);
};