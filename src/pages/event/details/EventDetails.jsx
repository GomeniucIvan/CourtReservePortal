import styles from './EventDetails.module.less'
import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {useEffect, useState} from "react";
import mockData from "../../../mocks/event-data.json";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";

function EventDetails() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [event, setEvent] = useState(null);
    
    let {setIsFooterVisible, setHeaderRightIcons, isMockData, shouldFetch, resetFetch} = useApp();

    const loadData = async (refresh) => {
        if (isMockData){
            const details = mockData.details;
            setEvent(details);
        } else{
            alert('todo home index')
        }
    }

    useEffect(() => {
        if (shouldFetch) {
            const fetchData = async () => {
                await loadData(true);
                resetFetch();
            };
            fetchData();
        }
    }, [shouldFetch, resetFetch]);
    
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('');
        loadData();
    }, []);
    
    return (
        <PaddingBlock>
            EventDetails
        </PaddingBlock>
    )
}

export default EventDetails
