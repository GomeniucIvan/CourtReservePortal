import {useStyles} from "./../styles.jsx";
import {Button, Flex, List, Skeleton, Tabs, Tag, Typography} from "antd";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import apiService from "@/api/api.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, moreThanOneInList, toBoolean} from "@/utils/Utils.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {setFormikErrorN, validateDisclosures, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {membershipRequirePayment} from "@/utils/CostUtils.jsx";
import FormCardRadioGroup from "@/form/formradio/FormCardRadioGroup.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
const {Title} = Typography;

function SaveMyPlayStartRecordingTab({selectedTab, tabsHeight}) {
    const {token,
        globalStyles, 
        availableHeight,
        isLoading,
        setIsLoading,
        setIsFooterVisible,
        setFooterContent,} = useApp();
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [isFetching, setIsFetching] = useState(true);
    const [initialPrice, setInitialPrice] = useState(null);
    const [getData, setGetData] = useState(null);
    const [existingRecordingData, setExistingRecordingData] = useState(null);

    const {orgId} = useAuth();

    useEffect(() => {
        setBodyHeight(availableHeight - tabsHeight - token.padding);
    }, [availableHeight, tabsHeight]);

    const formik = useCustomFormik({
        initialValues: {
            CourtIds: [],
            Duration: '',
            SessionRecordingType: 1,
        },
        validation: () => {
            let isValidFormik = true;
            if (!anyInList(formik?.values?.CourtIds)) {
                isValidFormik = false;
                setFormikErrorN(formik, 'CourtIds', 'At least one court must be selected.');
            }
            if (isNullOrEmpty(formik?.values?.Duration)) {
                isValidFormik = false;
                setFormikErrorN(formik, 'Duration', 'Duration is required.');
            }
            if (isNullOrEmpty(formik?.values?.SessionRecordingType)) {
                isValidFormik = false;
                setFormikErrorN(formik, 'SessionRecordingType', 'Session Type is required.');
            }
            return isValidFormik;
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            pNotify('TODO?!')
        },
    });

    const loadData = async () => {
        setIsFetching(true)
        try {
            const response = await apiService.get(`/api/save-my-play-management/start-recording-data?orgId=${orgId}`)

            setInitialPrice({
                CalculationType: response.DataToCreateNewRecording?.CalculationType,
                Price: response.DataToCreateNewRecording?.Price,
            })
            setGetData(response?.DataToCreateNewRecording || {})
            let existingRecordingData = response?.ExistingRecordingData || [];
            setExistingRecordingData(existingRecordingData);
            formik.setFieldValue('CourtIds', existingRecordingData);

        } catch (e) {
            console.log('error fetch start-recording data', e)
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (equalString(selectedTab, 'startrecording')) {
            loadData();
        }
    }, [selectedTab])

    useEffect(() => {
        if (equalString(selectedTab, 'startrecording')) {
            setFooterContent(<FooterBlock topBottom={true}>
                <Button type="primary"
                        block
                        htmlType="submit"
                        disabled={(isFetching || !anyInList(formik?.values?.CourtIds) || isNullOrEmpty(formik?.values?.Duration))}
                        loading={isLoading}
                        onClick={formik.handleSubmit}>
                    Start Recording
                </Button>
            </FooterBlock>);
        }
    }, [selectedTab, isFetching, isLoading, formik?.values]);
    
    const predefinedCourts = existingRecordingData?.map((court) => ({
        Id: court.CourtId,
        Name: court.CourtLabel,
        Type: court.CourtType,
    }))

    const predefinedCourtIds = new Set(predefinedCourts?.map((court) => court.Id));
    const filteredOptionsWithoutSelectedCourts = getData?.Courts?.filter(
        (court) => !predefinedCourtIds.has(court.Id)
    );

    const isCourtDisabled = (courtId) => {
        return existingRecordingData.some(
            (recording) => equalString(recording.CourtId, courtId))
    }

    return (
        <PaddingBlock>
            <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                <Flex vertical={true} gap={token.padding}>
                    {isFetching &&
                        <>
                            <Flex vertical={true} gap={4}>
                                <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                            </Flex>

                            <Flex vertical={true} gap={4}>
                                <Skeleton.Button active={true} block style={{height: `23px`, width: `${randomNumber(25, 50)}%`}}/>
                                <Skeleton.Button active={true} block style={{height: token.Input.controlHeight}}/>
                            </Flex>

                            <Skeleton.Button active={true} block style={{height: '180px'}}/>
                        </>
                    }

                    {!isFetching &&
                        <>
                            {anyInList(filteredOptionsWithoutSelectedCourts) &&
                                <FormSelect formik={formik}
                                            name={`CourtIds`}
                                            label='Court(s)'
                                            multi={true}
                                            options={filteredOptionsWithoutSelectedCourts.map((court) => ({
                                                Value: court.Id,
                                                Text: `${court.Type} - ${court.Name}`,
                                                disabled: isCourtDisabled(court.Id),
                                            }))}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>
                            }
                            {anyInList(getData?.Durations) &&
                                <FormSelect formik={formik}
                                            name={`Duration`}
                                            label='Duration'
                                            options={getData?.Durations.map((duration) => ({
                                                Value: duration.Value,
                                                Text: duration.DisplayText,
                                            }))}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>
                            }
                            
                            <FormCardRadioGroup formik={formik} name={`SessionRecordingType`} options={[
                                {Label: 'Condensed', Description: 'Will use AI magic to cut out dead time between points.', Value: 1},
                                {Label: 'Full', Description: 'Will produce an uninterrupted recording for the entire duration.', Value: 2},
                            ]} />
                        </>
                    }
                </Flex>
            </div>
        </PaddingBlock>
    )
}

export default SaveMyPlayStartRecordingTab
