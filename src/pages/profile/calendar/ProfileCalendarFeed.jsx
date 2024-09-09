import {useEffect, useState} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {e} from "../../../utils/OrganizationUtils.jsx";
import {Button, Skeleton, Typography} from "antd";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {copyToClipboard, toBoolean} from "../../../utils/Utils.jsx";
import {ModalClose, ModalConfirm, ModalDelete} from "../../../utils/ModalUtils.jsx";
import {useTranslation} from "react-i18next";
import {pNotify} from "../../../components/notification/PNotify.jsx";

const {Title, Link} = Typography;

function ProfileCalendarFeed() {
    const {isMockData, token, isLoading, setIsLoading} = useApp();
    const {orgId} = useAuth();
    const { t } = useTranslation('');
    
    const [calendarUrl, setCalendarUrl] = useState()
    const [isFetching, setIsFetching] = useState(true);
    useEffect(() => {
        if (isMockData) {
            setCalendarUrl('http://localhost:2129/Online/PublicIcal/Index/6969/462598/e562a01f-4db9-44c4-b8dc-87b702b041df');
            setIsFetching(false);
        }else{
            appService.get(`/app/Online/MyProfile/MyCalendar?id=${orgId}`).then(r => {
                if (toBoolean(r?.IsValid)){
                    setCalendarUrl(r.Data.CalendarUrl);
                }

                setIsFetching(false);
            })
        }
    }, []);

    if (isFetching){
        return(
            <PaddingBlock topBottom={true}>
                <Skeleton active/>
            </PaddingBlock>
        )
    }
    
    return (
        <PaddingBlock topBottom={false}>
            <Title level={4}>{e(t('profile.calendar.feedTitle'))}</Title>

            <Link href={calendarUrl} target="_blank" style={{paddingBottom: token.padding, display: 'block'}}>
                <Title level={5} type={'link'} style={{color: token.colorLink}}> {calendarUrl}</Title>
            </Link>

            <InlineBlock>
                <Button block type={'primary'} ghost onClick={() => {copyToClipboard(calendarUrl)}}>
                    {t('profile.calendar.copyLink')}
                </Button>

                <Button block type={'primary'} ghost href={`${calendarUrl}?openbrowser=true`}>
                    {t('profile.calendar.getFile')}
                </Button>

                <Button block type={'primary'} ghost loading={isLoading} onClick={() => {
                    ModalConfirm({
                        content: t('profile.calendar.emailLinkDescription'),
                        showIcon: false,
                        onConfirm: (e) => {
                            setIsLoading(true);
                            appService.post(`/app/Online/MyProfile/SendEmailWithIcalLink?id=${orgId}&iCalLink=${calendarUrl}`).then(r => {
                                if (toBoolean(r.IsValid)){
                                    pNotify(t('profile.calendar.successfullyEmailed'))
                                }else{
                                    pNotify(t?.Message, '', 'error')
                                }

                                setIsLoading(false);
                            })
                        }
                    })
                }}>
                    {t('profile.calendar.emailLink')}
                </Button>
            </InlineBlock>
        </PaddingBlock>
    )
}

export default ProfileCalendarFeed
