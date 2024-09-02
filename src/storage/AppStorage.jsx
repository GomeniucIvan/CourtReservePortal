const appLocalStorage = 'courtreserve-online';
const authLocalStorage = 'courtreserve-auth';

export const toLocalStorage = (key, value) => {
    const storedData = JSON.parse(localStorage.getItem(appLocalStorage)) || {};
    storedData[key] = value;
    localStorage.setItem(appLocalStorage, JSON.stringify(storedData));
};

export const fromLocalStorage = (key, defaultValue) => {
    const storedData = JSON.parse(localStorage.getItem(appLocalStorage)) || {};
    return storedData[key] !== undefined ? storedData[key] : defaultValue;
};

export const toAuthLocalStorage = (key, value) => {
    const storedData = JSON.parse(localStorage.getItem(authLocalStorage)) || {};
    storedData[key] = value;
    localStorage.setItem(authLocalStorage, JSON.stringify(storedData));
};

export const fromAuthLocalStorage = (key, defaultValue) => {
    const storedData = JSON.parse(localStorage.getItem(authLocalStorage)) || {};
    return storedData[key] !== undefined ? storedData[key] : defaultValue;
};

export const authMember = () => {
    return fromAuthLocalStorage('member');
}

export const selectedTabStorage = (tabKey, defaultTab) =>{
    return  fromLocalStorage(`tab_${tabKey}`, defaultTab);
}

export const setTabStorage = (tabKey, selectedTab, setFunction) => {
    toLocalStorage(`tab_${tabKey}`, selectedTab);
    setFunction(selectedTab);
}

export const clearAllLocalStorage = () => {
    localStorage.clear();
};