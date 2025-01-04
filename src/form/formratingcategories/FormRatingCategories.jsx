import {calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {cx} from "antd-style";
import {Skeleton} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import React from "react";

const FormRatingCategories = ({formik, ratingCategories, loading, index = '',
                                  name}) => {
    const {globalStyles} = useApp();

    if (isNullOrEmpty(ratingCategories)) {
        return null;
    }

    if (toBoolean(loading)) {
        return (
            <div className={cx(globalStyles.formBlock)}>
                <Skeleton.Input block
                                active={true}
                                className={cx(globalStyles.skeletonLabel)}
                                style={{
                                    width: `${calculateSkeletonLabelWidth()}`,
                                    minWidth: `${calculateSkeletonLabelWidth()}`
                                }}/>
                <Skeleton.Input block active={true} className={cx(globalStyles.skeletonInput)}/>
            </div>
        )
    }

    return ratingCategories.map(({ AllowMultipleRatingValues,
                                     Ratings,
                                     Name,
                                     Id,
                                     IsRequired }, ratingIndex) => {
        
        const fieldName = name
            .replace('{index}', index)
            .replace('{ratingIndex}', ratingIndex)
            .replace('{keyValue}', (toBoolean(AllowMultipleRatingValues) ? 'SelectedRatingsIds' : 'SelectedRatingsIds'));

        return (
            <FormSelect
                key={Id}
                label={Name}
                formik={formik}
                name={fieldName}
                propText='Name'
                propValue='RatingId'
                fetching={loading}
                multi={AllowMultipleRatingValues}
                options={Ratings}
                required={IsRequired}
            />
        );
    });
};

export default FormRatingCategories;