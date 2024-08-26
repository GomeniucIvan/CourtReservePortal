import * as React from 'react';
import { MultiDayView, multiDayViewDefaultProps } from "./MultiDayViewDisplay.jsx";
import { dayViewTitle, messages } from "../../messages/index.mjs";

export const DayView = (props) => <MultiDayView {...props} />;

export const dayViewDefaultProps = {
    ...multiDayViewDefaultProps,
    name: 'day',
    title: (localization) => localization.toLanguageString(dayViewTitle, messages[dayViewTitle]),
    step: 1,
    numberOfDays: 1,
    slotDuration: 60,
    slotDivisions: 2,
    selectedDateFormat: '{0:D}',
    selectedShortDateFormat: '{0:d}',
};

DayView.displayName = 'KendoReactSchedulerDayView';
