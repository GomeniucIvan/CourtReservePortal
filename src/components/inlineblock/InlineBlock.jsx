import {useApp} from "../../context/AppProvider.jsx";
import {Flex} from "antd";
import {toBoolean} from "../../utils/Utils.jsx";

function InlineBlock({children, style, vertical}) {
    const {token} = useApp();
    
    return (
        <>
            {toBoolean(vertical) ?
                (<Flex gap={token.padding} style={{...style}} vertical={true}>
                    {children}
                </Flex>) :
                (<Flex gap={token.padding} style={{...style}}>
                    {children}
                </Flex>)
            }
        </>
        

    )
}

export default InlineBlock
