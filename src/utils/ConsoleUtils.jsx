﻿import {isNullOrEmpty} from "./Utils.jsx";

const styles = {
    red: 'color: red; font-weight: bold;',
    green: 'color: green; font-weight: bold;',
    blue: 'color: #71bec4; font-weight: bold;',
    yellow: 'color: orange; font-weight: bold;',
    gray: 'color: gray; font-weight: bold;',
};

const consoleIcons = {
    error: '❌',
    success: '✅',
    info: 'ℹ️',
    warning: '⚠️',
    debug: '🐛',
    loading: '⏳',
    completed: '✔️',
    failed: '❗',
    start: '▶️',
    stop: '⏹️',
    pause: '⏸️',
    resume: '⏯️',
    question: '❓',
    critical: '💥',
    network: '🌐',
    database: '🗄️',
    file: '📁',
    email: '📧',
    user: '👤',
    settings: '⚙️',
    formikError: '🛑',
};

export const logError = (message) => {
    console.warn(`%c${consoleIcons.error} ${message}`, styles.red);
    console.log(message);
};

export const logSuccess = (message) => {
    console.log(`%c${consoleIcons.success} ${message}`, styles.green);
};

export const logCritical = (message) => {
    console.log(`%c${consoleIcons.critical} ${message}`, styles.green);
};

export const logDebug = (message) => {
    console.log(`%c${consoleIcons.debug} ${message}`, styles.green);
};
export const logInfo = (message) => {
    console.log(`%c${consoleIcons.success}`, styles.blue)
    console.log(message);
};
export const logNetwork = (message) => {
    console.log(`%c${consoleIcons.network} ${message}`, styles.blue);
};

export const logWarning = (message) => {
    console.warn(`%c${consoleIcons.warning} ${message}`, styles.yellow);
};

export const logFormikErrors = () => {
    console.log(`%c${consoleIcons.formikError} Formik Errors:`, styles.gray);
};