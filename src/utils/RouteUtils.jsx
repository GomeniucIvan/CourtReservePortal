export const setPage = (setDynamicPages,title, path, key) => {
    setDynamicPages([{title: title, path: path}]);
}

export const toRoute = (template, key, value) => {
    const regex = new RegExp(`:${key}`, 'g');
    return template.replace(regex, value);
};