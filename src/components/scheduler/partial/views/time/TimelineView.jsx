import * as React from "react";
import { MultiDayTimelineView, multiDayTimelineViewDefaultProps } from "./MultiDayTimelineView.jsx";
import { timelineViewTitle, messages } from "../../messages/index.mjs";

export const TimelineView = (props) => <MultiDayTimelineView {...props} />;

export const timeLineViewDefaultProps = {
  ...multiDayTimelineViewDefaultProps,
  name: 'timeline',
  title: (localization) => localization.toLanguageString(timelineViewTitle, messages[timelineViewTitle]),
  step: 1,
  slotDuration: 60,
  slotDivisions: 2,
  numberOfDays: 1,
  selectedDateFormat: '{0:D}',
  selectedShortDateFormat: '{0:d}'
};

TimelineView.displayName = 'KendoReactSchedulerTimelineView';