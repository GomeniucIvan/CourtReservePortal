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

function LeagueSessionDetailsPartial({sessionDetails}) {
    const iconSize = 20;
    
    return (
       <>
           {!isNullOrEmpty(leagueDisplayEventDates(sessionDetails)) &&
               <CardIconLabel icon={'event-dates'} description={leagueDisplayEventDates(sessionDetails)} size={iconSize} />
           }

           {!isNullOrEmpty(sessionDetails.DisplayStartEndTimesString) &&
               <CardIconLabel icon={'clock'} description={sessionDetails.DisplayStartEndTimesString} size={iconSize} />
           }
           {!isNullOrEmpty(sessionDetails.DisplayCostString) &&
               <CardIconLabel icon={'price-tag'} description={sessionDetails.DisplayCostString} size={iconSize} />
           }
           {!isNullOrEmpty(sessionDetails.Note) &&
               <CardIconLabel icon={'message'} description={sessionDetails.Note} size={iconSize} />
           }
           {!isNullOrEmpty(sessionDetails.RatingNames) &&
               <CardIconLabel icon={'star-light'} description={sessionDetails.RatingNames} size={iconSize} />
           }
           {(!isNullOrEmpty(sessionDetails.LeagueGender) && !equalString(sessionDetails.LeagueGender, 4)) &&
               <CardIconLabel icon={'person-half-dress-sharp-regular'} description={displayLeaguePlayerFormat(sessionDetails.LeagueGender)} size={iconSize} />
           }
           {(!isNullOrEmpty(sessionDetails.AgeRestrictionString)) &&
               <CardIconLabel icon={'arrow-up-9-1-regular'} description={sessionDetails.AgeRestrictionString} size={iconSize} />
           }
           {(!isNullOrEmpty(sessionDetails.SlotsInfoString) && toBoolean(sessionDetails.ShowSlotsInfoBool)) &&
               <CardIconLabel icon={'grid-sharp-light'} description={sessionDetails.SlotsInfoString} size={iconSize} />
           }

           {!isNullOrEmpty(sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage) &&
               <AlertBlock type={'error'} description={sessionDetails.OccurrenceSignUpNotYetOpenErrorMessage} removePadding={true} size={iconSize} />
           }
       </>
    );
}

export default LeagueSessionDetailsPartial
