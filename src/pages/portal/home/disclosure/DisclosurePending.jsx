import React, {useEffect, useState, useRef} from "react";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import DisclosuresPartial from "@/form/formdisclosures/DisclosuresPartial.jsx";

function DisclosurePending({scope}) {
    const navigate = useNavigate();
    const {orgId} = useAuth();
    
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
