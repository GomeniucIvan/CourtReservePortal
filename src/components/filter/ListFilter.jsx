import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Selector} from "antd-mobile";
import {Slider} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import ListFilterItemExpander from "@/components/filter/ListFilterItemExpander.jsx";

function ListFilter({data, 
                        show,
                        onClose,
                        formik,
                        showDates,
                        showDayOfTheWeek,
                        showTimeOfADay,
                        showEventRegistrationType}) {

    const {globalStyles} = useApp();
    
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

    const [eventRegistrationTypes, setEventRegistrationTypes] = useState([
        { Name: 'Drop-in', Id: 1, Selected: false },
        { Name: 'Full Event', Id: 2, Selected: false }
    ]);
    
    //formik values
    let [sortByOptions, setSortByOptions] = useState([]);
    let [eventTypes, setEventTypes] = useState([]);
    let [eventSessions, setEventSessions] = useState([]);
    let [instructors, setInstructors] = useState([]);
    let [minPrice, setMinPrice] = useState(null);
    let [maxPrice, setMaxPrice] = useState(null);
    let [eventTags, setEventTags] = useState([]);



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
            formik.setFieldValue("DrawerFilter.EventRegistrationTypeId", anyInList(eventRegistrationTypes) ? eventRegistrationTypes[0] : '');
            formik.setFieldValue("DrawerFilter.EventTagIds", selectedEventTagIds);
            formik.setFieldValue("DrawerFilter.HideIneligibleAndFullEvents", '');
            
        }
    }, [minPrice, maxPrice, eventTypes, instructors, eventSessions, eventTags, dates, dayOfTheWeeks, timeOfADays, eventRegistrationTypes])
    
    useEffect(() => {
        if (!isNullOrEmpty(data)) {
            setMinPrice(data.MinPrice)
            setMaxPrice(data.MaxPrice)
            
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
            
            if (showEventRegistrationType) {
                setEventRegistrationTypes(eventRegistrationTypes.map(regType => {
                    return {
                        Name: regType.Name,
                        Id: regType.Id,
                        Selected: equalString(regType.Id, data?.EventListDisplayType)
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
            
            if (anyInList(data?.SortByOptions)) {
                setSortByOptions(data.SortByOptions.map(sortOption => {
                    return {
                        Name: sortOption.Text,
                        Id: sortOption.Value,
                        Selected: equalString(sortOption.Value, data?.EventSortBy)
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
            maxHeightVh={80}
            onConfirmButtonClick={() => {
                onFilterClose();
            }}
        >
            <>
                {anyInList(sortByOptions) &&
                    <>
                        <ListFilterItemExpander label={'Sort by'}>
                                 <Selector className={globalStyles.filterSelector}
                                           multiple={false}
                                           onChange={(selectedValues) => {
                                               if (anyInList(selectedValues)) {
                                                   setSortByOptions(prevSessions =>
                                                       prevSessions.map(so => ({
                                                           ...so,
                                                           Selected: selectedValues.includes(so.Id)
                                                       }))
                                                   );
                                               }
                                           }}
                                           options={sortByOptions.map(so => ({
                                               label: so.Name,
                                               value: so.Id
                                           }))}
                                           value={sortByOptions
                                               .filter(et => et.Selected)
                                               .map(et => et.Id)}
                                 />
                        </ListFilterItemExpander>
                    </>

                }
                
                {anyInList(eventTypes) &&
                    <ListFilterItemExpander label={'Categories'}>
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
                    </ListFilterItemExpander>
                }

                {anyInList(eventTags) &&
                    <ListFilterItemExpander label={'Tags'}>
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
                                  options={eventTags.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={eventTags
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </ListFilterItemExpander>
                }

                {anyInList(eventSessions) &&
                    <ListFilterItemExpander label={'Sessions'}>
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
                    </ListFilterItemExpander>
                }

                {anyInList(instructors) &&
                    <ListFilterItemExpander label={'Instructors'}>
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
                    </ListFilterItemExpander>
                }

                {(anyInList(dates) && showDates) &&
                    <ListFilterItemExpander label={'Dates'}>
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
                    </ListFilterItemExpander>
                }

                {(anyInList(dayOfTheWeeks) && showDayOfTheWeek) &&
                    <ListFilterItemExpander label={'Day of Week'}>
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
                    </ListFilterItemExpander>
                }

                {(anyInList(timeOfADays) && showTimeOfADay) &&
                    <ListFilterItemExpander label={'Time of Day'}>
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
                    </ListFilterItemExpander>
                }

                {(anyInList(eventRegistrationTypes) && showEventRegistrationType) &&
                    <ListFilterItemExpander label={'Event Type'}>
                        <Selector className={globalStyles.filterSelector}
                                  multiple={false}
                                  onChange={(selectedValues) => {
                                      setEventRegistrationTypes(prevSessions =>
                                          prevSessions.map(rt => ({
                                              ...rt,
                                              Selected: selectedValues.includes(rt.Id)
                                          }))
                                      );
                                  }}
                                  options={eventRegistrationTypes.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={eventRegistrationTypes
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </ListFilterItemExpander>
                }

                {(!isNullOrEmpty(minPrice) && !isNullOrEmpty(maxPrice)) &&
                    <ListFilterItemExpander label={'Price'}>
                        <Slider range defaultValue={[minPrice, maxPrice]} min={minPrice} max={maxPrice}/>
                    </ListFilterItemExpander>
                }
            </>
        </DrawerBottom>
    );
}

export default ListFilter;