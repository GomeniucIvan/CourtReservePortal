import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Card, Divider, Flex, Typography} from "antd";
import { anyInList } from "@/utils/Utils.jsx";
import {cx} from "antd-style";
import SVG from "@/components/svg/SVG.jsx";
import React, {useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";

const {Title, Text, Link} = Typography;

function ReservationRegistrationMiscItems({miscFeesQuantities, setMiscFeesQuantities }) {
    const [showMiscItems, setShowMiscItems] = useState(false);
    const { globalStyles, token} = useApp();

    const handleMiscItemChange = (increment, index) => {
        if (increment) {
            setMiscFeesQuantities((prevItemsState) => {
                const newItemsState = [...prevItemsState];
                newItemsState[index].Quantity += 1;
                return newItemsState;
            });
        } else {
            setMiscFeesQuantities((prevItemsState) => {
                const newItemsState = [...prevItemsState];
                if (newItemsState[index].Quantity > 0) {
                    newItemsState[index].Quantity -= 1;
                }
                return newItemsState;
            });
        }
    };
    
    return (
        <>

            {anyInList(miscFeesQuantities) &&
                <Flex vertical={true} gap={token.padding}>
                    <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                        <Flex justify={'space-between'} align={'center'}>
                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                <Title level={1} className={cx(globalStyles.noSpace)}>Miscellaneous Items</Title>
                                <Text type="secondary">({miscFeesQuantities.length})</Text>
                            </Flex>

                            <Link onClick={() => { setShowMiscItems(true) }}>
                                <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                    {anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                                        <>
                                            <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                                            <strong>Edit Items</strong>
                                        </>
                                    }

                                    {!anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                                        <>
                                            <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                                            <strong>Add Items</strong>
                                        </>
                                    }
                                </Flex>
                            </Link>
                        </Flex>
                    </Flex>

                    {anyInList(miscFeesQuantities.filter(item => item.Quantity > 0)) &&
                        <div style={{marginTop: `${token.padding / 2}px`}}>
                            <Card
                                className={cx(globalStyles.card, globalStyles.playersCard)}>
                                {miscFeesQuantities.filter(item => item.Quantity > 0).map((item, index) => {
                                    const isLastIndex = index === miscFeesQuantities.filter(item => item.Quantity > 0).length - 1;

                                    return (
                                        <div key={index}>
                                            <Flex justify={'space-between'} align={'center'}>
                                                <Text
                                                    className={cx(globalStyles.noSpace)}>{item.Text}</Text>

                                                <Flex gap={token.padding} align={'center'}>
                                                    <Title level={1} className={cx(globalStyles.noSpace)}>
                                                        <Text style={{opacity: '0.6'}}>x </Text>
                                                        {item.Quantity}
                                                    </Title>
                                                </Flex>
                                            </Flex>

                                            {!isLastIndex &&
                                                <Divider className={globalStyles.formDivider} style={{margin: '10px 0px'}}/>}
                                        </div>
                                    )
                                })}
                            </Card>
                        </div>
                    }

                    <Divider className={cx(globalStyles.formDivider, globalStyles.noMargin)}/>
                </Flex>
            }
            
            {/*Misc item*/}
            <DrawerBottom
                maxHeightVh={60}
                showDrawer={showMiscItems}
                closeDrawer={() => {
                    setShowMiscItems(false)
                }}
                label={'Miscellaneous Items'}
                showButton={true}
                confirmButtonText={'Save'}
                onConfirmButtonClick={() => {
                    setShowMiscItems(false)
                }}
            >
                <PaddingBlock>
                    {anyInList(miscFeesQuantities) &&
                        <Flex vertical>
                            {miscFeesQuantities.map((miscItem, index) => {
                                const isLastIndex = index === miscFeesQuantities.length - 1;

                                return (
                                    <div key={index}>
                                        <Flex justify={'space-between'} align={'center'}>
                                            <Title level={1}
                                                   className={cx(globalStyles.noSpace)}>{miscItem.Text}</Title>

                                            <Flex gap={token.padding} align={'center'}>
                                                <div onClick={() => {
                                                    handleMiscItemChange(false, index)
                                                }}
                                                     style={{
                                                         opacity: miscItem.Quantity === 0 ? '0.4' : '1'
                                                     }}
                                                >
                                                    <SVG icon={'circle-minus'} size={30} preventFill={true} />
                                                </div>

                                                <Title level={1} style={{minWidth: '26px', textAlign: 'center'}}
                                                       className={cx(globalStyles.noSpace)}>{miscItem.Quantity}</Title>

                                                <div onClick={() => {
                                                    handleMiscItemChange(true, index)
                                                }}>
                                                    <SVG icon={'circle-plus'} size={30} color={token.colorPrimary}/>
                                                </div>
                                            </Flex>
                                        </Flex>

                                        {!isLastIndex &&
                                            <Divider className={globalStyles.playersDivider}/>
                                        }
                                    </div>
                                )
                            })}
                        </Flex>
                    }
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ReservationRegistrationMiscItems