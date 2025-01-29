import {toBoolean} from "@/utils/Utils.jsx";

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

export const setNavigationStorage = (orgId, dashboardData) => {
    const mainMenu = dashboardData.Data.menu;
    const moreMenu = dashboardData.Data.more;
    const listOrg = dashboardData.Data.listOrg;
    const mainLinks = dashboardData.Data.mainLinks;
    const allListItems = dashboardData.Data.allListItems;
    const showUnsubscribeModal = dashboardData.Data.showUnsubscribeModal;
    
    toLocalStorage(`dashboard_main_navigation${orgId}`, mainMenu);
    toLocalStorage(`dashboard_more_navigation${orgId}`, moreMenu);
    toLocalStorage(`dashboard_organizations_${orgId}`, listOrg);
    toLocalStorage(`dashboard_main_actions${orgId}`, mainLinks);
    toLocalStorage(`dashboard_all_list${orgId}`, allListItems);
    toLocalStorage(`data_show_unsubscribe_modal${orgId}`, `${toBoolean(showUnsubscribeModal)}`);
};

export const getNavigationStorage = (orgId) => {
    return fromLocalStorage(`dashboard_main_navigation${orgId}`);
};
export const getMoreNavigationStorage = (orgId) => {
    return fromLocalStorage(`dashboard_more_navigation${orgId}`);
};
export const getMemberOrgList = (orgId) => {
    return fromLocalStorage(`dashboard_organizations_${orgId}`);
};
export const getDashboardMainLinks = (orgId) => {
    return fromLocalStorage(`dashboard_main_actions${orgId}`);
};
export const getDashboardAllLists = (orgId) => {
    return fromLocalStorage(`dashboard_all_list${orgId}`);
};

export const getShowUnsubscribeModal = (orgId) => {
    return fromLocalStorage(`data_show_unsubscribe_modal${orgId}`);
};