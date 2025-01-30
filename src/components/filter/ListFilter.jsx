import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Selector} from "antd-mobile";
import {Slider} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";

function ListFilter({data ,show, onClose, formik}) {
    let [eventTypes, setEventTypes] = useState([]);
    let [eventSessions, setEventSessions] = useState([]);
    let [instructors, setInstructors] = useState([]);
    let [sessionIds, setSessionIds] = useState([]);
    let [minPrice, setMinPrice] = useState(null);
    let [maxPrice, setMaxPrice] = useState(null);
    let [eventTagIds, setEventTagIds] = useState([]);

    const {globalStyles} = useApp();

    useEffect(() => {
        if (formik && typeof formik.getFieldProps === 'function') {
            let selectedEventTypeIds = eventTypes.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedEventSessionIds = eventSessions.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedInstructorIds = instructors.filter(et => toBoolean(et.Selected)).map(et => et.Id);
            let selectedEventTagIds = eventTagIds.filter(et => toBoolean(et.Selected)).map(et => et.Id);
                
            formik.setFieldValue("DrawerFilter.MinPrice", minPrice);
            formik.setFieldValue("DrawerFilter.MaxPrice", maxPrice);
            formik.setFieldValue("DrawerFilter.SessionIds", selectedEventSessionIds);
            formik.setFieldValue("DrawerFilter.InstructorIds", selectedInstructorIds);
            formik.setFieldValue("DrawerFilter.EventTypeIds", selectedEventTypeIds);
            
            formik.setFieldValue("DrawerFilter.TimeOfDa", '');
            formik.setFieldValue("DrawerFilter.DayOfWeeks", '');
            formik.setFieldValue("DrawerFilter.Dates", '');
            formik.setFieldValue("DrawerFilter.CustomDate_Start", '');
            formik.setFieldValue("DrawerFilter.CustomDate_End", '');
            formik.setFieldValue("DrawerFilter.FilterTimeOfADayStart", '');
            formik.setFieldValue("DrawerFilter.FilterTimeOfADayEnd", '');
            formik.setFieldValue("DrawerFilter.EventRegistrationTypeId", '');
            formik.setFieldValue("DrawerFilter.EventTagIds", selectedEventTagIds);
            formik.setFieldValue("DrawerFilter.HideIneligibleAndFullEvents", '');
            
        }
    }, [minPrice, maxPrice, sessionIds, eventTypes, instructors, eventSessions,  eventTagIds])
    
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

                {(!isNullOrEmpty(minPrice) && !isNullOrEmpty(maxPrice)) &&
                    <PaddingBlock onlyTop={true}>
                        <label className={globalStyles.globalLabel}>
                            Price
                        </label>

                        <Slider range defaultValue={[minPrice, maxPrice]} min={minPrice} max={maxPrice} />
                    </PaddingBlock>
                }

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
                            //showCheckMark={false}
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
            </>
        </DrawerBottom>
    );
}

export default ListFilter;