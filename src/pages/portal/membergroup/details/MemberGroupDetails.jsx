import {useLocation, useNavigate, useParams} from "react-router-dom";
import { IndexBar, List } from 'antd-mobile';
import {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {equalString, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Flex, Skeleton, Typography} from "antd";
import {useHeader} from "@/context/HeaderProvider.jsx";
const {Text} = Typography;

function MemberGroupDetails() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState({});
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {isMockData, setIsFooterVisible, shouldFetch, resetFetch, setFooterContent, availableHeight, globalStyles} = useApp();
    const {orgId} = useAuth();
    const [isFetching, setIsFetching] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberGroupId = queryParams.get("memberGroupId");
    
    const loadData = (refresh) => {
        if (isMockData) {

            setIsFetching(false)
        } else {
            setIsFetching(true);
            appService.get(navigate, `/app/Online/PublicMemberGroup/GetGroupMembers?id=${orgId}&groupId=${memberGroupId}`).then(r => {

                if (toBoolean(r?.IsValid)){
                    const data = r.Data;
                    setHeaderTitle(data.Name);
                    //todo SelectedMemberPortalFields

                    const groupByFirstName = equalString(data.DefaultSortingOption, 1) || equalString(data.DefaultSortingOption, 3);
                    const groupByLastName = equalString(data.DefaultSortingOption, 2);
                    if (groupByFirstName){
                        const grouped = data.Members.reduce((acc, member) => {
                            const letter = member.FirstNameFirstLetter;
                            if (!acc[letter]) {
                                acc[letter] = [];
                            }
                            acc[letter].push(member);
                            return acc;
                        }, {});

                        console.log(grouped);
                        setGroups(grouped);

                    } else if(groupByLastName){
                        const grouped = data.Members.reduce((acc, member) => {
                            const letter = member.LastNameFirstLetter;
                            if (!acc[letter]) {
                                acc[letter] = [];
                            }
                            acc[letter].push(member);
                            return acc;
                        }, {});

                        setGroups(grouped);
                    }
                }

                setIsFetching(false);
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
        loadData();
    }, []);

    return (
        <>
            {isFetching &&
                <Flex vertical={true} gap={1}> 
                    {emptyArray(20).map((item, index) => (
                        <Skeleton.Button block key={index} active={true} style={{height : '40px'}} />
                    ))}
                </Flex>
            }

            {!isFetching &&
                <div style={{height: `${availableHeight}px`}} className={globalStyles.indexBar}>
                    <IndexBar>
                        {Object.keys(groups).map(letter => ( 
                            <IndexBar.Panel
                                index={letter} 
                                title={letter} 
                                key={letter}
                            >
                                <List>
                                    {groups[letter].map((member, index) => ( 
                                        <List.Item key={index}>
                                            <Text>
                                                {member.FullName}       
                                            </Text>
                                        </List.Item>
                                    ))}
                                </List>
                            </IndexBar.Panel>
                        ))}
                    </IndexBar>
                </div>
            }
        </>
    )
}

export default MemberGroupDetails;