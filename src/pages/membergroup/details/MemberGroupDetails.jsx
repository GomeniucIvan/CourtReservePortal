import {useNavigate, useParams} from "react-router-dom";
import { IndexBar, List } from 'antd-mobile'
import {useEffect, useState} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import {anyInList, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";

function MemberGroupDetails() {
    const {navigate} = useNavigate();
    const [groups, setGroups] = useState([]);
    const {isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, setHeaderTitle, setFooterContent} = useApp();
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    let {id} = useParams();

    const loadData = (refresh) => {
        if (isMockData) {

            setIsFetching(false)
        } else {
            setIsFetching(true)
            appService.get(navigate, `/app/Online/PublicMemberGroup/GetGroupMembers?id=${orgId}&groupId=${id}`).then(r => {
                console.log(r);
                
                if (toBoolean(r?.IsValid)){
                    
                }
            })
        }

        resetFetch();
    }
    
    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');

        if (id){
            loadData();
        }
    }, [id]);
    
    return (
        <>
            <IndexBar>
                {groups.map(group => {
                    const { title, items } = group
                    return (
                        <IndexBar.Panel
                            index={title}
                            title={`标题${title}`}
                            key={`标题${title}`}
                        >
                            <List>
                                {items.map((item, index) => (
                                    <List.Item key={index}>{item}</List.Item>
                                ))}
                            </List>
                        </IndexBar.Panel>
                    )
                })}
            </IndexBar>
        </>
    )
}

export default MemberGroupDetails
