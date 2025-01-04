import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Carousel, Flex, Typography} from "antd";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import React, {useEffect} from "react";
const {Title, Text, Paragraph, Link} = Typography;

function JoinOrganization() {
    let {orgId, memberId} = useParams();
    const navigate = useNavigate();
    const {setIsFooterVisible, token, setHeaderRightIcons, globalStyles, setFooterContent} = useApp();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary" block>
                Request Access
            </Button>
        </PaddingBlock>)

    }, []);
    return (
        <PaddingBlock topBottom={true}>
            //signup o: {orgId} m {memberId}
        </PaddingBlock>
    )
}

export default JoinOrganization
