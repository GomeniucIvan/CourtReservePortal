import {Flex, Typography} from "antd";
const { Text } = Typography;
import {useApp} from "../../context/AppProvider.jsx";

function PaddingBlock({children}) {
    const {globalStyles, token} = useApp();
    
    return (
        <div style={{padding: `0px ${token.padding}px`}}>
            {children}
        </div>
    )
}

export default PaddingBlock
