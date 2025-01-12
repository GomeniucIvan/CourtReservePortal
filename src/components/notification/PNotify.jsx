import {equalString} from "../../utils/Utils.jsx";

//used <Toaster /> from Layout.jsx
import toast from 'react-hot-toast';

export const pNotify = (description, type = 'success', duration = undefined) => {
    if (equalString(type, 'success')) {
        toast.success(description, {
            position: 'top-center',
            duration: duration,
            //className: 'safe-area-top-margin'
        });
    } else if (equalString(type, 'error')) {
        toast.error(description, {
            position: 'top-center',
            duration: duration,
            //className: 'safe-area-top-margin',
        });
    } else if (equalString(type, 'info')) {
        toast(description, {
            position: 'top-center',
            icon: 'ℹ️',
            duration: duration,
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