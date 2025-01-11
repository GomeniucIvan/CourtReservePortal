import {equalString, isNullOrEmpty} from "./Utils.jsx";

export const isValidJson = (jsonString) => {
    if (isNullOrEmpty(jsonString)){
        return false;
    }
    
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        console.error('Invalid JSON:', error);
        return false;
    }
};

export const stringToJson = (incString) => {
    if (isValidJson(incString)) {
        return JSON.parse(incString);
    }
    
    return [];
}

export const emptyArray = (count = 20) => {
    return Array(count).fill({});
}

export const countListItems = (list) => {
    if (isNullOrEmpty(list)){
        list = [];
    }
    
    return list.length;
}

export const schedulerSlotIntersects = (item, events) => {
    const itemStart = new Date(item.start).getTime();
    const itemEnd = new Date(item.end).getTime();

    return events.some(event => {
        const eventStart = new Date(event.start).getTime();
        const eventEnd = new Date(event.end).getTime();

        return (
           equalString(event?.dataItem?.CourtId, item.group?.resources[0]?.Id) &&
            ((itemStart >= eventStart && itemStart < eventEnd) || // Item starts during the event
                (itemEnd > eventStart && itemEnd <= eventEnd) ||    // Item ends during the event
                (itemStart <= eventStart && itemEnd >= eventEnd) || // Item fully overlaps the event
                (eventStart < itemEnd && eventEnd > itemStart))      // Event fully overlaps the item)
        );
    });
};