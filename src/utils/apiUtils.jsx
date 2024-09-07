export const fixResponseData = (response) => {
    if (response){
        if (response.isValid){
            response.IsValid = response.isValid;
        }
        if (response.IsValid){
            response.isValid = response.IsValid;
        }

        if (response.message){
            response.Message = response.message;
        }
        if (response.Message){
            response.message = response.Message;
        }
    }

    return response;
}