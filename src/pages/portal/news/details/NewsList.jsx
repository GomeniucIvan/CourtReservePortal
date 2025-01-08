import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Flex, List, Tag} from "antd";
import {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/home-data.json";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import SVG from "@/components/svg/SVG.jsx";

function NewsDetails() {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const [isFetching, setIsFetching] = useState(true);
    
    const{isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, token, setIsLoading} = useApp();
    const [news, setNews] = useState([]);
    const {orgId} = useAuth();
    
    const loadData = (refresh) => {
       
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        loadData();
    }, []);


    return (
        <PaddingBlock leftRight={false}>
         //details
        </PaddingBlock>
    )
}

export default NewsDetails
