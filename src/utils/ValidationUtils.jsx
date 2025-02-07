import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, toBoolean} from "./Utils.jsx";
import {logError} from "./ConsoleUtils.jsx";
import {genderList, matchmakerGenderList} from "./SelectUtils.jsx";
import {countListItems} from "./ListUtils.jsx";
import {dateOfBirthStringToArray, isNonUsCulture} from "./DateUtils.jsx";
import {isCanadaCulture} from "./OrganizationUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormDateOfBirth from "@/form/formdateofbirth/FormDateOfBirth.jsx";
import {Flex} from "antd";
import FormStateProvince from "@/form/formstateprovince/FormStateProvince.jsx";
import React from "react";

export const setFormikError = (t, formik, fieldName, errorKey, error) => {
    if (!isNullOrEmpty(errorKey)){
        let errorToSet = t('common:requiredMessage', {label: errorKey});
        
        if (formik.errors[fieldName] !== errorToSet) {
            formik.setFieldError(fieldName, errorToSet);
            logError(errorToSet);
        }
    } else{
        if (formik.errors[fieldName] !== error) {
            formik.setFieldError(fieldName, error); 
            logError(error);
        }
    }

    if (!formik.touched[fieldName]) {
        formik.setFieldTouched(fieldName, true, false);
    }
}

//TODO REMOVE
export const setFormikErrorN = (formik, fieldName, error) => {
    // Check if the current error for the field is the same as the new error
    if (formik.errors[fieldName] !== error) {
        formik.setFieldError(fieldName, error); // Update the error if it has changed
        logError(error);
    }

    // Ensure the field is marked as touched
    if (!formik.touched[fieldName]) {
        formik.setFieldTouched(fieldName, true, false);
    }
};

export const validateUdfs = (t, formik) => {
    let customFieldKey = false;
    let formikUdfs = formik?.values?.Udfs;

    if (anyInList(formik?.values?.CustomFields)){
        customFieldKey = true;
        formikUdfs = formik?.values?.CustomFields;
    }
    
    if (!anyInList(formikUdfs)) {
        return true;
    }

    let isValid = true;

    for (let i = 0; i < formikUdfs.length; i++) {
        let currentUdf = formikUdfs[i];

        if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
            let fieldName = customFieldKey ? `CustomFields[${i}].Value` : `Udfs[${i}].Value`;
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
            if (currentRatingCategory.AllowMultipleRatingValues) {
                if (!anyInList(currentRatingCategory?.SelectedRatingsIds)){
                    let fieldName = `RatingCategories[${i}].SelectedRatingsIds`;
                    setFormikError(t, formik, fieldName, currentRatingCategory.Name);
                    isValid = false;
                }
            } else{
                if (isNullOrEmpty(currentRatingCategory?.SelectedRatingId)){
                    let fieldName = `RatingCategories[${i}].SelectedRatingId`;
                    setFormikError(t, formik, fieldName, currentRatingCategory.Name);
                    isValid = false;
                }
            }
        }
    }

    return isValid;
};

