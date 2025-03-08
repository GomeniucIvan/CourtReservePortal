import {useStyles} from "./../styles.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Flex, List, Skeleton, Tabs, Tag, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {
    anyInList,
    copyToClipboard,
    equalString,
    isNullOrEmpty,
    moreThanOneInList,
    notValidScroll,
    toBoolean
} from "@/utils/Utils.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService from "@/api/api.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {saveMyPlayPeriodList} from "@/utils/SelectUtils.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import EmptyBlock from "@/components/emptyblock/EmptyBlock.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {openMobileExternalBrowser} from "@/utils/MobileUtils.jsx";
import {cx} from "antd-style";
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import {costDisplay} from "@/utils/CostUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import {is} from "@/components/timepicker/npm/utils/func.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";

const {Title,Text} = Typography;

function SaveMyPlayMyRecordingsTab({selectedTab, tabsHeight}) {
    const {
        token,
        globalStyles,
        availableHeight,
        setIsFooterVisible,
        setFooterContent,
        setIsLoading,
        isLoading
    } = useApp();

    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [recordings, setRecordings] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [isRecordingFetching, setIsRecordingFetching] = useState(true);

    const headerRef = useRef();
    const {orgId} = useAuth();
    const {setHeaderRightIcons} = useHeader();
    const {styles} = useStyles();

    const formik = useCustomFormik({
        initialValues: {
            Period: '3',
        },
        validation: () => {

        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });

    const loadData = async (filterChange) => {
        setIsRecordingFetching(true);
        if (!toBoolean(filterChange)) {
            setIsFetching(true);
        }

        const response = await apiService.get(`/api/save-my-play-management/all-recordings?orgId=${orgId}&period=${formik?.values?.Period || 2}`);
        
        try {
            setRecordings(response);
        } catch (e) {
            console.log('error fetch start-recording data', e);
        } finally {
            setIsFetching(false);
            setIsRecordingFetching(false);
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - tabsHeight - (token.padding * 2));
        }
    }, [headerRef, availableHeight, tabsHeight]);

    useEffect(() => {
        if (equalString(selectedTab, 'myrecording')) {
            setIsFooterVisible(true);
            setHeaderRightIcons('')
            loadData()
        }
    }, [selectedTab]);

    useEffect(() => {
        if (equalString(selectedTab, 'myrecording')) {
            setFooterContent('');
        }
    }, [selectedTab, isFetching, isLoading]);
    
    useEffect(() => {
        loadData(true);
    }, [formik?.values?.Period])
    
    return (
        <PaddingBlock>
            <Flex vertical={true} gap={token.padding}>
            
                
            {isFetching &&
                    <>
                        <Flex vertical={true} gap={4} ref={headerRef}>
                            <Skeleton.Button active={true} block
                                             style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                            <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                        </Flex>
                    </>
            }

                {!isFetching &&
                    <>
                        <div ref={headerRef}>
                            <FormSelect formik={formik}
                                        name={`Period`}
                                        className={styles.periodSelect}
                                        label='Date'
                                        options={saveMyPlayPeriodList}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>
                        </div>
                    </>
                }

                {(isFetching || isRecordingFetching) &&
                    <>
                        <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                            <Flex gap={token.padding} vertical={true}>
                                {emptyArray(6).map((item, index) => {
                                    return (
                                        <Skeleton.Button key={index} active={true} block style={{height: '350px'}}/>
                                    )
                                })}
                            </Flex>
                        </div>
                    </>
                }

                {(!isFetching && !isRecordingFetching && !anyInList(recordings)) &&
                    <EmptyBlock description={'No Recordings found.'} removePadding={true}/>
                }

                {(!isFetching && !isRecordingFetching && anyInList(recordings)) &&
                    <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                        <Flex gap={token.padding} vertical={true}>
                            {recordings.map((item, index) => {

                                return (
                                    <div key={index}>
                                        <Card
                                            className={cx(globalStyles.card, styles.recordingCardCover, globalStyles.cardNoPadding)}
                                            cover={
                                                item.ThumbnailUrl.endsWith('.gif') ? (
                                                    <Skeleton.Button block={true} style={{ height: '168px' }} active />
                                                ) : (
                                                    <a
                                                        onClick={() => {
                                                            displayMessageModal({
                                                                title: "External Link",
                                                                html: (onClose) => <Flex vertical={true} gap={token.padding * 2}>
                                                                    <Text>{'You are about to leave our platform and access an external website. Open external link?'}</Text>

                                                                    <Flex vertical={true} gap={token.padding}>
                                                                        <Button block={true} type={'primary'} onClick={() => {
                                                                            openMobileExternalBrowser(item.Url);
                                                                            onClose();
                                                                        }}>
                                                                            Open
                                                                        </Button>

                                                                        <Button block={true} onClick={() => {
                                                                            onClose();
                                                                        }}>
                                                                            Close
                                                                        </Button>
                                                                    </Flex>
                                                                </Flex>,
                                                                type: "warning",
                                                                onClose: () => {},
                                                            })
                                                        }}
                                                    >
                                                        <img src={item.ThumbnailUrl} alt="thumbnail" className={styles.recordingCardCoverImage} />
                                                        <Flex className={styles.recordingPlayIconWrapper} align={'center'} justify={'center'}>
                                                            <SVG icon={'play-solid'} color={'white'} />
                                                        </Flex>
                                                    </a>
                                                )
                                            }
                                        >
                                            <Flex
                                                vertical={true}
                                                gap={token.padding}
                                                style={{padding:`${token.paddingSM}px ${token.padding}px`}}
                                            >
                                                <Flex vertical gap={token.paddingSM}>
                                                    <CardIconLabel gap={token.paddingXS} icon={'calendar'} description={item.StartDateTime} size={14} iconColor={token.colorSecondary}/>
                                                    <CardIconLabel gap={token.paddingXS} icon={'clock'} description={item.EndDateTime} size={14} iconColor={token.colorSecondary}/>
                                                </Flex>
                                                <Button
                                                    block
                                                    icon={<SVG icon='link-regular'/>}
                                                    onClick={() => copyToClipboard(item.Url)}
                                                >
                                                    <span>Copy Link</span>
                                                </Button>
                                            </Flex>
                                        </Card>
                                    </div>
                                )
                            })}
                        </Flex>
                    </div>
                }
        </Flex>
        </PaddingBlock>
    )
}
export default SaveMyPlayMyRecordingsTab
