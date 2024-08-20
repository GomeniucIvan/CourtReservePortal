import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {List, Tag} from "antd";
import {useEffect, useState, useRef} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import IframeContent from "../../../components/iframecontent/IframeContent.jsx";
import {isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";

function AnnouncementList() {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const{isMockData, setIsFooterVisible} = useApp();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        setIsFooterVisible(true);
        
        if (isMockData){
            const list = mockData.dashboard.announcement_list;
            setAnnouncements(list);
        } else{
            alert('todo ann list')
        }
    }, []);


    return (
        <PaddingBlock leftRight={false}>
            <List
                className={styles.list}
                itemLayout="vertical"
                dataSource={announcements}
                renderItem={(item) => {
                    return (
                        <List.Item key={item.Id}>
                            <List.Item.Meta
                                title={item.Title}
                                description={<>{item.UpdatedOnDisplay}{toBoolean(item.IsUrgent) && <Tag color="error">Urgent</Tag>}</> }
                            />
                            {!isNullOrEmpty(item.Content) &&
                                <IframeContent content={item.Content} id={item.Id} />
                            }
                        </List.Item>
                    );
                }}
            />
        </PaddingBlock>
    )
}

export default AnnouncementList
