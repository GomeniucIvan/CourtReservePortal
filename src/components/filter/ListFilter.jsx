import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Selector} from "antd-mobile";
import {Flex, Slider} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import ListFilterItemExpander from "@/components/filter/ListFilterItemExpander.jsx";
import FormInputsDateInterval from "@/form/input/FormInputsDateInterval.jsx";
import FormInputsTimeInterval from "@/form/input/FormInputsTimeInterval.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {e} from "@/utils/TranslateUtils.jsx";
import {bookingTypes} from "@/utils/SelectUtils.jsx";
import {useTranslation} from "react-i18next";

function ListFilter({data, 
                        show,
                        onClose,
                        formik,
                        page,
                        showDates,
                        currentDateTime,
                        showDayOfTheWeek,
                        showTimeOfADay,
                        setFilteredCount,
                        showFilterDates,
                        filterDatesInterval,
                        minDate,
                        maxDate,
                        showEventRegistrationType}) {

    const {globalStyles, token} = useApp();
    const {t} = useTranslation('');
    
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
    let [showCustomDatesDatePickers, setShowCustomDatesDatePickers] = useState(false);
    let [showTimeOfADayTimePickers, setShowTimeOfADayTimePickers] = useState(false);

    //my bookings
    let [familyMembers, setFamilyMembers] = useState([]);
    let [innerBookingTypes, setInnerBookingTypes] = useState([]);
    
    useEffect(() => {
        if (formik && typeof formik.getFieldProps === 'function') {
            if (equalString(page, 'event-list')) {
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
                formik.setFieldValue("DrawerFilter.CustomDate_Start", data?.CustomDate_Start);
                formik.setFieldValue("DrawerFilter.CustomDate_End", data?.CustomDate_End);
                formik.setFieldValue("DrawerFilter.FilterTimeOfADayStart", data?.FilterTimeOfADayStart);
                formik.setFieldValue("DrawerFilter.FilterTimeOfADayEnd", data?.FilterTimeOfADayEnd);
                formik.setFieldValue("DrawerFilter.EventRegistrationTypeId", anyInList(eventRegistrationTypes) ? eventRegistrationTypes[0] : '');
                formik.setFieldValue("DrawerFilter.EventTagIds", selectedEventTagIds);
                formik.setFieldValue("DrawerFilter.HideIneligibleAndFullEvents", '');

                if (typeof setFilteredCount === 'function') {
                    let count = selectedEventTypeIds.length +
                        selectedEventSessionIds.length+selectedInstructorIds.length +
                        selectedEventTagIds.length+
                        selectedDates.length+
                        selectedDayOfTheWeeks.length+
                        selectedTimeOfADays.length;
                    setFilteredCount(count);
                }
            } else if (equalString(page, 'stringing-list')) {
               
            } else if (equalString(page, 'my-booking-list')) {
                let selectedOrgMemberIds = familyMembers.filter(et => toBoolean(et.Selected)).map(et => et.Id);
                let selectedBookingTypes = innerBookingTypes.filter(et => toBoolean(et.Selected)).map(et => et.Id);
                let selectedDates = dates.filter(et => toBoolean(et.Selected)).map(et => et.Id);
                
                formik.setFieldValue("DrawerFilter.OrgMemberIds", selectedOrgMemberIds);
                formik.setFieldValue("DrawerFilter.BookingTypes", selectedBookingTypes);
                formik.setFieldValue("DrawerFilter.Dates", selectedDates);
                formik.setFieldValue("DrawerFilter.CustomDate_Start", data?.CustomDate_Start);
                formik.setFieldValue("DrawerFilter.CustomDate_End", data?.CustomDate_End);
            }
        }
    }, [minPrice, maxPrice, eventTypes, instructors, eventSessions, eventTags, dates, dayOfTheWeeks, timeOfADays, eventRegistrationTypes])
    
    useEffect(() => {
        if (!isNullOrEmpty(data)) {
            setMinPrice(data.MinPrice)
            setMaxPrice(data.MaxPrice)
            
            if (anyInList(data?.FilterFamilyMembers)) {
                setFamilyMembers(data.FilterFamilyMembers.map(famMember => {
                    return {
                        Name: famMember.FullName,
                        Id: famMember.OrgMemberId,
                        Selected: data.OrgMemberIds.includes(famMember.OrgMemberId)
                    }
                }))
            }
            if (equalString(page, 'my-booking-list')) {
                
                if (anyInList(bookingTypes)) {
                    setInnerBookingTypes(bookingTypes.map(item => {
                        return {
                            Name: e(t(item.Text)),
                            Id: item.Value,
                            Selected: data?.BookingTypes.includes(item.Value)
                        }
                    }))
                }
            }
            
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
                        Selected: data.SelectedEventTags.includes(eventTag.EventTagId)
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
            
            if (anyInList(data?.SortByOptions)) {
                setSortByOptions(data.SortByOptions.map(sortOption => {
                    return {
                        Name: sortOption.Text,
                        Id: sortOption.Value,
                        Selected: equalString(sortOption.Value, data?.EventSortBy)
                    }
                }))
            }
            
            if (toBoolean(showDates)){
                setDates(dates.map(date => {
                    return {
                        Name: date.Name,
                        Id: date.Id,
                        Selected: data.FilterSelectedDates.includes(date.Id)
                    }
                }));
                setShowCustomDatesDatePickers(data.FilterSelectedDates.includes(5));
            }

            if (toBoolean(showDayOfTheWeek)){
                setDayOfTheWeeks(dayOfTheWeeks.map(dayOfKeek => {
                    return {
                        Name: dayOfKeek.Name,
                        Id: dayOfKeek.Id,
                        Selected: data.FilterSelectedDayOfWeeks.includes(dayOfKeek.Id)
                    }
                }))
            }

            if (toBoolean(showTimeOfADay)){
                setTimeOfADays(timeOfADays.map(timeOfDay => {
                    return {
                        Name: timeOfDay.Name,
                        Id: timeOfDay.Id,
                        Selected: data.FilterSelectedTimeOfDays.includes(timeOfDay.Id)
                    }
                }));
                setShowTimeOfADayTimePickers(data.FilterSelectedTimeOfDays.includes(4))
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
                {showFilterDates &&
                   <PaddingBlock>
                       <Flex gap={token.padding}>
                           <FormInputsDateInterval formik={formik}
                                                   labelStart={'Select Start Date'}
                                                   labelEnd={'Select End Date'}
                                                   nameStart={'DrawerFilter.StartDate'}
                                                   nameEnd={'DrawerFilter.EndDate'}
                                                   interval={filterDatesInterval}
                                                   minDate={minDate}
                                                   maxDate={maxDate}/>
                       </Flex>
                   </PaddingBlock>
                }
                
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

                {anyInList(familyMembers) &&
                    <ListFilterItemExpander label={'My Family'}>
                        <Selector className={globalStyles.filterSelector}
                            //showCheckMark={false}
                                  multiple={true}
                                  onChange={(selectedValues) => {

                                      setFamilyMembers(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={familyMembers.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={familyMembers
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </ListFilterItemExpander>
                }

                {anyInList(innerBookingTypes) &&
                    <ListFilterItemExpander label={'Booking Types'}>
                        <Selector className={globalStyles.filterSelector}
                            //showCheckMark={false}
                                  multiple={true}
                                  onChange={(selectedValues) => {

                                      setInnerBookingTypes(prevSessions =>
                                          prevSessions.map(et => ({
                                              ...et,
                                              Selected: selectedValues.includes(et.Id)
                                          }))
                                      );
                                  }}
                                  options={innerBookingTypes.map(et => ({
                                      label: et.Name,
                                      value: et.Id
                                  }))}
                                  defaultValue={innerBookingTypes
                                      .filter(et => et.Selected)
                                      .map(et => et.Id)}
                        />
                    </ListFilterItemExpander>
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
                        <Flex vertical={true} gap={token.padding}>
                            <Selector className={globalStyles.filterSelector}
                                      multiple={false}
                                      onChange={(selectedValues) => {
                                          setShowCustomDatesDatePickers(selectedValues.includes(5));

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
                            {showCustomDatesDatePickers &&
                                <Flex gap={token.padding}>
                                    <FormInputsDateInterval formik={formik}
                                                            labelStart={'Select Start Date'}
                                                            labelEnd={'Select End Date'}
                                                            nameStart={'DrawerFilter.CustomDate_Start'}
                                                            nameEnd={'DrawerFilter.CustomDate_End'}
                                                            minDate={currentDateTime} />
                                </Flex>
                            }
                        </Flex>
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
                        <Flex vertical={true} gap={token.padding}>
                            <Selector className={globalStyles.filterSelector}
                                      multiple={true}
                                      onChange={(selectedValues) => {
                                          setShowTimeOfADayTimePickers(selectedValues.includes(4));

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

                            {showTimeOfADayTimePickers &&
                                <Flex gap={token.padding}>
                                    <FormInputsTimeInterval formik={formik}
                                                            labelStart={'Select Start Time'}
                                                            labelEnd={'Select End Time'}
                                                            nameStart={'DrawerFilter.FilterTimeOfADayStart'}
                                                            nameEnd={'DrawerFilter.FilterTimeOfADayEnd'} />
                                </Flex>
                            }
                        </Flex>
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