export const validatePaymentProfile = (t, formik, requireCard, paymentInfoData) => {
    let paymentProvider = paymentInfoData?.PaymentProvider;
    let isUsingCollectJs = paymentInfoData?.IsUsingCollectJs;
    
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
            if (toBoolean(isUsingCollectJs)) {
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

export const validateReservationGuests = (t, formik, reservationMembers, org) => {
    let reservationGuests = formik?.values?.ReservationGuests;

    if (!anyInList(reservationGuests)) {
        return true;
    }

    let isValid = true;

    for (let i = 0; i < reservationGuests.length; i++) {
        let resGuest = reservationGuests[i];

        if (isNullOrEmpty(resGuest.FirstName)) {
            let fieldName = `ReservationGuests[${i}].FirstName`;
            setFormikError(t, formik, fieldName, 'Guest First Name');
            formik.setFieldValue(`ReservationGuests[${i}].Status`, 'error');
            isValid = false;
        }

        if (isNullOrEmpty(resGuest.LastName)) {
            let fieldName = `ReservationGuests[${i}].LastName`;
            setFormikError(t, formik, fieldName, 'Guest Last Name');
            formik.setFieldValue(`ReservationGuests[${i}].Status`, 'error');
            isValid = false;
        }
        
        if (moreThanOneInList(reservationMembers) && isNullOrEmpty(resGuest.GuestOwnerId)){
            if (toBoolean(org?.AllowMembersToChangeGuestOwnerOnMemberPortal)){
                let fieldName = `ReservationGuests[${i}].GuestOwnerId`;
                setFormikError(t, formik, fieldName, 'Guest Owner');
                formik.setFieldValue(`ReservationGuests[${i}].Status`, 'error');
                isValid = false;
            }
        }
    }

    return isValid;
}

export const validatePersonalInformation = (t, formik, form, orgSignup) => {
    let isValidForm = true;

    if (isNullOrEmpty(formik?.values?.FirstName)) {
        setFormikError(t, formik, 'FirstName', t('profile.firstName'));
        isValidForm = false;
    }

    if (isNullOrEmpty(formik?.values?.LastName)) {
        setFormikError(t, formik, 'LastName', t('profile.lastName'));
        isValidForm = false;
    }

    //model org fields type
    if (orgSignup) {
        if (!toBoolean(orgSignup?.IsGenderDisabled) && toBoolean(orgSignup?.IncludeGender) && toBoolean(orgSignup?.IsGenderRequired)) {
            if (isNullOrEmpty(formik?.values?.Gender)) {
                setFormikError(t, formik, 'Gender', t('profile.gender'));
                isValidForm = false;
            }
        }

        if (toBoolean(orgSignup.PhoneNumber?.Include) && toBoolean(orgSignup.PhoneNumber?.IsRequired)){
            if (isNullOrEmpty(formik?.values?.PhoneNumber)) {
                setFormikError(t, formik, 'PhoneNumber', t('profile.phoneNumber'));
                isValidForm = false;
            }
        }

        if (toBoolean(orgSignup.Membership?.Include) && toBoolean(orgSignup.Membership?.IsRequired)){
            if (isNullOrEmpty(formik?.values?.MembershipNumber)) {
                setFormikError(t, formik, 'MembershipNumber', t('profile.membershipNumber'));
                isValidForm = false;
            }
        }

        if (toBoolean(orgSignup.DateOfBirth?.Include) && toBoolean(orgSignup.DateOfBirth?.IsRequired)){
            if (isNullOrEmpty(formik?.values?.DateOfBirthString)) {
                setFormikError(t, formik, 'DateOfBirthString', t('profile.dateOfBirth'));
                isValidForm = false;
            }
        }

        if (toBoolean(orgSignup.Address?.Include) && toBoolean(orgSignup.Address?.IsRequired)){
            if (isNullOrEmpty(formik?.values?.Address)) {
                setFormikError(t, formik, 'Address', t('profile.address'));
                isValidForm = false;
            }

            if (isNullOrEmpty(formik?.values?.City)) {
                setFormikError(t, formik, 'City', t('profile.city'));
                isValidForm = false;
            }

            if (isNullOrEmpty(formik?.values?.State)) {
                setFormikError(t, formik, 'State', t('profile.state'));
                isValidForm = false;
            }
            if (isNullOrEmpty(formik?.values?.ZipCode)) {
                setFormikError(t, formik, 'ZipCode', isNonUsCulture() ? t('profile.postalCode') : t('profile.zipCode'));
                isValidForm = false;
            }
        }

        let isValidRatings = validateRatingCategories(t, formik);
        let isValidUdfs = validateUdfs(t, formik);

        //if any item is selected and not fully filled is not valid date of birth
        let isDateOfBirthValid = validateDateOfBirth(t, formik)
        return isValidForm && isValidRatings && isValidUdfs && isDateOfBirthValid;
    }
    
    //include form
    if (form) {
        if (form.IncludeAddressBlock && form.IsAddressBlockRequired) {
            if (isNullOrEmpty(formik?.values?.StreetAddress)) {
                setFormikError(t, formik, 'StreetAddress', t('profile.address'));
                isValidForm = false;
            }

            if (isNullOrEmpty(formik?.values?.City)) {
                setFormikError(t, formik, 'City', t('profile.city'));
                isValidForm = false;
            }

            if (isNullOrEmpty(formik?.values?.State)) {
                setFormikError(t, formik, 'State', isCanadaCulture(form.UiCulture) ? t('profile.province') : t('profile.state'));
                isValidForm = false;
            }

            if (isNullOrEmpty(formik?.values?.ZipCode)) {
                setFormikError(t, formik, 'ZipCode', isCanadaCulture(form.UiCulture) ? t('profile.postalCode') : t('profile.zipCode'));
                isValidForm = false;
            }
        }

        if (form.IncludePhoneNumberBlock && form.IsPhoneNumberRequired) {
            if (isNullOrEmpty(formik?.values?.PhoneNumber)) {
                setFormikError(t, formik, 'PhoneNumber', t('profile.phoneNumber'));
                isValidForm = false;
            }
        }

        if (form.IncludeDateOfBirthBlock && form.IsDateOfBirthRequired) {
            if (isNullOrEmpty(formik?.values?.DateOfBirthString)) {
                setFormikError(t, formik, 'DateOfBirthString', t('profile.dateOfBirth'));
                isValidForm = false;
            }
        }

        if (form.IncludeMembershipNumber && form.IsMembershipNumberRequired) {
            if (isNullOrEmpty(formik?.values?.MembershipNumber)) {
                setFormikError(t, formik, 'MembershipNumber', t('profile.membershipNumber'));
                isValidForm = false;
            }
        }

        if (form.IncludeGender && form.IsGenderRequired) {
            if (isNullOrEmpty(formik?.values?.Gender)) {
                setFormikError(t, formik, 'Gender', t('profile.gender'));
                isValidForm = false;
            }
        }

        let isValidRatings = validateRatingCategories(t, formik);
        let isValidUdfs = validateUdfs(t, formik);

        //if any item is selected and not fully filled is not valid date of birth
        let isDateOfBirthValid = validateDateOfBirth(t, formik)
        return isValidForm && isValidRatings && isValidUdfs && isDateOfBirthValid;
    }

    return true;
}

export const validateDateOfBirth = (t, formik) => {
    let enteredDateOfBirth = formik?.values?.DateOfBirthString;
    if (isNullOrEmpty(enteredDateOfBirth)) {
        return true;
    }

    let dateOfBirthObject = dateOfBirthStringToArray(enteredDateOfBirth);
    if (isNullOrEmpty(dateOfBirthObject?.day) || isNullOrEmpty(dateOfBirthObject?.month) || isNullOrEmpty(dateOfBirthObject?.year)) {
        //custom message, we don't use setFormikError here
        formik.setFieldError("DateOfBirthString", t('common:requiredMessage', {label: t('profile.date.invalidDateOfBirth')}));
        formik.setFieldTouched("DateOfBirthString", true, false);
        logError(t('common:requiredMessage', {label: t('profile.date.invalidDateOfBirth')}));
        return false;
    }

    return true;
}

export const validateDisclosures = (t, formik, orgSignup) => {
    let isValid = true;
    
    if (anyInList(formik?.values?.disclosures)) {
        formik?.values?.disclosures.forEach((disclosure, index) => {
            if (isNullOrEmpty(disclosure.SignatureDataUrl) || !toBoolean(disclosure.AcceptAgreement)) {
                if (isNullOrEmpty(disclosure.Status)){
                    formik.setFieldValue(`disclosures[${index}].Status`, 'Error');
                }
                isValid = false;
            }
        });
    }

    if (orgSignup && !isNullOrEmpty(orgSignup.Disclosures) && toBoolean(orgSignup.IsDisclosuresRequired) && !toBoolean(formik?.values?.disclosureAgree)) {
       if (isNullOrEmpty(formik?.values?.disclosureAgreeErrorStatus)) {
           formik.setFieldValue(`disclosureAgreeErrorStatus`, 'Error');
       }
        isValid = false;
    }
    
    return isValid;
}

export const validateEventMembersUdfs = (t, formik) => {
    let isValid = true;
    
    let members = formik?.values?.Members;
    
    if (anyInList(members)){
        members.forEach((member, index) => {
            if (toBoolean(member.IsChecked)) {
                if (anyInList(member.MemberUdfs)) {
                    member.MemberUdfs.forEach((currentUdf, udfIndex) => {
                        if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
                            let fieldName = `Members[${index}].MemberUdfs[${udfIndex}].Value`;
                            setFormikError(t, formik, fieldName, currentUdf.Label);
                            isValid = false;
                        }
                    });
                }
            }
        });
    }
    
    return isValid;
}

export const invalidEventGuestsErrors = (t, formik, guestOwnerRequired = false) => {
    let errorList = [];

    let guests = formik?.values?.ReservationGuests;

    if (anyInList(guests)){
        guests.forEach((guest, index) => {

            if (isNullOrEmpty(guest.FirstName)) {
                let fieldName = `ReservationGuests[${index}].FirstName`;
                setFormikError(t, formik, fieldName, 'Guest First Name');
                errorList.push({Error:`First Name is required for Guest #${index+1}`, Index: index, Guid: guest.Guid});
            }

            if (isNullOrEmpty(guest.LastName)) {
                let fieldName = `ReservationGuests[${index}].LastName`;
                setFormikError(t, formik, fieldName, 'Guest Last Name');
                errorList.push({Error:`Last Name is required for Guest #${index+1}`, Index: index, Guid: guest.Guid});
            }

            if (toBoolean(guestOwnerRequired) && isNullOrEmpty(guest.GuestOwnerId)){
                let fieldName = `ReservationGuests[${index}].GuestOwnerId`;
                setFormikError(t, formik, fieldName, 'Guest Owner');
                errorList.push({Error:`Guest Owner is required for Guest #${index+1}`, Index: index, Guid: guest.Guid});
            }
            
            if (anyInList(guest.MemberUdfs)) {
                guest.MemberUdfs.forEach((currentUdf, udfIndex) => {
                    if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
                        let fieldName = `ReservationGuests[${index}].MemberUdfs[${udfIndex}].Value`;
                        setFormikError(t, formik, fieldName, currentUdf.Label);
                        errorList.push({Error:`${currentUdf.Label} is required for Guest #${index+1}`, Index: index, Guid: guest.Guid});
                    }
                });
            }
        });
    }

    return errorList;
}

