import {Flex, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";

function PaddingBlock({children, topBottom = false, leftRight = true}) {
    const {globalStyles, token} = useApp();
    
    return (
        <div style={{padding: `${topBottom ? token.padding : 0}px ${leftRight ?token.padding : 0}px`}}>
            {children}
        </div>
    )
}

export default PaddingBlock
