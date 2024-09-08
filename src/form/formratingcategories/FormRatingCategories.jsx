import {isNullOrEmpty} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";

const FormRatingCategories = ({ form, ratingCategories, keyPrefix, loading }) => {
    if (isNullOrEmpty(ratingCategories)) {
        return null;
    }

    return ratingCategories.map(({ AllowMultipleRatingValues, Ratings, Name, Id, IsRequired }) => {
        const name = isNullOrEmpty(keyPrefix) ? `rat_${Id}` : `${keyPrefix}.rat_${Id}`;
        
        return (
            <FormSelect
                key={`${name}_top`}
                label={Name}
                name={name}
                propText='Name'
                propValue='RatingId'
                fetching={loading}
                multi={AllowMultipleRatingValues}
                options={Ratings}
                required={IsRequired}
                form={form}
            />
        );
    });
};

export default FormRatingCategories;