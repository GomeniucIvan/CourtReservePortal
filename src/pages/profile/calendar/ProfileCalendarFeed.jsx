import {useEffect, useState} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {e} from "../../../utils/OrganizationUtils.jsx";
import {Button, Typography} from "antd";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";

const {Title, Link} = Typography;

function ProfileCalendarFeed() {
    const {isMockData, token} = useApp();

    const [calendarUrl, setCalendarUrl] = useState()

    useEffect(() => {
        if (isMockData) {
            setCalendarUrl('http://localhost:2129/Online/PublicIcal/Index/6969/462598/e562a01f-4db9-44c4-b8dc-87b702b041df')
        }
    }, []);

    return (
        <PaddingBlock topBottom={false}>
            <Title level={4}>{e('URL to Subscribe to your Events/Reservations in your Calendar')}</Title>

            <Link href={calendarUrl} target="_blank" style={{paddingBottom: token.padding, display: 'block'}}>
                <Title level={5} type={'link'} style={{color: token.colorLink}}> {calendarUrl}</Title>
            </Link>

            <InlineBlock>
                <Button block type={'primary'} ghost>
                    Copy Link
                </Button>

                <Button block type={'primary'} ghost>
                    Get File
                </Button>

                <Button block type={'primary'} ghost>
                    Email Link
                </Button>
            </InlineBlock>
        </PaddingBlock>
    )
}

export default ProfileCalendarFeed
