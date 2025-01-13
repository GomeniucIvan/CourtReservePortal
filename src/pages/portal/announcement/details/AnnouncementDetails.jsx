import {useStyles} from "./../styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {useEffect, useState} from "react";
import mockData from "@/mocks/home-data.json";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {List, Tag, Typography} from "antd";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";
import CardSkeleton, {SkeletonEnum} from "@/components/skeleton/CardSkeleton.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
const {Title} = Typography;

function AnnouncementDetails() {
    let {id} = useParams();
    const navigate = useNavigate();
    const {styles} = useStyles();
    const {setHeaderRightIcons} = useHeader();
    const {isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderTitle, setFooterContent} = useApp();
    const [isFetching, setIsFetching] = useState(true);
    
    const {orgId} = useAuth();
    const [announcement, setAnnouncement] = useState(null);
    const { t } = useTranslation('');
    
    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.dashboard.announcement_list;
            if (anyInList(list)) {
                setAnnouncement([list[0]]);
            }
            setIsFetching(false)
        } else {
            setIsFetching(true)
            appService.get(navigate, `/app/Online/Announcement/Details?id=${orgId}&globalAnnouncementId=${id}`).then(r => {
                if (toBoolean(r?.IsValid)){
                    setAnnouncement(r.Data);
                    setHeaderTitle(r.Data.Title);
                }
                setIsFetching(false)
                
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
        <PaddingBlock>
            {isFetching &&
                <CardSkeleton count={1} type={SkeletonEnum.ANNOUNCEMENT_ITEM} />
            }
            
            {(!isNullOrEmpty(announcement?.Content) && !isFetching) &&
               <>
                   <Title level={3}>{announcement?.Title} {toBoolean(announcement?.IsUrgent) && <Tag color="#f50" className={globalStyles.tag}>{t('urgent')}</Tag>}</Title>
                   <IframeContent content={announcement?.Content} id={announcement?.Id}/>
               </>
            }
        </PaddingBlock>
    )
}

export default AnnouncementDetails
