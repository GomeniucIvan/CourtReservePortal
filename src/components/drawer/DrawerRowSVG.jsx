import React from 'react';
import {toBoolean} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useApp} from "@/context/AppProvider.jsx";

const DrawerRowSVG = ({checked}) => {
    const {token} = useApp();
    
    return (
        <>
            {toBoolean(checked) &&
                <SVG icon={'checked-radio'} color={token.colorPrimary} />
            }

            {!toBoolean(checked) &&
                <SVG icon={'circle'} color={token.colorSecondary} />
            }
        </>
    )
}

export default DrawerRowSVG