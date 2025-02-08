import React, {useEffect, useRef, useState} from "react";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {isNullOrEmpty} from "@/utils/Utils.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import {Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";

const {Title} = Typography

function PackagePartialDetails({pack}) {

    const {
        globalStyles,
    } = useApp();
    
    return (
       <>
           <Title level={3} className={cx(globalStyles.cardItemTitle)}>
               <Ellipsis direction='end' content={pack.Name}/>
           </Title>

           {!isNullOrEmpty(pack.CreatedOnDisplay) &&
               <CardIconLabel icon={'clock'} description={`Purchased On ${pack.CreatedOnDisplay}`}/>
           }

           {!isNullOrEmpty(pack.Price) &&
               <CardIconLabel icon={'money'} description={`${costDisplay(pack.Price)} ${(isNullOrEmpty(!pack.TaxPercent) ? `+${pack.TaxPercent}% Tax` : '')}`} />
           }

           {!isNullOrEmpty(pack.Assignment) &&
               <CardIconLabel icon={'team'} description={pack.Assignment} />
           }

           {!isNullOrEmpty(pack.PunchesValueDisplay) &&
               <CardIconLabel icon={'ticket'} description={`${pack.UsedPunchesDisplay} of ${pack.PunchesValueDisplay} punches used`} preventFill={true} preventStroke={false} />
           }

           TODO BAR USED
       </>
    )
}

export default PackagePartialDetails