import {isNullOrEmpty} from "./Utils.jsx";

export const extractTextFromHTML = (html, maxCharacters) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let text = tempDiv.textContent || tempDiv.innerText || '';
    if (maxCharacters && text.length > maxCharacters) {
        text = text.substring(0, maxCharacters) + '...';
    }
    return text;
}

export const isNullOrEmptyHtmlCode = (textToCheck) => {
    try {
        if (isNullOrEmpty(textToCheck)){
            return true;
        }
        if (!textToCheck || textToCheck.trim() === "") {
            return true;
        }

        if (textToCheck.includes("<img")) {
            return false;
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(textToCheck, 'text/html');
        let result = doc.body.textContent || ""; // Get the inner text from the HTML

        // Remove specific HTML entities and any remaining whitespace
        result = result
            .replace(/&nbsp;/g, "")
            .replace(/&ndash;/g, "")
            .replace(/&amp;/g, "")
            .replace(/\s/g, "");

        // Return true if result is empty, meaning the HTML content is essentially "empty"
        return result === "";
    } catch (error) {
        // If an error occurs, consider it as empty content
        return true;
    }
}