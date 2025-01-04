import {useLocation, useNavigate} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import {Button, Carousel, Flex, Typography} from "antd";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
const {Title, Text, Paragraph, Link} = Typography;

function JoinOrganization() {
    const navigate = useNavigate();
    const {setIsFooterVisible, token, setHeaderRightIcons, globalStyles, setFormikData} = useApp();


    return (
        <PaddingBlock topBottom={true}>
            //signup
        </PaddingBlock>
    )
}

export default JoinOrganization
