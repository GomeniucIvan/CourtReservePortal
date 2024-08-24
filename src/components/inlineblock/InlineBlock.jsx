import {useApp} from "../../context/AppProvider.jsx";
import {Flex} from "antd";

function InlineBlock({children, topBottom = false, leftRight = true}) {
    const {token} = useApp();
    
    return (
        <Flex gap={token.padding} >
            {children}
        </Flex>
    )
}

export default InlineBlock
