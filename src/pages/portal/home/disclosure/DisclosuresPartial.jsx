﻿import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, focus, isNullOrEmpty, randomNumber, toBoolean} from "@/utils/Utils.jsx";
import {Alert, Button, Card, Checkbox, Divider, Flex, Skeleton, Typography, Upload} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import SignatureCanvas from 'react-signature-canvas'
import {pNotify} from "@/components/notification/PNotify.jsx";
import {ModalClose} from "@/utils/ModalUtils.jsx";
import { Document,pdfjs } from 'react-pdf';
import {DownloadOutlined} from "@ant-design/icons";
import {getPdfFileDataUrl, isFileType, openPdfInNewTab} from "@/utils/FileUtils.jsx";
import EmptyBlock, {emptyBlockTypes} from "@/components/emptyblock/EmptyBlock.jsx";
const {Title, Text} = Typography;
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;


const DisclosuresPartial = forwardRef(({readUrl, onPostSuccess, onLoad, isModal, disclosureData, navigate, isFormSubmit}, ref) => {
    const [isFetching, setIsFetching] = useState(true);

    const{isLoading, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const [modelData, setModelData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const [selectedWaiverToSign, setSelectedWaiverToSign] = useState(null);
    const [selectedWaiverToView, setSelectedWaiverToView] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - (token.padding * 2));
    const [pdfDataUrl, setPdfDataUrl] = useState(null);

    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
        },
    }));
    
    const {orgId, authData} = useAuth();
    const {t} = useTranslation('');
    const cardRef = useRef();
    const sigCanvasRef = useRef();

    const loadData = (refresh) => {
        if (isModal){
            setModelData(disclosureData);
            setMembersData(disclosureData.Members);
            setIsFetching(false);
            setIsLoading(false);
            
        } else {
            setIsFetching(true);

            appService.get(navigate, readUrl).then(r => {
                if (r.IsValid){
                    setModelData(r.Data);
                    setMembersData(r.Data.Members);
                    setIsFetching(false);
                    setIsLoading(false);

                    if (typeof onLoad === 'function'){
                        onLoad(r.Data);
                    }
                }
            })

        }
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    const formik = useFormik({
        initialValues: {},
        //validationSchema: getValidationSchema(profileData),
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {

            setIsLoading(true);
            if (typeof isFormSubmit === 'function'){
                isFormSubmit(true);
            }
            
            let postData = { ...modelData, Members: membersData };

            let allDisclosuresAccepted = true;
            postData.Members.forEach((member) => {
                member.Disclosures.forEach((disclosure) => {
                    if (disclosure.AllowToSign && !isNullOrEmpty(disclosure.ReadAgreementMessage) && !disclosure.AcceptAgreement && allDisclosuresAccepted) {
                        allDisclosuresAccepted = false;

                        ModalClose({
                            title: '',
                            content: t('disclosure.shouldAgree', { name: disclosure.Name }),
                            showIcon: false,
                        });
                    }
                });
            });


            if (!allDisclosuresAccepted) {
                setIsLoading(false);
                isFormSubmit(false);
                return;
            }

            appService.post(`/app/Online/Disclosures/Pending?id=${orgId}`, postData).then(r => {
                if (toBoolean(r?.IsValid)){
                    pNotify(t('reservation.waiversSuccessfullySigned'));
                    setIsLoading(false);
                    isFormSubmit(false);
                    
                    if (typeof onPostSuccess === 'function'){
                        onPostSuccess(r);
                    }
                } else{
                    setIsLoading(false);
                    isFormSubmit(false);
                    ModalClose({
                        content: r.Message,
                        showIcon: false
                    });
                }
            })
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!toBoolean(isModal)){
            setIsFooterVisible(true);
            setHeaderRightIcons(null);

            setFooterContent(anyInList(membersData) ?
                <PaddingBlock topBottom={true}>
                    <Button type="primary"
                            block
                            htmlType="submit"
                            disabled={isFetching || !toBoolean(modelData?.LogInMemberIsAllowedToSign)}
                            loading={isLoading}
                            onClick={formik.handleSubmit}>
                        {t('disclosure.saveSignature')}
                    </Button>
                </PaddingBlock> : '');
        }
    }, [isFetching, modelData, isLoading]);

    const handleCheckboxChange = (memberIndex, disclosureIndex) => {
        const updatedMembers = [...membersData];

        updatedMembers[memberIndex].Disclosures[disclosureIndex].AcceptAgreement =
            !updatedMembers[memberIndex].Disclosures[disclosureIndex].AcceptAgreement;

        // Update the state with the new values
        setMembersData(updatedMembers);
    };

    useEffect(() => {
        if (!selectedWaiverToSign){
            if (sigCanvasRef.current) {
                sigCanvasRef.current.clear();
            }
        }
    }, [selectedWaiverToSign]);

    const clearSignature = () => {
        if (sigCanvasRef.current) {
            sigCanvasRef.current.clear();

            setSelectedWaiverToSign(prevState => ({
                ...prevState,
                SignatureDataUrl: ''
            }));

            const updatedMembers = [...membersData];

            const memberIndex = membersData.findIndex(
                (member) =>
                    member.Disclosures.some((disclosure) => disclosure.Id === selectedWaiverToSign.Id)
            );
            const disclosureIndex = membersData[memberIndex].Disclosures.findIndex(
                (disclosure) => disclosure.Id === selectedWaiverToSign.Id
            );
            updatedMembers[memberIndex].Disclosures[disclosureIndex].SignatureDataUrl = "";
            setMembersData(updatedMembers);
        }
    };


    const saveSignature = () => {
        if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const dataUrl = sigCanvasRef.current.toDataURL();

            const updatedMembers = [...membersData];
            const memberIndex = membersData.findIndex(
                (member) =>
                    member.Disclosures.some((disclosure) => disclosure.Id === selectedWaiverToSign.Id)
            );
            const disclosureIndex = membersData[memberIndex].Disclosures.findIndex(
                (disclosure) => disclosure.Id === selectedWaiverToSign.Id
            );

            updatedMembers[memberIndex].Disclosures[disclosureIndex].SignatureDataUrl = dataUrl;
            setMembersData(updatedMembers);

            setSelectedWaiverToSign(prevState => ({
                ...prevState,
                SignatureDataUrl: dataUrl
            }));
        }
    };

    useEffect(() => {
        if (selectedWaiverToView && selectedWaiverToView.FullPath) {
            const fetchPdf = async () => {
                const base64String = await getPdfFileDataUrl(selectedWaiverToView.FullPath);
                if (base64String) {
                    setPdfDataUrl(`data:application/pdf;base64,${base64String}`);
                }
            };

            fetchPdf();
        } else {
            setPdfDataUrl('');
        }
    }, [selectedWaiverToView]);
    
    return (
        <>
            <PaddingBlock topBottom={!isModal} leftRight={false}>
                {isFetching &&
                    <Flex vertical={true} gap={token.padding} style={{overflow: 'auto'}}>
                        <PaddingBlock leftRight={true}>
                            {emptyArray(4).map((item, index) => (
                                <div key={index}>
                                    <Skeleton.Button active={true} block style={{width: `${randomNumber(30, 45)}%`}}/>
                                    <Skeleton active={true} />
                                    <Skeleton.Button active={true} block style={{height: `160px`}}/>

                                    {index !== 3 &&
                                        <Divider />
                                    }
                                </div>
                            ))}
                        </PaddingBlock>
                    </Flex>
                }

                {!isFetching &&
                    <>
                        {!toBoolean(modelData?.LogInMemberIsAllowedToSign)  ?
                            (<PaddingBlock leftRight={true}>
                                <Alert
                                    description={t('disclosure.notAllowToSignMessage')}
                                    type="error"
                                />
                            </PaddingBlock>) :
                            (
                                <>
                                    {anyInList(membersData) ? (
                                        <>
                                            {membersData.map((member, memberIndex) => (
                                                <div key={memberIndex}>
                                                    {member.Disclosures.map((disclosure, disclosureIndex) => {
                                                        if (!toBoolean(disclosure.AllowToSign)){
                                                            return (<></>);
                                                        }

                                                        return (
                                                            <div key={disclosureIndex}>
                                                                <PaddingBlock leftRight={true}>
                                                                    <Flex gap={token.Custom.buttonPadding} vertical={true}>
                                                                        <Button type="primary"
                                                                                block
                                                                                onClick={() => {setSelectedWaiverToView(disclosure)}}
                                                                                htmlType="button">
                                                                            {t('disclosure.viewWaiverButton', {name: disclosure.Name})}
                                                                        </Button>

                                                                        {!isNullOrEmpty(disclosure.RuleInstructions) &&
                                                                            <IframeContent content={disclosure.RuleInstructions}
                                                                                           id={disclosure?.Id}/>
                                                                        }

                                                                        {!isNullOrEmpty(disclosure.ReadAgreementMessage) &&
                                                                            <Checkbox
                                                                                checked={disclosure.AcceptAgreement}
                                                                                onChange={() => handleCheckboxChange(memberIndex, disclosureIndex)}
                                                                            >
                                                                                {disclosure.ReadAgreementMessage}
                                                                            </Checkbox>
                                                                        }

                                                                        <Flex className={globalStyles.waiverUploadFlex}
                                                                              vertical={true}
                                                                              gap={token.Custom.buttonPadding}
                                                                              onClick={() => {
                                                                                  setSelectedWaiverToSign(disclosure);
                                                                              }}>
                                                                            <>
                                                                                <Upload
                                                                                    name="avatar"
                                                                                    listType="picture-card"
                                                                                    className="avatar-uploader"
                                                                                    showUploadList={false}
                                                                                    disabled={true}
                                                                                    //onChange={handleChange}
                                                                                >
                                                                                    {isNullOrEmpty(disclosure.SignatureDataUrl) ? (
                                                                                            <Title
                                                                                                level={3}>{t('disclosure.clickToSign')}</Title>
                                                                                        ) :
                                                                                        (
                                                                                            <img
                                                                                                src={disclosure.SignatureDataUrl}
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                    objectFit: 'contain',
                                                                                                    height: '100%'
                                                                                                }}/>
                                                                                        )}
                                                                                </Upload>

                                                                                {!isNullOrEmpty(disclosure.SignatureDataUrl) &&
                                                                                    <Flex gap={token.Custom.buttonPadding}
                                                                                          vertical={true}>
                                                                                        <div>
                                                                                            <Title level={1}
                                                                                                   className={globalStyles.noMargin}>{t('disclosure.signedBy')}</Title>
                                                                                            <Text>{authData?.MemberFirstName} {authData?.MemberLastName}</Text>
                                                                                        </div>
                                                                                    </Flex>
                                                                                }
                                                                            </>
                                                                        </Flex>
                                                                    </Flex>
                                                                </PaddingBlock>

                                                                {disclosureIndex !== member.Disclosures.length - 1 &&
                                                                    <Divider/>}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            ))}
                                        </>
                                    ) :
                                        (
                                            <EmptyBlock description={t('disclosure.noWaivers')} type={emptyBlockTypes.WAIVER}/>
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                }
            </PaddingBlock>

            <DrawerBottom
                showDrawer={!isNullOrEmpty(selectedWaiverToSign)}
                closeDrawer={() => {
                    setSelectedWaiverToSign(null)
                }}
                label={selectedWaiverToSign?.Name}
                maxHeightVh={80}
                showButton={true}
                customFooter={<Flex gap={token.padding}>
                    <Button type={'primary'} danger block
                            disabled={isNullOrEmpty(selectedWaiverToSign?.SignatureDataUrl)} onClick={clearSignature}>
                        {t('clear')}
                    </Button>

                    <Button type={'primary'} block onClick={() => {
                        setSelectedWaiverToSign(null)
                    }}>
                        {t('close')}
                    </Button>
                </Flex>}
            >
                <div style={{backgroundColor: token.colorBgContainerDisabled}}>
                    <div style={{padding: `${token.padding}px`}}>
                        <Card ref={cardRef} className={globalStyles.signatureCanvasCard}>
                            <SignatureCanvas
                                ref={sigCanvasRef}
                                penColor="black"
                                canvasProps={{width: canvasWidth, height: 400, className: 'sigCanvas'}}
                                onEnd={saveSignature}
                            />
                        </Card>
                    </div>
                </div>
            </DrawerBottom>

            <DrawerBottom
                showDrawer={!isNullOrEmpty(selectedWaiverToView)}
                closeDrawer={() => {
                    setSelectedWaiverToView(null)
                }}
                label={selectedWaiverToView?.Name}
                maxHeightVh={80}
                showButton={true}
                customFooter={<Flex gap={token.padding}>
                    {equalString(selectedWaiverToView?.ContentType, 2) &&
                        <Button type="primary" block icon={<DownloadOutlined />} onClick={() => {openPdfInNewTab(selectedWaiverToView?.FullPath)}}>
                            {t('disclosure.downloadFile')}
                        </Button>
                    }

                    <Button type={'primary'} block onClick={() => {
                        setSelectedWaiverToView(null)
                    }}>
                        {t('close')}
                    </Button>
                </Flex>}
            >
                <PaddingBlock>
                    {equalString(selectedWaiverToView?.ContentType, 2) &&
                        <>
                            {isFileType(selectedWaiverToView?.FullPath, 'pdf') &&
                                <>
                                    {(!isNullOrEmpty(selectedWaiverToView?.FullPath)) &&
                                        <>
                                            {isNullOrEmpty(pdfDataUrl) &&
                                                <Skeleton.Button active={true} block style={{height: `160px`}}/>
                                            }

                                            {!isNullOrEmpty(pdfDataUrl) &&
                                                <Document file={pdfDataUrl} />
                                            }
                                        </>
                                    }
                                </>
                            }
                            {!isFileType(selectedWaiverToView?.FullPath, 'pdf')  &&
                                <>
                                    <Text>{selectedWaiverToView?.FileName}</Text>
                                </>
                            }
                        </>
                    }
                    {!equalString(selectedWaiverToView?.ContentType, 2) &&
                        <>
                            {!isNullOrEmpty(selectedWaiverToView?.DisclosureText) &&
                                <IframeContent content={selectedWaiverToView?.DisclosureText} id={'modal-disclosure'}/>
                            }
                        </>
                    }
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
})

export default DisclosuresPartial
