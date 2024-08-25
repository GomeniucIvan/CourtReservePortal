export const last = (arr) => arr[arr.length - 1];

export const toFlatGroupResources = (resources, index = 0, depth = 0, parents = []) => {
    if (resources.length <= index) { return [parents]; }

    let result = [];
    resources[index].data.map((item) => {
        result.push(
            ...toFlatGroupResources(
                resources,
                index + 1,
                depth + 1,
                [...parents, {
                    ...item,
                    field: resources[index].field,
                    valueField: resources[index].valueField,
                    colorField: resources[index].colorField,
                    multiple: resources[index].multiple
                }]));
    });

    return result;
};


export const calculateEventRect = (slots, vertical) => {
    // console.log(slots.length && slots[0]);
    if (slots.length < 1 || !slots[0]._ref || !slots[0]._ref.current) { return null; }
    const firstSlotRect = getRect(slots[0]._ref.current.element);

    const rect = {
        top: firstSlotRect.top,
        left: firstSlotRect.left,
        right: firstSlotRect.right,
        width: firstSlotRect.width,
        height: 0
    };

    slots.forEach((slot) => {
        if (!slot._ref.current) { return; }
        const { height } = getRect(slot._ref.current.element);

        if (height !== undefined) {
            if (!vertical && height >= rect.height) {
                rect.height = height;
            } else {
                rect.height += height;
            }
        }
    });

    return rect;
};

export function toGroupResources(group, resources) {
    const result = [];

    if (!resources || !resources.length) { return result; }

    if (group && group.resources && group.resources.length) {
        const groups = group.resources;
        for (let idx = 0; idx < groups.length; idx++) {
            const resource = resources.find(r => r.name === groups[idx]);
            result.push(resource);
        }
    }

    return result;
}

export function addUTCDays(date, offset) {
    const newDate = new Date(date.getTime());

    newDate.setUTCDate(newDate.getUTCDate() + offset);

    return newDate;
}


export const expandResources = (resources, lastIndex = resources.length - 1) => {
    const currentLastIndex = Math.max(0, lastIndex);
    const data = [];

    if (!(resources && resources.length)) {
        resources = [{}];
    }

    const lastData = (resources[currentLastIndex].data || []).map((d) => ({ ...d, text: d[resources[currentLastIndex].textField] })) || [];
    const length = lastData.length;

    let count = 1;
    for (let idx = 0; idx <= currentLastIndex; idx++) {
        count *= (resources[idx].data || []).length || 1;
    }

    for (let idx = 0; idx < count; idx++) {
        if (lastData[idx % length]) {
            data.push(lastData[idx % length]);
        }
    }

    return data;
};

/**
 * @hidden
 */
export const resourcesByIndex = (index, taskResources, spans) => {
    // TODO: introduce cache mechanism
    // if (!this.resourcesCache[index]) {
    const resources = taskResources;
    const result = [];
    let currentIndex = index;

    for (let idx = 0; idx < resources.length; idx++) {
        const data = resources[idx].data || [];
        const dataIdx = Math.floor(currentIndex / spans[idx]);
        result.push(data[dataIdx]);
        currentIndex -= dataIdx * spans[idx];
    }

    return result;
};

/** @hidden */
export const getRect = (el) => {
    if (!el) { return { top: 0, left: 0, width: 0, height: 0, right: 0 }; }
    const top = el.offsetTop;
    const left = el.offsetLeft;
    const right = el.offsetParent ? (el.offsetParent).offsetWidth - (el.offsetLeft + el.offsetWidth) : 0;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    return {
        top,
        left,
        right,
        width,
        height
    };
};

export const getPadding = (el, horizontal = false) => {
    return parseFloat(window.getComputedStyle(el)[horizontal ? 'paddingLeft' : 'paddingTop'] || '0')
        + parseFloat(window.getComputedStyle(el)[horizontal ? 'paddingRight' : 'paddingBottom'] || '0');
};

export const getBorders = (el, horizontal = false) => {
    return parseFloat(window.getComputedStyle(el)[horizontal ? 'borderLeftWidth' : 'borderTopWidth'] || '0')
        + parseFloat(window.getComputedStyle(el)[horizontal ? 'borderRightWidth' : 'borderBottomWidth'] || '0');
};

export const setRect = (el, rect, minHeightInsteadOfHeight = false) => {
    if (!el) { return; }

    if (rect.top !== undefined) {
        el.style.top = `${rect.top}px`;
    }
    if (rect.left !== undefined) {
        el.style.left = `${rect.left}px`;
    }
    if (rect.width !== undefined) {
        el.style.width = `${rect.width}px`;
    }
    if (rect.height !== undefined && !minHeightInsteadOfHeight) {
        el.style.height = typeof rect.height === 'number' ? `${rect.height}px` : rect.height;
    }
    if (minHeightInsteadOfHeight) {
        el.style.minHeight = rect.height !== undefined && rect.height > 0 ? `${rect.height}px` : '';
    }
};
