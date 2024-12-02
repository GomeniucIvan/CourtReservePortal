import {anyInList, equalString, isNullOrEmpty, toBoolean} from "./Utils.jsx";
import {logError} from "./ConsoleUtils.jsx";
import * as Yup from "yup";
import {requiredMessage} from "./TranslateUtils.jsx";
import {any} from "prop-types";
import {matchmakerGenderList} from "./SelectUtils.jsx";
import {countListItems} from "./ListUtils.jsx";
import FormSelect from "../form/formselect/FormSelect.jsx";
import React from "react";

export const setFormikError = (t, formik, fieldName, errorKey, error) => {
    if (!isNullOrEmpty(errorKey)){
        formik.setFieldError(fieldName, t('common:requiredMessage', {label: errorKey}));
        logError(t('common:requiredMessage', {label: errorKey}));
    } else{
        formik.setFieldError(fieldName, error);
        logError(error);
    }
    
    formik.setFieldTouched(fieldName, true, false);
}

export const validateUdfs = (t, formik) => {
    let formikUdfs = formik?.values?.Udfs;

    if (!anyInList(formikUdfs)) {
        return true;
    }

    let isValid = true;

    for (let i = 0; i < formikUdfs.length; i++) {
        let currentUdf = formikUdfs[i];

        if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
            let fieldName = `Udfs[${i}].Value`;
            setFormikError(t, formik, fieldName, currentUdf.Label);
            isValid = false; 
        }
    }

    return isValid;
};

export const validateRatingCategories = (t, formik) => {
    let ratingCategories = formik?.values?.RatingCategories;

    if (!anyInList(ratingCategories)) {
        return true;
    }
    
    let isValid = true;

    for (let i = 0; i < ratingCategories.length; i++) {
        let currentRatingCategory = ratingCategories[i];

        if (toBoolean(currentRatingCategory?.IsRequired)) {
            if (category.AllowMultipleRatingValues) {
                if (!anyInList(category?.SelectedRatingsIds)){
                    let fieldName = `RatingCategories[${i}].SelectedRatingsIds`;
                    setFormikError(t, formik, fieldName, category.Name);
                    isValid = false;
                }
            } else{
                if (isNullOrEmpty(category?.SelectedRatingId)){
                    let fieldName = `RatingCategories[${i}].SelectedRatingId`;
                    setFormikError(t, formik, fieldName, category.Name);
                    isValid = false;
                }
            }
        }
    }

    return isValid;
};

export const validatePaymentProfile = (t, formik, requireCard) => {
    let paymentProvider = formik?.values?.paymentProvider;
    let isValid = true;
    
    if (requireCard) {
        let formikValues = formik?.values;
        
        //default card details
        if (isNullOrEmpty(formikValues?.card_firstName)) {
            setFormikError(t, formik, 'card_firstName', t('common:paymentProfile.firstName'));
            isValid = false;
        }

        if (isNullOrEmpty(formikValues?.card_lastName)) {
            setFormikError(t, formik, 'card_lastName', t('common:paymentProfile.lastName'));
            isValid = false;
        }

        if (isNullOrEmpty(formikValues?.card_accountType)) {
            setFormikError(t, formik, 'card_accountType', t('common:paymentProfile.accountType'));
            isValid = false;
        }


        //CardConnect
        if (equalString(paymentProvider, 1)) {
            //invalid card should be allowed to submit we will throw message on response api(card-connect tokenr response)

            if (isNullOrEmpty(formikValues?.card_number)) {
                setFormikError(t, formik, 'card_number', t('common:paymentProfile.cardNumber'));
                isValid = false;
            }

            if (isNullOrEmpty(formikValues?.card_expiryDate)) {
                setFormikError(t, formik, 'card_expiryDate', t('common:paymentProfile.expiryDate'));
                isValid = false;
            }

            if (isNullOrEmpty(formikValues?.card_securityCode)) {
                setFormikError(t, formik, 'card_securityCode', t('common:paymentProfile.securityCode'));
                isValid = false;
            }

            if (isNullOrEmpty(formikValues?.card_country)) {
                setFormikError(t, formik, 'card_country', t('common:paymentProfile.country'));
                isValid = false;
            }
        }

        //Stripe
        if (equalString(paymentProvider, 2)) {
            if (equalString(formikValues?.card_accountType, 1)){
                //validating with token generation
                //for card details on post validation Stripe
            }
            
            //eCheck
            if (equalString(formikValues?.card_accountType, 2)) {
                if (isNullOrEmpty(formikValues?.card_routingNumber)) {
                    setFormikError(t, formik, 'card_routingNumber', t('common:paymentProfile.routingNumber'));
                    isValid = false;
                }
                if (isNullOrEmpty(formikValues?.card_accountNumber)) {
                    setFormikError(t, formik, 'card_accountNumber', t('common:paymentProfile.accountNumber'));
                    isValid = false;
                }
            }
        }

        //SafeSave
        if (equalString(paymentProvider, 3)) {
            if (toBoolean(formik?.values?.isUsingCollectJs)) {
                //validate by iframe response
            } else {
                
                //card
                if (equalString(formikValues?.card_accountType, 1)) {
                    if (isNullOrEmpty(formikValues?.card_number)) {
                        setFormikError(t, formik, 'card_number', t('common:paymentProfile.cardNumber'));
                        isValid = false;
                    }

                    if (isNullOrEmpty(formikValues?.card_expiryDate)) {
                        setFormikError(t, formik, 'card_number', t('common:paymentProfile.expiryDate'));
                        isValid = false;
                    }

                    if (isNullOrEmpty(formikValues?.card_securityCode)) {
                        setFormikError(t, formik, 'card_number', t('common:paymentProfile.securityCode'));
                        isValid = false;
                    }
                }

                //eCheck
                if (equalString(formikValues?.card_accountType, 2)) {
                    if (isNullOrEmpty(formikValues?.card_routingNumber)) {
                        setFormikError(t, formik, 'card_routingNumber', t('common:paymentProfile.routingNumber'));
                        isValid = false;
                    }
                    if (isNullOrEmpty(formikValues?.card_accountNumber)) {
                        setFormikError(t, formik, 'card_accountNumber', t('common:paymentProfile.accountNumber'));
                        isValid = false;
                    }
                }
            }
        }

        if (equalString(paymentProvider, 4)) {
            //Fortis
        }
    }

    return isValid;
}

