import {isNullOrEmpty} from "./Utils.jsx";

const styles = {
    red: 'color: red; font-weight: bold;',
    green: 'color: green; font-weight: bold;',
    blue: 'color: blue; font-weight: bold;',
    yellow: 'color: orange; font-weight: bold;',
    gray: 'color: gray; font-weight: bold;',
};

const icons = {
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
    console.error(`%c${icons.error} ${message}`, styles.red);
};

export const logSuccess = (message) => {
    console.log(`%c${icons.success} ${message}`, styles.green);
};


export const logInfo = (message) => {
    if (!isNullOrEmpty(message)){
        console.info(`%c${icons.info}`, styles.blue);
        console.log(message);   
    }
};


export const logWarning = (message) => {
    console.warn(`%c${icons.warning} ${message}`, styles.yellow);
};

export const logFormikErrors = (errors) => {
    console.log(`%c${icons.formikError} Formik Errors:`, styles.gray);
    console.log(errors);
};