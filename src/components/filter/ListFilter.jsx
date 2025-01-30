import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Selector} from "antd-mobile";
import {Slider} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import {any} from "prop-types";

function ListFilter({data, 
                        show,
                        onClose,
                        formik,
                        showDates,
                        showDayOfTheWeek,
                        showTimeOfADay,
                        showEventRegistrationType}) {
    
    //filter data
    const [dates, setDates] = useState([
        { Name: 'Today', Id: 1, Selected: false },
        { Name: 'Tomorrow', Id: 2, Selected: false },
        { Name: 'This Week', Id: 3, Selected: false },
        { Name: 'This Month', Id: 4, Selected: false },
        { Name: 'Custom', Id: 5, Selected: false },
    ]);

    const [dayOfTheWeeks, setDayOfTheWeeks] = useState([
        { Name: 'Weekend', Id: -2, Selected: false },
        { Name: 'Weekday', Id: -1, Selected: false },
        { Name: 'Sunday', Id: 0, Selected: false },
        { Name: 'Monday', Id: 1, Selected: false },
        { Name: 'Tuesday', Id: 2, Selected: false },
        { Name: 'Wednesday', Id: 3, Selected: false },
        { Name: 'Thursday', Id: 4, Selected: false },
        { Name: 'Friday', Id: 5, Selected: false },
        { Name: 'Saturday', Id: 6, Selected: false },
    ]);

    const [timeOfADays, setTimeOfADays] = useState([
        { Name: 'Morning', Id: 1, Selected: false },
        { Name: 'Afternoon', Id: 2, Selected: false },
        { Name: 'Evening', Id: 3, Selected: false },
        { Name: 'Custom', Id: 4, Selected: false },
    ]);

    const [eventRegistrationsType, setShowEventRegistrationsType] = useState([
        { Name: 'Drop-in', Id: 1, Selected: false },
        { Name: 'Full Event', Id: 2, Selected: false }
    ]);
    
    //formik values
    let [eventTypes, setEventTypes] = useState([]);
    let [eventSessions, setEventSessions] = useState([]);
    let [instructors, setInstructors] = useState([]);
    let [minPrice, setMinPrice] = useState(null);
    let [maxPrice, setMaxPrice] = useState(null);
    let [eventTags, setEventTags] = useState([]);


    const {globalStyles} = useApp();

    useEffect(() => {
        if (formik && typeof formik.getFieldProps === 'function') {
            let selectedEventTypeIds = eventTypes.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedEventSessionIds = eventSessions.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedInstructorIds = instructors.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedEventTagIds = eventTags.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedDates = dates.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedDayOfTheWeeks = dayOfTheWeeks.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedTimeOfADays = timeOfADays.filter(et => toBoolean(et.Selected)).map(et => et.Id);
                
            formik.setFieldValue("DrawerFilter.MinPrice", minPrice);
            formik.setFieldValue("DrawerFilter.MaxPrice", maxPrice);
            formik.setFieldValue("DrawerFilter.SessionIds", selectedEventSessionIds);
            formik.setFieldValue("DrawerFilter.InstructorIds", selectedInstructorIds);
            formik.setFieldValue("DrawerFilter.EventTypeIds", selectedEventTypeIds);
            
            formik.setFieldValue("DrawerFilter.TimeOfDay", selectedTimeOfADays);
            formik.setFieldValue("DrawerFilter.DayOfWeeks", selectedDayOfTheWeeks);
            formik.setFieldValue("DrawerFilter.Dates", selectedDates);
            formik.setFieldValue("DrawerFilter.CustomDate_Start", '');
            formik.setFieldValue("DrawerFilter.CustomDate_End", '');
            formik.setFieldValue("DrawerFilter.FilterTimeOfADayStart", '');
            formik.setFieldValue("DrawerFilter.FilterTimeOfADayEnd", '');
            formik.setFieldValue("DrawerFilter.EventRegistrationTypeId", anyInList(eventRegistrationsType) ? eventRegistrationsType[0] : '');
            formik.setFieldValue("DrawerFilter.EventTagIds", selectedEventTagIds);
            formik.setFieldValue("DrawerFilter.HideIneligibleAndFullEvents", '');
            
        }
    }, [minPrice, maxPrice, eventTypes, instructors, eventSessions, eventTags, dates, dayOfTheWeeks, timeOfADays])
    
    useEffect(() => {
        if (!isNullOrEmpty(data)) {
            setMinPrice(data.MinPrice)
            setMaxPrice(data.MaxPrice)
            
            console.log(data)
            
            if (anyInList(data?.EventCategories)){
                setEventTypes(data.EventCategories.map(eventType => {
                    return {
                        Name: eventType.Name,
                        Id: eventType.Id,
                        Selected: data.SelectedCategories.includes(eventType.Id)
                    }
                }))
            }
            if (anyInList(data?.EventSessions)){
                setEventSessions(data.EventSessions.map(eventType => {
                    return {
                        Name: eventType.Name,
                        Id: eventType.Id,
                        Selected: data.SelectedEventSessionIds.includes(eventType.Id)
                    }
                }))
            }
            if (anyInList(data?.EventTags)){
                setEventTags(data.EventTags.map(eventTag => {
                    return {
                        Name: eventTag.Name,
                        Id: eventTag.EventTagId,
                        Selected: data.SelectedEventTags.includes(eventTag.Id)
                    }
                }))
            }

        }
    }, [data]);

    const onFilterClose = () =>{
        onClose();
    }
    
    return (
        <DrawerBottom
            showDrawer={toBoolean(show)}
            closeDrawer={() => {
                onFilterClose();
            }}
            label={'Filter'}
            showButton={true}
            confirmButtonText={'Filter'}
            onConfirmButtonClick={() => {
                onFilterClose();
            }}
        >
            <>
                {anyInList(eventTypes) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Categories
                        </label>

                        <Selector className={globalStyles.filterSelector}
                            //showCheckMark={false}
                                  multiple={true}
                                  onChange={(selectedValues) => {

                                      setEventTypes(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={eventTypes.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={eventTypes
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {anyInList(eventTags) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Tags
                        </label>

                        <Selector className={globalStyles.filterSelector}
                            //showCheckMark={false}
                                  multiple={true}
                                  onChange={(selectedValues) => {

                                      setEventTags(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={dayOfTheWeeks.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={dayOfTheWeeks
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }
                
                {anyInList(eventSessions) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Sessions
                        </label>

                        <Selector className={globalStyles.filterSelector}
                            //showCheckMark={false}
                                  multiple={true}
                                  onChange={(selectedValues) => {

                                      setEventSessions(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={eventSessions.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={eventSessions
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {anyInList(instructors) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Instructors
                        </label>

                        <Selector className={globalStyles.filterSelector}
                                  multiple={true}
                                  onChange={(selectedValues) => {
                                      setInstructors(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={instructors.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={instructors
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {(anyInList(dates) && showDates) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Dates
                        </label>

                        <Selector className={globalStyles.filterSelector}
                                  multiple={false}
                                  onChange={(selectedValues) => {
                                      setDates(prevSessions =>
                                          prevSessions.map(sd => ({
                                              ...sd,
                                              Selected: selectedValues.includes(sd.Id)
                                          }))
                                      );
                                  }}
                                  options={dates.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={dates
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {(anyInList(dayOfTheWeeks) && showDayOfTheWeek) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Day of Week
                        </label>

                        <Selector className={globalStyles.filterSelector}
                                  multiple={true}
                                  onChange={(selectedValues) => {
                                      setDayOfTheWeeks(prevSessions =>
                                          prevSessions.map(sd => ({
                                              ...sd,
                                              Selected: selectedValues.includes(sd.Id)
                                          }))
                                      );
                                  }}
                                  options={dayOfTheWeeks.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={dayOfTheWeeks
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {(anyInList(timeOfADays) && showTimeOfADay) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Time of Day
                        </label>

                        <Selector className={globalStyles.filterSelector}
                                  multiple={true}
                                  onChange={(selectedValues) => {
                                      setTimeOfADays(prevSessions =>
                                          prevSessions.map(sd => ({
                                              ...sd,
                                              Selected: selectedValues.includes(sd.Id)
                                          }))
                                      );
                                  }}
                                  options={timeOfADays.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={timeOfADays
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }

                {(anyInList(eventRegistrationsType) && showEventRegistrationType) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Event Type
                        </label>

                        <Selector className={globalStyles.filterSelector}
                                  multiple={false}
                                  onChange={(selectedValues) => {
                                      setShowEventRegistrationsType(prevSessions =>
                                          prevSessions.map(sd => ({
                                              ...sd,
                                              Selected: selectedValues.includes(sd.Id)
                                          }))
                                      );
                                  }}
                                  options={eventRegistrationsType.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={eventRegistrationsType
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </PaddingBlock>
                }
                
                {(!isNullOrEmpty(minPrice) && !isNullOrEmpty(maxPrice)) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Price
                        </label>

                        <Slider range defaultValue={[minPrice, maxPrice]} min={minPrice} max={maxPrice} />
                    </PaddingBlock>
                }
            </>
        </DrawerBottom>
    );
}

export default ListFilter;