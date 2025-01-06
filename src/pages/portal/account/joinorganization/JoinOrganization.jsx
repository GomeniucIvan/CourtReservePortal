import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Carousel, Flex, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useEffect} from "react";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
const {Title, Text, Paragraph, Link} = Typography;

function JoinOrganization() {
    let {orgId, memberId} = useParams();
    const navigate = useNavigate();
    const {setIsFooterVisible, token, setHeaderRightIcons, globalStyles, setFooterContent} = useApp();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary" block>
                Request Access
            </Button>
        </FooterBlock>)

    }, []);
    return (
        <PaddingBlock topBottom={true}>
            //signup o: ${orgId}
        </PaddingBlock>
    )
}

export default JoinOrganization