export const validateReservationMatchMaker = (t, formik, matchMakerData, returnListValues, preventTouch) => {
    let isValid = true;
    let items = [];
    
    if (toBoolean(formik?.values?.IsOpenReservation)) {
        if (anyInList(matchMakerData?.ActiveSportTypes) && toBoolean(matchMakerData?.HasDifferentSportTypes)) {
            if (isNullOrEmpty(formik?.values?.SportTypeId)){
                if (!preventTouch){
                    setFormikError(t, formik, 'SportTypeId', t('reservation:form.sportTypeId'));
                }

                isValid = false;
                items.push({Text: t('reservation:form.sportTypeId'), Value: null})
            } else{
                let selectedSportType = matchMakerData.ActiveSportTypes.find(v => equalString(v.Id, formik?.values?.SportTypeId));
                items.push({Text: t('reservation:form.sportTypeId'), Value: selectedSportType?.Name})
            }
        }

        if (anyInList(matchMakerData?.MatchMakerTypes) && toBoolean(matchMakerData?.IsMatchTypeEnabled)) {
            if (isNullOrEmpty(formik?.values?.MatchMakerTypeId)){
                if (!preventTouch){
                    setFormikError(t, formik, 'MatchMakerTypeId', t('reservation:form.matchMakerTypeId'));
                }

                isValid = false;
                items.push({Text: t('reservation:form.matchMakerTypeId'), Value: null})
            } else{
                let selectedType = matchMakerData.MatchMakerTypes.find(v => equalString(v.Id, formik?.values?.MatchMakerTypeId));
                items.push({Text: t('reservation:form.matchMakerTypeId'), Value: selectedType?.Name})
            }
        }
        
        if (toBoolean(matchMakerData.IsMatchTypeEnabled) && anyInList(matchMakerData?.MatchMakerTypes)) {
            if (isNullOrEmpty(formik?.values?.MatchMakerTypeId)){
                if (!preventTouch){
                    setFormikError(t, formik, 'MatchMakerTypeId', t('reservation:form.matchMakerTypeId'));
                }
                isValid = false;
                items.push({Text: t('reservation:form.matchMakerTypeId'), Value: null})
            } else {
                let matchMakerType = matchMakerData.MatchMakerTypes.find(v => equalString(v.Id, formik?.values?.MatchMakerTypeId));
                items.push({Text: t('reservation:form.matchMakerTypeId'), Value: matchMakerType?.Name})
            }
        }

        if (toBoolean(matchMakerData.IsGenderCriteriaMatch)) {
            if (isNullOrEmpty(formik?.values?.MatchMakerGender)) {
                if (!preventTouch) {
                    setFormikError(t, formik, 'MatchMakerGender', t('reservation:form.matchMakerGender'));
                }

                isValid = false;
                items.push({Text: t('reservation:form.matchMakerGender'), Value: null})
            } else {
                let selectedGender = matchmakerGenderList.find(v => equalString(v.Value, formik?.values?.MatchMakerGender));
                items.push({Text: t('reservation:form.matchMakerGender'), Value: selectedGender?.Text})
            }
        }

        if (anyInList(matchMakerData?.MatchMakerRatingCategoryRatingIds)) {

        }

        if (anyInList(matchMakerData?.MemberGroupIds)) {
            if (!anyInList(formik?.values?.MatchMakerMemberGroupIds)){
                if (!preventTouch) {
                    setFormikError(t, formik, 'MemberGroupIds', t('reservation:form.matchMakerMemberGroupIds'));
                }
                
                isValid = false;
                items.push({Text: t('reservation:form.matchMakerMemberGroupIds'), Value: null})
            } else {
                items.push({Text: t('reservation:form.matchMakerMemberGroupIds'), Value: `${countListItems(formik?.values?.MatchMakerMemberGroupIds)} group(s)`})
            }
        }
        
        if (isNullOrEmpty(formik?.values?.MatchMakerMinNumberOfPlayers)) {
            if (!preventTouch) {
                setFormikError(t, formik, 'MatchMakerMinNumberOfPlayers', t('reservation:form.matchMakerMinNumberOfPlayers'));
            }

            isValid = false;
            items.push({Text: t('reservation:form.matchMakerMinNumberOfPlayers'), Value: null})
        } else {
            items.push({Text: t('reservation:form.matchMakerMinNumberOfPlayers'), Value: formik?.values?.MatchMakerMinNumberOfPlayers})
        }

        if (isNullOrEmpty(formik?.values?.MatchMakerMaxNumberOfPlayers)){
            if (!preventTouch) {
                setFormikError(t, formik, 'MatchMakerMaxNumberOfPlayers', t('reservation:form.matchMakerMaxNumberOfPlayers'));
            }

            isValid = false;
            items.push({Text: t('reservation:form.matchMakerMaxNumberOfPlayers'), Value: null})
        } else {
            items.push({Text: t('reservation:form.matchMakerMinNumberOfPlayers'), Value: formik?.values?.MatchMakerMaxNumberOfPlayers})
        }
        
        if (toBoolean(matchMakerData?.IsAgeCriteriaMatch)) {
            if (isNullOrEmpty(formik?.values?.MatchMakerMinAge)){
                if (!preventTouch) {
                    setFormikError(t, formik, 'MatchMakerMinAge', t('reservation:form.matchMakerMinAge'));
                }

                isValid = false;
            }
            if (isNullOrEmpty(formik?.values?.IsAgeCriteriaMatch)) {
                if (!preventTouch) {
                    setFormikError(t, formik, 'MatchMakerMaxAge', t('reservation:form.matchMakerMaxAge'));
                }

                isValid = false;
            }
            
            if (!isNullOrEmpty(formik?.values?.MatchMakerMinAge) && !isNullOrEmpty(formik?.values?.MatchMakerMaxAge)){
                items.push({Text: t('reservation:form.matchMakerMinMaxAgeLabel'), Value: `Min ${formik?.values?.MatchMakerMinAge}/Max ${formik?.values?.MatchMakerMaxAge}`})
            } else if (!isNullOrEmpty(formik?.values?.MatchMakerMinAge)){
                items.push({Text: t('reservation:form.matchMakerMinAge'), Value: `Min ${formik?.values?.MatchMakerMinAge}`})
            } else if (!isNullOrEmpty(formik?.values?.MatchMakerMaxAge)){
                items.push({Text: t('reservation:form.MatchMakerMaxAge'), Value: `Max ${formik?.values?.MatchMakerMaxAge}`})
            } else{
                items.push({Text: t('reservation:form.matchMakerMinMaxAgeLabel'), Value: null})  
            }
        }
        
        if (toBoolean(formik?.values?.MatchMakerIsPrivateMatch)){
            if (isNullOrEmpty(formik?.values?.MatchMakerJoinCode)) {
                if (!preventTouch) {
                    setFormikError(t, formik, 'MatchMakerJoinCode', t('reservation:form.matchMakerJoinCode'));
                }

                isValid = false;
                items.push({Text: t('reservation:form.matchMakerJoinCode'), Value: null})
            } else {
                items.push({Text: t('reservation:form.matchMakerJoinCode'), Value: formik?.values?.MatchMakerJoinCode})
            }
        }
    }
    
    if (returnListValues){
        return items;
    }
    return isValid;
}
