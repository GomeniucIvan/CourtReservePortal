import React, {useEffect, useState, useRef} from "react";
import DisclosuresPartial from "./DisclosuresPartial.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";

function DisclosurePending({scope}) {
    const navigate = useNavigate();
    const {orgId} = useAuth();
    const{isLoading, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    
    let readUrl = `/app/Online/Disclosures/Pending?id=${orgId}&scope=${scope}`;
    
    const onPostSuccess = () => {
        navigate(HomeRouteNames.INDEX);
    }
    
    return (
        <DisclosuresPartial orgId={orgId}
                            readUrl={readUrl} 
                            onPostSuccess={onPostSuccess} 
                            navigate={navigate}/>
    )
}

export default DisclosurePending
