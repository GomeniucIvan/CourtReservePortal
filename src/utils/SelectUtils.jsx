const genders = () => {
    let list = [];
    list.push({Text: "None", Value: 'None'});
    list.push({Text: "Male", Value: 'Female'});
    list.push({Text: "Female", Value: 'Female'});
    list.push({Text: "Prefer not to disclose", Value: 'PND'});
    return list;
}

export const genderList = genders();