﻿import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {equalString, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import {Popup} from "antd-mobile";
import {Flex, Typography, Button, Input} from "antd";
import {CloseOutline, SearchOutline} from "antd-mobile-icons";
import {useApp} from "../../context/AppProvider.jsx";
import {useStyles} from "./styles.jsx";
import PaddingBlock from "../paddingblock/PaddingBlock.jsx";
import {cx} from "antd-style";
import {useSafeArea} from "@/context/SafeAreaContext.jsx";

const {Title, Text} = Typography;
const {Search} = Input;

const DrawerBottom = forwardRef(({
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
                                     dangerButton,
                                     maxHeightVh = 60,
                                     fullHeight = false,
                                     confirmButtonType = 'primary',
                                     isSearchLoading,
                                     customFooter,
                                     confirmButtonLoading
                                 }, ref) => {

    const { token, globalStyles } = useApp();

    const {styles} = useStyles();

    const headerRef = useRef(null);
    const footerRef = useRef(null);
    const searchRef = useRef(null);
    
    const [topBottomHeight, setTopBottomHeight] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [isFullyOpened, setIsFullyOpened] = useState(false);
    const {safeAreaInsets} = useSafeArea();
    
    // Use useRef to persist the debounceTimeout value between renders
    const debounceTimeoutRef = useRef(null);

    useImperativeHandle(ref, () => ({
        setValue: (incValue) => {
            setSearchValue(incValue);
        },
    }));

    useEffect(() => {
        if (fullHeight && showDrawer) {
            const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0;
            const footerHeight = footerRef.current ? footerRef.current.offsetHeight : 0;
            setTopBottomHeight(headerHeight + footerHeight);
        } else {
            setTopBottomHeight('');
        }
    }, [fullHeight, showDrawer]);

    const oInputSearch = (e) => {
        const newValue = e.target.value;
        setSearchValue(newValue);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            if (onSearch && typeof onSearch === 'function') {
                onSearch(newValue);
            }
        }, 1000);
    };

    useEffect(() => {
        if (!showDrawer) {
            setIsFullyOpened(false);
        } else {
            setTimeout(() => {
                setIsFullyOpened(true);
            }, 100);
        }
    }, [showDrawer]);
    
    return (
        <>
            <Popup
                visible={toBoolean(showDrawer)}
                onMaskClick={() => {
                    closeDrawer();
                }}

                onClose={() => {
                    closeDrawer();
                }}
                bodyStyle={{
                    height: toBoolean(fullHeight) ? '100%' : 'auto',
                    maxHeight: `${maxHeightVh}vh`,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingBottom: `${safeAreaInsets?.bottom || 0}px`
                }}
            >
                <>
                    <Flex vertical ref={headerRef}>
                        {(!addSearch || !equalString(searchType, 2)) &&
                            <Flex justify={'space-between'} align={'center'} style={{padding: `${token?.padding}px`}}>
                                <Title level={3} style={{margin: 0}}>{label}</Title>

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
                                <Text style={{marginBottom: `${token.Custom.buttonPadding / 2}px`, display: 'block'}}>
                                    <strong>
                                        {label}
                                    </strong>
                                </Text>
                                <Search placeholder={`Type to ${label}`}
                                        allowClear
                                        value={searchValue}
                                        rootClassName={globalStyles.search}
                                        loading={toBoolean(isSearchLoading)}
                                        onChange={oInputSearch}/>
                            </PaddingBlock>
                        }
                    </Flex>

                    <div className={cx(isFullyOpened && styles.drawerBodyOpened, !isFullyOpened && styles.drawerBodyClosed)}
                         style={{ height: (fullHeight ? `calc(${maxHeightVh}vh - ${topBottomHeight}px)` : '')}}>
                        {children}
                    </div>

                    {showButton &&
                        <div className={styles.drawerButton} ref={footerRef}>
                            {isNullOrEmpty(customFooter) ?
                                (<Button type={confirmButtonType}
                                         loading={toBoolean(confirmButtonLoading)}
                                         block
                                         danger={toBoolean(dangerButton)}
                                         onClick={() => {
                                             onConfirmButtonClick();
                                         }}>
                                    {confirmButtonText}
                                </Button>) :
                                (<>{customFooter}</>)
                            }
                        </div>
                    }
                </>
            </Popup>
        </>
    )
})

export default DrawerBottom