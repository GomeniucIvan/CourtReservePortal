import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {e, eReplace} from "@/utils/TranslateUtils.jsx";
import {Button, Flex, Skeleton, Typography} from "antd";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {copyToClipboard, toBoolean} from "@/utils/Utils.jsx";
import {useTranslation} from "react-i18next";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useNavigate} from "react-router-dom";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";

const {Title, Link} = Typography;

function ProfileCalendarFeed() {
    const navigate = useNavigate();
    const {isMockData, token, isLoading, setIsLoading} = useApp();
    const {orgId} = useAuth();
    const { t } = useTranslation('');
    
    const [calendarUrl, setCalendarUrl] = useState('')
    const [isFetching, setIsFetching] = useState(true);
    useEffect(() => {
        if (isMockData) {
            setCalendarUrl('http://localhost:2129/Online/PublicIcal/Index/6969/462598/e562a01f-4db9-44c4-b8dc-87b702b041df');
            setIsFetching(false);
        }else{
            appService.get(navigate, `/app/Online/MyProfile/MyCalendar?id=${orgId}`).then(r => {
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
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                <Title level={3}>{e(t('profile.calendar.feedTitle'))}</Title>

                <Link href={calendarUrl} target="_blank" style={{display: 'block'}}>
                    <Title level={2} type={'link'} style={{color: token.colorLink}}> {calendarUrl}</Title>
                </Link>

                <InlineBlock>
                    <Button block type={'primary'} ghost onClick={() => {copyToClipboard(calendarUrl)}}>
                        {t('profile.calendar.copyLink')}
                    </Button>

                    <Button block type={'primary'} ghost href={`${calendarUrl}?openbrowser=true`}>
                        {t('profile.calendar.getFile')}
                    </Button>

                    <Button block type={'primary'} ghost loading={isLoading} onClick={() => {
                        displayMessageModal({
                            title: 'Email Calendar',
                            html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                                <Text>{t('profile.calendar.emailLinkDescription')}</Text>

                                <Flex vertical={true} gap={token.padding}>
                                    <Button block={true} type={'primary'} onClick={() => {
                                        setIsLoading(true);
                                        appService.post(`/app/Online/MyProfile/SendEmailWithIcalLink?id=${orgId}&iCalLink=${calendarUrl}`).then(r => {
                                            if (toBoolean(r.IsValid)){
                                                pNotify(t('profile.calendar.successfullyEmailed'))
                                            } else {
                                                pNotify(t?.Message, 'error')
                                            }
                                            onClose();
                                            setIsLoading(false);
                                        })
                                    }}>
                                        Confirm
                                    </Button>

                                    <Button block={true} onClick={() => {
                                        onClose();
                                    }}>
                                        Close
                                    </Button>
                                </Flex>
                            </Flex>,
                            type: "info",
                        })
                    }}>
                        {t('profile.calendar.emailLink')}
                    </Button>
                </InlineBlock>
            </Flex>
        </PaddingBlock>
    )
}

export default ProfileCalendarFeed
