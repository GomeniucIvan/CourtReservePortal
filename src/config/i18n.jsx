import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {fromLocalStorage} from "../storage/AppStorage.jsx";

async function loadResources() {
    const resources = {};

    const modules = import.meta.glob('../locales/**/*.json', { eager: true });

    for (const path in modules) {
        const match = path.match(/..\/locales\/(.+)\/(.+)\.json$/);
        if (match) {
            const lang = match[1];
            const namespace = match[2];

            if (!resources[lang]) {
                resources[lang] = {};
            }

            resources[lang][namespace] = modules[path].default || modules[path];
        }
    }

    return resources;
}

async function initI18next() {
    const resources = await loadResources(); 
    const storageLanguage = fromLocalStorage("language_seo", 'en');

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: storageLanguage,
            fallbackLng: storageLanguage, 
            interpolation: {
                escapeValue: false,
            },
            ns: Object.keys(resources['en'] || {}),
            defaultNS: 'common',
        });
}

initI18next(); 

export default i18n;