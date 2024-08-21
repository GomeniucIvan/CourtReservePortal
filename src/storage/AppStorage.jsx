const appLocalStorage = 'courtreserve-online';

export const toLocalStorage = (key, value) => {
    const storedData = JSON.parse(localStorage.getItem(appLocalStorage)) || {};
    storedData[key] = value;
    localStorage.setItem(appLocalStorage, JSON.stringify(storedData));
};

export const fromLocalStorage = (key, defaultValue) => {
    const storedData = JSON.parse(localStorage.getItem(appLocalStorage)) || {};
    return storedData[key] !== undefined ? storedData[key] : defaultValue;
};