import {anyInList, equalString} from "@/utils/Utils.jsx";
import {Card, Divider, Flex, Typography} from "antd";
import React from "react";
import {Ellipsis} from "antd-mobile";

const {Title, Text} = Typography;

function ReceiptBlock({receiptItems}) {
    return (
        <>
            {anyInList(receiptItems) &&
                <Card style={{margin: '0px'}}>
                    <Flex vertical={true} gap={4}>
                        {receiptItems.map((item, index) => {

                            if (equalString(item.Key, 'divider')) {
                                return (
                                    <Divider style={{marginTop: '4px', marginBottom: '4px'}} key={index} />
                                )
                            }

                            if (equalString(item.Key, 'Text')) {
                                return (
                                    <Flex align={'center'} justify={'space-between'} key={index}>
                                        <Text>
                                            {item.Label}
                                        </Text>

                                        <Text style={{textAlign: 'end'}}>
                                            {item.Value}
                                        </Text>
                                    </Flex>
                                )
                            }
                            
                            return (
                                <Flex align={'center'} justify={'space-between'} key={index}>
                                    <Title level={4}>
                                        {item.Label}
                                    </Title>

                                    <Title level={4} style={{textAlign: 'end'}}>
                                        {item.Value}
                                    </Title>
                                </Flex>
                            )
                        })}
                    </Flex>
                </Card>
            }
        </>
    );
}

export default ReceiptBlock;