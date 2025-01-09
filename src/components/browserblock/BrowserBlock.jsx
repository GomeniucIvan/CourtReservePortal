import {Button, Flex, Typography} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";

function BrowserBlock({html}) {
    const {token} = useApp();
    const {styles} = useStyles();
    
    return (
        <Flex flex={1} className={styles.browser} vertical={true}>
            <Flex className={styles.browserHeader}>
                <div><span></span></div>
            </Flex>
            
            <div className={styles.iframe}>
                <IframeContent content={html} id={`iframe_${randomNumber(1, 10000)}`} />
            </div>
        </Flex>
    );
}

export default BrowserBlock;