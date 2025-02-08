import {Button, Card, Flex, Skeleton, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";

const {Title, Text}  = Typography ;
//page purchase, details, list
function PublicPackageDetails({pack, page= 'list'}) {
    let textToEffectiveDate = '';

    if (isNullOrEmpty(pack)){
        return (<></>)
    }
    
    if (pack?.StartDate != null) {
        textToEffectiveDate = textToEffectiveDate + "from " + pack.StartDateDisplay;
    }

    if (pack?.EndDate != null) {
        textToEffectiveDate = textToEffectiveDate + " to " + pack.EndDateDisplay;
    }
    
    return (
        <>
            <Title level={3}>{pack.Name}</Title>

            {equalString(page, 'list') &&
                <Flex gap={4} align={'center'}>
                    <Title level={1}>{costDisplay(pack.Price)}</Title><Text>{` for ${pack.TotalPunches} ${pack.TotalPunches === 1 ? 'punch' : 'punches' }`}</Text>
                </Flex>
            }

            {!equalString(page, 'list') &&
                <FormInputDisplay label={'Price'} value={`${costDisplay(pack.Price)} for ${pack.TotalPunches} ${pack.TotalPunches === 1 ? 'punch' : 'punches' }`} />
            }
            
            {(!isNullOrEmpty(pack.StartDate) || !isNullOrEmpty(pack.EndDate)) &&
                <CardIconLabel icon={'clock'} description={textToEffectiveDate} />
            }

            {toBoolean(pack.EligibleAssignByFamily) &&
                <CardIconLabel icon={'group'} description={'Family Sharing Available'} />
            }

            {!isNullOrEmpty(pack.Description) &&
                <CardIconLabel icon={'message'} description={pack.Description} />
            }
        </>
    )
}

export default PublicPackageDetails
