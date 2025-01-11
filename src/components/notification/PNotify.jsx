import {equalString} from "../../utils/Utils.jsx";

//used <Toaster /> from Layout.jsx
import toast from 'react-hot-toast';

export const pNotify = (description, type = 'success', duration = '') => {
    if (equalString(type, 'success')) {
        toast.success(description, {
            position: 'top-center',
            //className: 'safe-area-top-margin'
        });
    } else if (equalString(type, 'error')) {
        toast.error(description, {
            position: 'top-center',
            //className: 'safe-area-top-margin',
        });
    } else if (equalString(type, 'info')) {
        toast(description, {
            position: 'top-center',
            icon: 'ℹ️',
            //className: 'safe-area-top-margin'
        });
    }
};

export const pNotifyLoading = (t) => {
    toast.promise('', {
        position: 'top-center',
        loading: 'Loading...',
        error: () => {},
        success: () => {},
        //className: 'safe-area-top'
    });
};

export const pNotifyClose = () => {
    toast.dismiss();
}