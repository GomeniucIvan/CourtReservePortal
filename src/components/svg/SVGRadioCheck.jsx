import React from 'react';
import {toBoolean} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {useApp} from "@/context/AppProvider.jsx";

const SVGRadioCheck = ({checked, multi}) => {
    const {token} = useApp();
    
    if (toBoolean(multi)) {
       return (
           <>
               {toBoolean(checked) &&
                   <SVG icon={'square-check-solid'} color={token.colorPrimary} />
               }

               {!toBoolean(checked) &&
                   <SVG icon={'square-light'} color={token.colorSecondary} />
               }
           </>
       )
    }
    
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

export default SVGRadioCheck