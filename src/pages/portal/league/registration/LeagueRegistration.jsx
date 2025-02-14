import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";

function LeagueRegistration() {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {
        setIsFooterVisible,
        setDynamicPages,
        globalStyles,
        token,
        shouldFetch,
        setFooterContent,
        resetFetch
    } = useApp();

    let {lsid} = useParams();

    const loadData = async () => {
        setIsFetching(true);

        let response = '';
        if (toBoolean(response?.IsValid)){
            setSessionDetails(response?.Data);
        } else {
            if (isNullOrEmpty(response?.RestrictionData)){
                let respData = response.RestrictionData;

            } else {
                displayMessageModal({
                    title: 'Error',
                    html: (onClose) => `${response?.Message}.`,
                    type: "error",
                    buttonType: modalButtonType.DEFAULT_CLOSE,
                    onClose: () => {

                    },
                })
            }
        }

        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        setFooterContent('');
    }, []);
    
    return (
        <div>
            LeagueRegistration
        </div>
    )
}

export default LeagueRegistration
