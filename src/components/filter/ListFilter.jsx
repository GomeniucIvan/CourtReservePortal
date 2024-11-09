import DrawerBottom from "../drawer/DrawerBottom.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {Selector} from "antd-mobile";
import {Slider} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";

function ListFilter({data ,show, onClose}) {
    let [filterChanged, setFilterChanged] = useState(false);
    let [eventTypes, setEventTypes] = useState([]);
    let [eventSessions, setEventSessions] = useState([]);
    let [instructors, setInstructors] = useState([]);
    let [minPrice, setMinPrice] = useState(null);
    let [maxPrice, setMaxPrice] = useState(null);
    let [eventTagIds, setEventTagIds] = useState([]);

    const {globalStyles} = useApp();

    useEffect(() => {
        if (!isNullOrEmpty(data)){
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
        let filteredData = {
            EventTypeIds : eventTypes.filter(et => toBoolean(et.Selected)).map(et => et.Id),
            EventSessionIds : eventSessions.filter(et => toBoolean(et.Selected)).map(et => et.Id),
        };

        onClose(filteredData);
    }
    
    return (
        <DrawerBottom
            showDrawer={show}
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
                                      setFilterChanged(true);

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
                                      setFilterChanged(true);

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
                                      setFilterChanged(true);

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