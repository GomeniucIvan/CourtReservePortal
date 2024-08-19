import {useStyles} from "./styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {List} from "antd";
import {useEffect, useState, useRef} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import IframeContent from "../../../components/iframecontent/IframeContent.jsx";

function AnnouncementList() {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const{isMockData, setIsFooterVisible} = useApp();
    const [announcements, setAnnouncements, ] = useState([]);

    const data = Array.from({ length: 23 }).map((_, i) => ({
        title: `ant design part ${i}`,
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));

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
                                description={item.UpdatedOnDisplay}
                            />
                            <IframeContent content={item.Content} id={item.Id} />
                        </List.Item>
                    );
                }}
            />
        </PaddingBlock>
    )
}

export default AnnouncementList
