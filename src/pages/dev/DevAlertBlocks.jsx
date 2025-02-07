import React from "react";
import {Card, Typography, Flex} from "antd";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {cx} from "antd-style";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";

const { Text, Title } = Typography;

function DevAlertBlocks() {
    const {token, globalStyles} = useApp();
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} justify={'center'} gap={16}>
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock title={'Title'} type={'info'} description={'Description'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify(\"Clicked\")}} "}
                        </Text>
                        <AlertBlock type={'info'} description={`Description`} title={'Title'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify("Clicked")}} />
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock title={'Title'} type={'warning'} description={'Description'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify(\"Clicked\")}} "}
                        </Text>
                        <AlertBlock type={'warning'} description={`Description`} title={'Title'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify("Clicked")}} />
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock title={'Title'} type={'danger'} description={'Description'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify(\"Clicked\")}} "}
                        </Text>
                        <AlertBlock type={'danger'} description={`Description`} title={'Title'} removePadding={true} buttonText={'Text'} onButtonClick={() => {pNotify("Clicked")}} />
                    </Flex>
                </Card>
                
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock type={'info'} description={'Description'} removePadding={true}"}
                        </Text>
                        <AlertBlock type={'info'} description={`Description`} />
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock title={'Title'} type={'info'} description={'Description'} removePadding={true}"}
                        </Text>
                        <AlertBlock type={'info'} description={`Description`} title={'Title'} />
                    </Flex>
                </Card>
                <Card className={cx(globalStyles.card)}>
                    <Flex justify={'center'} vertical={true} gap={8}>
                        <Text>
                            {"AlertBlock title={'Title'} type={'info'} description={'Description'} removePadding={true} "}
                        </Text>
                        <AlertBlock type={'info'} description={`Description`} title={'Title'} removePadding={true} />
                    </Flex>
                </Card>
            </Flex>
        </PaddingBlock>
    );
}

export default DevAlertBlocks;