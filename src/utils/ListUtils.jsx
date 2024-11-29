import {isNullOrEmpty} from "./Utils.jsx";

const isValidJson = (jsonString) => {
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

export const getRatingCategoriesList = (form, prefix) => {
    prefix = isNullOrEmpty(prefix) ? 'rat_' : prefix;
    const ratingCategories = [];

    Object.keys(form).forEach(key => {
        if (key.startsWith(prefix)) {
            const id = parseInt(key.slice(prefix.length), 10);

            ratingCategories.push({ Id: id, Value: form[key], SelectedRatingId: form[key], SelectedRatingsIds: form[key] });
        }
    });

    return ratingCategories;
};

export const getUserDefinedFieldsList = (form, prefix) => {
    prefix = isNullOrEmpty(prefix) ? 'udf_' : prefix;
    const userDefinedFields = [];

    Object.keys(form).forEach(key => {
        if (key.startsWith(prefix)) {
            const id = parseInt(key.slice(prefix.length), 10);
            userDefinedFields.push({ Id: id, Value: form[key] });
        }
    });

    return userDefinedFields;
};

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
            (itemStart >= eventStart && itemStart < eventEnd) || // Item starts during the event
            (itemEnd > eventStart && itemEnd <= eventEnd) ||    // Item ends during the event
            (itemStart <= eventStart && itemEnd >= eventEnd) || // Item fully overlaps the event
            (eventStart < itemEnd && eventEnd > itemStart)      // Event fully overlaps the item
        );
    });
};