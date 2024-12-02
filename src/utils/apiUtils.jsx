import {isNullOrEmpty} from "./Utils.jsx";

export const fixResponseData = (response) => {
    if (response){
        if (response.isValid){
            response.IsValid = response.isValid;
        }
        if (response.IsValid){
            response.isValid = response.IsValid;
        }

        if (response.message && isNullOrEmpty(response.Message)){
            response.Message = response.message;
        }
        if (response.Message && isNullOrEmpty(response.message)){
            response.message = response.Message;
        }
        if (isNullOrEmpty(response.Data) && !isNullOrEmpty(response.data)){
            response.Data = response.data;
        }
    }

    return response;
}