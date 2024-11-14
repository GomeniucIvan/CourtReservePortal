import { getData } from 'country-list';

export const getAllCountries = (filterByIsoCodes = null, onlineArea = false) =>{

    let countries = getData().map(country => ({
        Code: country.code,
        Name: country.name,
    }));

    if (filterByIsoCodes && filterByIsoCodes.length) {
        countries = countries.filter(country => filterByIsoCodes.includes(country.Code));
    }

    const uniqueCountries = Array.from(new Set(countries.map(c => c.Code)))
        .map(code => countries.find(c => c.Code === code));

    if (onlineArea) {
        const usa = uniqueCountries.find(c => c.Code === 'US');
        const canada = uniqueCountries.find(c => c.Code === 'CA');

        // Remove US and Canada from the main list
        const filteredCountries = uniqueCountries.filter(c => c.Code !== 'US' && c.Code !== 'CA');

        // Add US and Canada to the beginning if they exist
        const specialCountries = [usa, canada].filter(Boolean);
        return [...specialCountries, ...filteredCountries];
    }

    return uniqueCountries;
}
