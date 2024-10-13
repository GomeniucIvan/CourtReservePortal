import {isNullOrEmpty} from "./Utils.jsx";

export function isFileType(fileName, fileType) {
    if (isNullOrEmpty(fileName) || isNullOrEmpty(fileType)) return false;

    const lowerCaseFileName = fileName.toLowerCase();
    const lowerCaseFileType = fileType.toLowerCase();

    return lowerCaseFileName.endsWith(`.${lowerCaseFileType}`);
}

export const getPdfFileDataUrl = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            //throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const fileBlob = await response.blob();
        const arrayBuffer = await fileBlob.arrayBuffer();

        return  btoa(
            String.fromCharCode(...new Uint8Array(arrayBuffer))
        );
    } catch (err) {

    }
};

export const openPdfInNewTab = (fileUrl) => {
    window.open(fileUrl, '_blank');
};