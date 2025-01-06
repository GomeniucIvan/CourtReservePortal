import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {EventRouteNames} from "@/routes/EventRoutes.jsx";
import {setPage, toRoute} from "@/utils/RouteUtils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {cx} from "antd-style";
import {toBoolean} from "@/utils/Utils.jsx";
import {
    SchedulerProportionalViewItem
} from "@/components/scheduler/partial/items/SchedulerProportionalViewItemDisplay.jsx";

const EventCalendarItem = (props) => {
    const dataItem = props.dataItem;
    const navigate = useNavigate()
    const {setDynamicPages} = useApp();
    const showSignUpLink = true;
    
    return (
        <SchedulerProportionalViewItem {...props}>
            <div className={cx(toBoolean(dataItem.IsPast) && 'past-k-event')}
                 style={{
                     backgroundColor: dataItem.EventTypeBgColor,
                     color: dataItem.EventTypeTextColor,
                 }}
                 onClick={() => {
                     let route = toRoute(EventRouteNames.EVENT_DETAILS, 'number', dataItem.Number);
                     setPage(setDynamicPages, dataItem.EventName, route);
                     navigate(route);
                 }}>
                {dataItem.EventName}

            </div>
        </SchedulerProportionalViewItem>
    );
};


export default EventCalendarItem;