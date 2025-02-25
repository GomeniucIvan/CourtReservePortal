import * as React from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {Card, Ellipsis, List} from 'antd-mobile'
import {
    anyInList,
    encodeParamsObject,
    equalString,
    generateHash,
    isNullOrEmpty,
    nullToEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {Segmented, Space, Flex, Typography, Progress, Button} from "antd";
import {BarsOutlined, AppstoreOutlined} from "@ant-design/icons";
import {cx} from "antd-style";
import {fromLocalStorage, getNavigationStorage, toLocalStorage} from "@/storage/AppStorage.jsx";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import SVG from "@/components/svg/SVG.jsx";
import InfiniteScroll from "@/components/infinitescroll/InfiniteScroll.jsx";
import HeaderSearch from "@/components/header/HeaderSearch.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import ListFilter from "@/components/filter/ListFilter.jsx";
import HeaderFilter from "@/components/header/HeaderFilter.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useFormik} from "formik";
import {listFilter} from "@/utils/ListUtils.jsx";
import {fromDateTimeStringToDate, fromTimeSpanString} from "@/utils/DateUtils.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {eReplace} from "@/utils/TranslateUtils.jsx";
import {LeagueRouteNames} from "@/routes/LeagueRoutes.jsx";
import {displayLeaguePlayerFormat, leagueDisplayEventDates} from "@portal/league/functions.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";

function LeagueSessionDetailsPartial({sessionDetails, page = 'details'}) {
    const iconSize = 20;
    const {token} = useApp();

    const getIcon = (icon) => {
        if (equalString(page, 'restrictions')) {
            return 'circle-filled';
        } else {
            return icon;
        }
    }

    const getColor = () => {
        if (equalString(page, 'restrictions')) {
            return token.colorError;
        } else {
            return undefined;
        }
    }

    const getPreventCircles = () => {
        return !equalString(page, 'restrictions');
    }
    
    const displayDescription = (label, value) => {
        if (equalString(page, 'restrictions')) {
            return `${label}: ${value}`;
        } else {
            return value;
        }
    }
    
    console.log(sessionDetails)
    
    return (
        <>
            {1 == 1 &&
                <>
                    {!isNullOrEmpty(leagueDisplayEventDates(sessionDetails)) &&
                        <CardIconLabel icon={getIcon('event-dates')} iconColor={getColor()} description={leagueDisplayEventDates(sessionDetails)} size={iconSize} />
                    }

                    {!isNullOrEmpty(sessionDetails.DisplayStartEndTimesString) &&
                        <CardIconLabel icon={getIcon('clock')} iconColor={getColor()} description={sessionDetails.DisplayStartEndTimesString} size={iconSize} />
                    }

                    {(!equalString(page, 'waitlist-unsubscribe') && !equalString(page, 'optout')) &&
                        <>
                            {!isNullOrEmpty(sessionDetails.DisplayCostString) &&
                                <CardIconLabel icon={getIcon('price-tag')} iconColor={getColor()} description={sessionDetails.DisplayCostString} size={iconSize} />
                            }
                        </>
                    }
                    
                    {!isNullOrEmpty(sessionDetails.Note) &&
                        <CardIconLabel icon={getIcon('message')} iconColor={getColor()} description={sessionDetails.Note} size={iconSize} />
                    }
                </>
            }

            {(equalString(page, 'details') || 
                    equalString(page, 'optin') ||
                    equalString(page, 'editoptin') ||
                    equalString(page, 'waitlist') ||
                    equalString(page, 'waitlist-edit')) &&
                <>
                    {!isNullOrEmpty(sessionDetails.RatingNames) &&
                        <CardIconLabel icon={getIcon('star-light')}
                                       preventCircles={getPreventCircles()}
                                       iconColor={getColor()}
                                       description={displayDescription('Rating(s) Restriction', sessionDetails.RatingNames)}
                                       size={iconSize} />
                    }
                    
                    {(!isNullOrEmpty(sessionDetails.LeagueGender) && !equalString(sessionDetails.LeagueGender, 4)) &&
                        <CardIconLabel icon={getIcon('person-half-dress-sharp-regular')}
                                       preventCircles={getPreventCircles()}
                                       iconColor={getColor()}
                                       description={displayDescription('Gender Restriction', displayLeaguePlayerFormat(sessionDetails.LeagueGender))}
                                       size={iconSize} />
                    }
                    {(!isNullOrEmpty(sessionDetails.AgeRestrictionString)) &&
                        <CardIconLabel icon={getIcon('arrow-up-9-1-regular')}
                                       preventCircles={getPreventCircles()}
                                       iconColor={getColor()}
                                       description={displayDescription('Age Restriction', sessionDetails.AgeRestrictionString)}
                                       size={iconSize} />
                    }
                    
                    {(!isNullOrEmpty(sessionDetails.SlotsInfoString) && toBoolean(sessionDetails.ShowSlotsInfoBool)) &&
                        <CardIconLabel icon={getIcon('grid-sharp-light')} iconColor={getColor()} description={sessionDetails.SlotsInfoString} size={iconSize} />
                    }
                    
                    {!isNullOrEmpty(sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage) &&
                        <AlertBlock type={'error'} description={sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage} removePadding={true} size={iconSize} />
                    }
                </>
            }

            {(equalString(page, 'waitlist') || equalString(page, 'waitlist-edit')) &&
                <>
                    <CardIconLabel icon={getIcon('circle-sharp-solid')} 
                                   iconColor={getColor()} 
                                   description={`Current Player(s) on Waitlist: <b>${sessionDetails?.LeagueSessionWaitlistRegistrantsCount}</b>`}
                                   size={iconSize} />
                </>
            }
        </>
    );
}

export default LeagueSessionDetailsPartial
