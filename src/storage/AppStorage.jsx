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
    return fromLocalStorage(`tab_${tabKey}`, defaultTab);
}

export const removeTabStorage = (tabKey) =>{
    return toLocalStorage(`tab_${tabKey}`, '');
}

export const setTabStorage = (tabKey, selectedTab, setFunction) => {
    toLocalStorage(`tab_${tabKey}`, selectedTab);
    if (typeof setFunction == 'function'){
        setFunction(selectedTab);   
    }
}

export const clearAllLocalStorage = () => {
    localStorage.clear();
};

export const setNavigationStorage = (orgId, mainMenu, moreMenu, listOrg) => {
    toLocalStorage(`navigation_${orgId}`, mainMenu);
    toLocalStorage(`morenavigation_${orgId}`, moreMenu);
    toLocalStorage(`navigationorgs_${orgId}`, listOrg);
};

export const getNavigationStorage = (orgId) => {
    return fromLocalStorage(`navigation_${orgId}`);
};
export const getMoreNavigationStorage = (orgId) => {
    return fromLocalStorage(`morenavigation_${orgId}`);
};
export const getMemberOrgList = (orgId) => {
    return fromLocalStorage(`navigationorgs_${orgId}`);
};