export const validateJoinFamilyMembers = (t, formik, signupData) => {
    let isValid = true;

    let familyMembers = formik?.values?.FamilyMembers;

    if (anyInList(familyMembers)){
        familyMembers.forEach((familyMember, index) => {

            if (familyMember.Register ) {
                if (toBoolean(signupData.IsGenderRequired) &&toBoolean(signupData?.IncludeGender)) {
                    if (isNullOrEmpty(familyMember.Gender)){
                        let fieldName = `FamilyMembers[${index}].Gender`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.gender`));
                        isValid = false;
                    }
                }

                if (toBoolean(signupData.IncludePhoneNumberBlock) &&toBoolean(signupData?.IsPhoneNumberRequired)) {
                    if (isNullOrEmpty(familyMember.PhoneNumber)){
                        let fieldName = `FamilyMembers[${index}].PhoneNumber`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.phoneNumber`));
                        isValid = false;
                    }
                }

                if (toBoolean(signupData.IncludeMembershipNumber) &&toBoolean(signupData?.IsMembershipNumberRequired)) {
                    if (isNullOrEmpty(familyMember.MembershipNumber)){
                        let fieldName = `FamilyMembers[${index}].MembershipNumber`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.membershipNumber`));
                        isValid = false;
                    }
                }


                if (toBoolean(signupData.IncludeDateOfBirthBlock) &&toBoolean(signupData?.IsDateOfBirthRequired)) {
                    if (isNullOrEmpty(familyMember.DateOfBirthString)){
                        let fieldName = `FamilyMembers[${index}].DateOfBirthString`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.dateOfBirth`));
                        isValid = false;
                    }
                }

                if (toBoolean(signupData.IncludeAddressBlock) &&toBoolean(signupData?.IsAddressBlockRequired)) {
                    if (isNullOrEmpty(familyMember.Address)){
                        let fieldName = `FamilyMembers[${index}].Address`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.streetAddress`));
                        isValid = false;
                    }
                    if (isNullOrEmpty(familyMember.City)){
                        let fieldName = `FamilyMembers[${index}].City`;
                        setFormikError(t, formik, fieldName, t(`additionalInfo.form.city`));
                        isValid = false;
                    }
                    if (isNullOrEmpty(familyMember.State)){
                        let fieldName = `FamilyMembers[${index}].State`;
                        setFormikError(t, formik, fieldName, isCanadaCulture(signupData.UiCulture) ? t(`province`) : t('state'));
                        isValid = false;
                    }

                    if (isNullOrEmpty(familyMember.ZipCode)){
                        let fieldName = `FamilyMembers[${index}].ZipCode`;
                        setFormikError(t, formik, fieldName, isNonUsCulture(signupData.UiCulture) ? t(`additionalInfo.form.postalCode`) : t(`additionalInfo.form.zipCode`));
                        isValid = false;
                    }
                }

                if (anyInList(familyMember.Udfs)) {
                    familyMember.Udfs.forEach((currentUdf, udfIndex) => {
                        if (toBoolean(currentUdf?.IsRequired) && !currentUdf?.Value?.trim()) {
                            let fieldName = `FamilyMembers[${index}].Udfs[${udfIndex}].Value`;
                            setFormikError(t, formik, fieldName, currentUdf.Label);
                            isValid = false;
                        }
                    });
                }
                
                if (anyInList(familyMember.RatingCategories)){
                    familyMember.RatingCategories.forEach((currentRatingCategory, ratingIndex) => {
                        if (toBoolean(currentRatingCategory?.IsRequired)) {
                            if (currentRatingCategory.AllowMultipleRatingValues) {
                                if (!anyInList(currentRatingCategory?.SelectedRatingsIds)){
                                    let fieldName = `FamilyMembers[${index}].RatingCategories[${ratingIndex}].SelectedRatingsIds`;
                                    setFormikError(t, formik, fieldName, currentRatingCategory.Name);
                                    isValid = false;
                                }
                            } else{
                                if (isNullOrEmpty(currentRatingCategory?.SelectedRatingId)){
                                    let fieldName = `FamilyMembers[${index}].RatingCategories[${ratingIndex}].SelectedRatingId`;
                                    setFormikError(t, formik, fieldName, currentRatingCategory.Name);
                                    isValid = false;
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    return isValid;
}