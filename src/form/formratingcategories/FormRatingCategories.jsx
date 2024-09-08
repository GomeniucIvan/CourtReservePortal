import {calculateSkeletonLabelWidth, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import {cx} from "antd-style";
import {Skeleton} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import React from "react";

const FormRatingCategories = ({form, ratingCategories, keyPrefix, loading}) => {
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

    return ratingCategories.map(({AllowMultipleRatingValues, Ratings, Name, Id, IsRequired}) => {
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