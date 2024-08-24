import React from 'react';
import {equalString, toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Flex, Typography, Button, Input} from "antd";
import {CloseOutline, SearchOutline} from "antd-mobile-icons";
import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";

const {Title, Text} = Typography;
const {Search} = Input;

const DrawerBottom = ({
                          showDrawer,
                          closeDrawer,
                          children,
                          label,
                          addSearch,
                          searchType = 1, // 1 header icon, bottom search like search players
                          showButton,
                          confirmButtonText,
                          onConfirmButtonClick,
                          onSearch,
                          maxHeightVh = 60,
                          isSearchLoading
                      }) => {
    const {token, globalStyles} = useApp();
    const {styles} = useStyles();

    const oInputSearch = (e) => {
        if (onSearch && typeof onSearch === 'function') {
            onSearch(e.target.value);
        }
    }

    return (
        <Popup
            visible={toBoolean(showDrawer)}
            onMaskClick={() => {
                closeDrawer();
            }}
            onClose={() => {
                closeDrawer();
            }}
            bodyStyle={{
                height: 'auto',
                maxHeight: `${maxHeightVh}vh`,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <>
                <Flex vertical>
                    {(!addSearch || !equalString(searchType, 2) )&&
                        <Flex justify={'space-between'} align={'center'} style={{padding: `${token.padding}px`}}>
                            <Title level={4} style={{margin: 0}}>{label}</Title>

                            <Flex gap={token.Custom.buttonPadding}>
                                {(addSearch && equalString(searchType, 1)) &&
                                    <Button type="default" icon={<SearchOutline/>} size={'middle'}/>}
                                <Button type="default" icon={<CloseOutline/>} size={'middle'}
                                        onClick={() => closeDrawer()}/>
                            </Flex>
                        </Flex>
                    }

                    {(addSearch && equalString(searchType, 2)) &&
                        <PaddingBlock topBottom={true}>
                            <Text style={{marginBottom: `${token.Custom.buttonPadding/2}px`, display: 'block'}}>
                                <strong>
                                    Search player(s)
                                </strong>
                            </Text>
                            <Search placeholder="Type to search player(s)"
                                    allowClear
                                    rootClassName={globalStyles.search}
                                    loading={toBoolean(isSearchLoading)} 
                                    onChange={oInputSearch}/>
                        </PaddingBlock>
                    }
                </Flex>

                <div className={styles.drawerBottom}>
                    {children}
                </div>

                {showButton &&
                    <div className={styles.drawerButton}>
                        <Button type='primary' block onClick={() => {
                            onConfirmButtonClick();
                        }}>
                            {confirmButtonText}
                        </Button>
                    </div>
                }
            </>
        </Popup>
    )
}

export default DrawerBottom