import {useApp} from "../../context/AppProvider.jsx";
import {Flex} from "antd";

function InlineBlock({children, style}) {
    const {token} = useApp();
    
    return (
        <Flex gap={token.padding} style={{...style}}>
            {children}
        </Flex>
    )
}

export default InlineBlock
