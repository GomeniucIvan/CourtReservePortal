import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import
import Notification from './Notification';

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

export const showNotification = (type, title, description, duration) => {
    const container = createNotificationContainer();

    duration = 80;
    
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

export const pNotify = (type) => {
    let duration = 3;
    let title = 'Notification';
    let description = 'This is a notification.';

    switch (type) {
        case 'danger':
            duration = 5;
            title = 'Error';
            description = 'There was an error processing your request.';
            break;
        case 'success':
            duration = 3;
            title = 'Success';
            description = 'Your action was successful!';
            break;
        case 'info':
            duration = 4;
            title = 'Information';
            description = 'Here is some important information.';
            break;
        default:
            break;
    }

    showNotification(type, title, description, duration);
};