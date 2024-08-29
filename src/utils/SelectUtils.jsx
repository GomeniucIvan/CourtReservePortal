const genders = () => {
    let list = [];
    list.push({Text: "None", Value: 0});
    list.push({Text: "Male", Value: 1});
    list.push({Text: "Female", Value: 2});
    list.push({Text: "Prefer not to disclose", Value: 2});
    return list;
}

export const genderList = genders();