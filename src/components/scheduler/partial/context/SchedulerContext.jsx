import * as React from 'react';
import { defaultModelFields, noop } from '../utils';
import { DEFAULT_GROUP } from '../constants';
import { ZonedDate } from '@progress/kendo-date-math';

/* eslint-disable max-len */
// Static
/** @hidden */
export const SchedulerElementContext = React.createContext({current: null});
/** @hidden */
export const useSchedulerElementContext = () => React.useContext(SchedulerElementContext);
SchedulerElementContext.displayName = 'SchedulerElementContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the [Scheduler]({% slug api_scheduler_scheduler %}) props.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerPropsContext = React.createContext({});
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the [Scheduler]({% slug api_scheduler_scheduler %}) props.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerPropsContext = () => React.useContext(SchedulerPropsContext);
SchedulerPropsContext.displayName = 'SchedulerPropsContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the available Scheduler [views]({% slug views_scheduler %}).
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerViewsContext = React.createContext([]);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the available Scheduler [views]({% slug views_scheduler %}).
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerViewsContext = () => React.useContext(SchedulerViewsContext);
SchedulerViewsContext.displayName = 'SchedulerViewsContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the combined default and custom [modelFields]({% slug api_scheduler_schedulerprops %}#toc-modelfields) of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerFieldsContext = React.createContext(defaultModelFields);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the combined default and custom [modelFields]({% slug api_scheduler_schedulerprops %}#toc-modelfields) of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerFieldsContext = () => React.useContext(SchedulerFieldsContext);
SchedulerFieldsContext.displayName = 'SchedulerFieldsContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the combined default and custom [modelFields]({% slug api_scheduler_schedulerprops %}#toc-modelfields) of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerDateFormatContext = React.createContext({ dateFormat: '{0:D}', shortDateFormat: '{0:d}' });
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the combined default and custom [modelFields]({% slug api_scheduler_schedulerprops %}#toc-modelfields) of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerDateFormatContext = () => React.useContext(SchedulerDateFormatContext);
SchedulerDateFormatContext.displayName = 'SchedulerDateFormatContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the Scheduler `Group` object, calculated based on the [group]({% slug api_scheduler_schedulerprops %}#toc-group) and [resources]({% slug api_scheduler_schedulerprops %}#toc-resources).
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerGroupsContext = React.createContext([DEFAULT_GROUP]);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the Scheduler `Group` object, calculated based on the [group]({% slug api_scheduler_schedulerprops %}#toc-group) and [resources]({% slug api_scheduler_schedulerprops %}#toc-resources).
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerGroupsContext = () => React.useContext(SchedulerGroupsContext);
SchedulerGroupsContext.displayName = 'SchedulerGroupsContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the `dateRange` of the current view.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerDateRangeContext = React.createContext({ start: new Date(), end: new Date(), zonedStart: ZonedDate.fromLocalDate(new Date()), zonedEnd: ZonedDate.fromLocalDate(new Date()) });
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the `dateRange` of the current view.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerDateRangeContext = () => React.useContext(SchedulerDateRangeContext);
SchedulerDateRangeContext.displayName = 'SchedulerDateRangeContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the grouping orientation of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerOrientationContext = React.createContext(null);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the grouping orientation of the Scheduler.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerOrientationContext = () => React.useContext(SchedulerOrientationContext);
SchedulerOrientationContext.displayName = 'SchedulerOrientationContext';

// State
/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the Scheduler internal `date` state.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerDateContext = React.createContext([new Date(), noop]);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the Scheduler internal `date` state.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerDateContext = () => React.useContext(SchedulerDateContext);
SchedulerDateContext.displayName = 'SchedulerDateContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the Scheduler internal `data` reducer.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerDataContext = React.createContext([[], noop]);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the Scheduler internal `data` reducer.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerDataContext = () => React.useContext(SchedulerDataContext);
SchedulerDataContext.displayName = 'SchedulerDataContext';

/**
 * A [React Context](https://reactjs.org/docs/context.html) providing access to the Scheduler internal `activeView` state.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 */
export const SchedulerActiveViewContext = React.createContext(['day', noop]);
/**
 * A custom [React Hook](https://reactjs.org/docs/hooks-intro.html) providing access to the Scheduler internal `activeView` state.
 *
 * For more information, refer to the [Scheduler Context]({% slug context_scheduler %}) article.
 *
 * @returns
 */
export const useSchedulerActiveViewContext = () => React.useContext(SchedulerActiveViewContext);
SchedulerActiveViewContext.displayName = 'SchedulerActiveViewContext';

/**
 * @hidden
 */
export const SchedulerItemSelectionContext = React.createContext([null, () => {}]);

/**
 * @hidden
 */
export const useSchedulerItemSelectionContext = () => React.useContext(SchedulerItemSelectionContext);
SchedulerItemSelectionContext.displayName = 'SchedulerItemSelectionContext';
/**
 *
 */

/** @hidden */
export const SchedulerContext = ({
                                     children,

                                     element,
                                     props,
                                     views,
                                     fields,
                                     groups,
                                     dateRange,
                                     dateFormat,
                                     orientation,

                                     date,
                                     data,
                                     activeView,
                                     selection
                                 }) => {
    return (
        <SchedulerElementContext.Provider value={element}>
            <SchedulerPropsContext.Provider value={props}>
                <SchedulerViewsContext.Provider value={views}>
                    <SchedulerFieldsContext.Provider value={fields}>
                        <SchedulerDateFormatContext.Provider value={dateFormat}>
                            <SchedulerGroupsContext.Provider value={groups}>
                                <SchedulerDateRangeContext.Provider value={dateRange}>
                                    <SchedulerOrientationContext.Provider value={orientation}>
                                        <SchedulerDateContext.Provider value={date}>
                                            <SchedulerDataContext.Provider value={data}>
                                                <SchedulerActiveViewContext.Provider value={activeView}>
                                                    <SchedulerItemSelectionContext.Provider value={selection}>
                                                        {children}
                                                    </SchedulerItemSelectionContext.Provider>
                                                </SchedulerActiveViewContext.Provider>
                                            </SchedulerDataContext.Provider>
                                        </SchedulerDateContext.Provider>
                                    </SchedulerOrientationContext.Provider>
                                </SchedulerDateRangeContext.Provider>
                            </SchedulerGroupsContext.Provider>
                        </SchedulerDateFormatContext.Provider>
                    </SchedulerFieldsContext.Provider>
                </SchedulerViewsContext.Provider>
            </SchedulerPropsContext.Provider>
        </SchedulerElementContext.Provider>
    );
};
