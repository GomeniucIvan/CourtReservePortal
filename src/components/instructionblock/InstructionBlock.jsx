import {Button, Flex, Typography} from "antd";
import {useState} from "react";
import SVG from "@/components/svg/SVG.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {useApp} from "@/context/AppProvider.jsx";
const{Title, Text} = Typography;
import {useStyles} from "./styles.jsx";
import { cx } from 'antd-style';
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import * as React from "react";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";

function InstructionBlock({instructions}) {
    const [showInstructions, setShowInstructions] = useState(false);
    const {token} = useApp();
    const {styles} = useStyles();


    return (
        <>
            {!isNullOrEmpty(instructions) &&
                <Flex vertical={true} gap={20} className={styles.instructionBlock}>
                    <Title level={3}>Instructions</Title>

                    <Button onClick={() => {setShowInstructions(true)}} block={true}>
                        View
                    </Button>

                    <DrawerBottom showDrawer={showInstructions}
                                  maxHeightVh={60}
                                  showButton={true}
                                  onConfirmButtonClick={() => setShowInstructions(false)}
                                  confirmButtonText={'Close'}
                                  confirmButtonType={'default'}
                                  closeDrawer={() => setShowInstructions(false)}
                                  label={'Instructions'}>
                        <PaddingBlock>
                            <Text>
                                <div dangerouslySetInnerHTML={{__html: instructions}}/>
                            </Text>
                        </PaddingBlock>
                    </DrawerBottom>
                </Flex>
            }
        </>
    );
}

export default InstructionBlock;