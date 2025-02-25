let historyStack = [];

const removeConsecutiveDuplicates = (array) => {
    // Check if the array is empty or has only one element
    if (array.length <= 1) {
        return array;
    }

    const result = [array[0]]; // Start with the first element

    for (let i = 1; i < array.length; i++) {
        if (array[i].path !== array[i - 1].path) {
            result.push(array[i]);
        }
    }

    return result;
};

export const pushToHistory = (path, isRoot) => {
    if (isRoot){
        historyStack = [];
    } else{
        historyStack.push({ path: path, isRoot: isRoot });
        historyStack = removeConsecutiveDuplicates(historyStack); 
    }
};

export const getLastFromHistory = () => {
    if (historyStack.length > 1) {
        const newHistoryStack = historyStack.slice(0, -1);
        const lastItem = newHistoryStack[newHistoryStack.length - 1];
        historyStack = newHistoryStack;
        return lastItem;
    }

    // Return null if there's only one page or the stack is empty
    return null;
};

export const getLastFromHistoryPath = () => {
    if (historyStack.length > 1) {
        const newHistoryStack = historyStack.slice(0, -1);
        const lastItem = newHistoryStack[newHistoryStack.length - 1];
        historyStack = newHistoryStack;
        return lastItem?.path || '/';
    }

    // Return null if there's only one page or the stack is empty
    return '/';
};

export const navigationClearHistory = () => {
    historyStack = [];
};

export const getHistory = () => {
    return historyStack;
};

export const removeLastHistoryEntry = () => {
    if (historyStack.length > 0) {
        historyStack.pop(); 
    }
};