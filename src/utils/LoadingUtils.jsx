import React from "react";

export const useLoadingState = (fields) => {
    const [loadingState, setLoadingState] = React.useState(
        fields.reduce((acc, field) => ({ ...acc, [field]: false }), {})
    );

    const setLoading = (field, value) => {
        setLoadingState(prev => ({ ...prev, [field]: value }));
    };

    return { loadingState, setLoading };
};