import {useStyles} from "./styles.jsx";
import {Button, Card, Checkbox, Flex, Skeleton, Typography, Upload} from "antd";
import {useApp} from "../../context/AppProvider.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import React, {useEffect, useRef, useState} from "react";
import {DownloadOutlined} from "@ant-design/icons";
import {getPdfFileDataUrl, isFileType, openPdfInNewTab} from "@/utils/FileUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Document, pdfjs} from "react-pdf";
import {useTranslation} from "react-i18next";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import SignatureCanvas from 'react-signature-canvas'
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {cx} from 'antd-style';
import BrowserBlock from "@/components/browserblock/BrowserBlock.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

const {Text, Title} = Typography;


function DisclosureBlock({disclosure,
                             memberFullName, 
                             formik, 
                             membersData,   //disclosure page
                             setMembersData,   //disclosure page
                             onSign,
                             onClear,
                             dateTimeDisplay,
                             handleReadAgreementCheckboxChange
}) {
    const {globalStyles, token} = useApp();
    const [selectedWaiverToView, setSelectedWaiverToView] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - (token.padding * 2));
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const cardRef = useRef(null);
    const {t} = useTranslation('');
    const sigCanvasRef = useRef(null);
    const [selectedWaiverToSign, setSelectedWaiverToSign] = useState(null);
    const [instructionsIndexToShow, setInstructionsIndexToShow] = useState(null);
    
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

            if (typeof onClear === 'function') {
                onClear();
            } else if (!isNullOrEmpty(membersData)) {
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
        }
    };


    const saveSignature = () => {
        if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const dataUrl = sigCanvasRef.current.toDataURL();

            if (typeof onSign === 'function') {
                onSign(dataUrl);
            } else if (!isNullOrEmpty(membersData)) {
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
            }

            setSelectedWaiverToSign(prevState => ({
                ...prevState,
                SignatureDataUrl: dataUrl
            }));
        }
    };
    
    return (
        <>
            {!isNullOrEmpty(disclosure?.RuleInstructions) &&
                <Button onClick={() => {setInstructionsIndexToShow(true)}} block={true}>
                    Instructions
                </Button>
            }

            <Flex className={cx(globalStyles.waiverUploadFlex,!isNullOrEmpty(disclosure.SignatureDataUrl) && globalStyles.waiverUploadSigned )}
                  vertical={true}
                  gap={token.Custom.buttonPadding}
                  onClick={() => {
                      let currentSignatureDataUrl = disclosure.SignatureDataUrl;
                      if (sigCanvasRef.current && !isNullOrEmpty(currentSignatureDataUrl)) {
                          sigCanvasRef.current.fromDataURL(currentSignatureDataUrl,{
                              width: canvasWidth,
                              height: 400,
                          });
                      }
                      
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
                                <Title level={3}>{t('disclosure.clickToSign')}</Title>
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
                        <Flex gap={token.Custom.buttonPadding} justify="space-between">
                            <Flex vertical={true}>
                                <Title level={5} className={globalStyles.noMargin}>{t('disclosure.signedBy')}</Title>
                                <Text style={{fontSize: `${token.fontSizeSM}px`}}>{memberFullName}</Text>
                            </Flex>

                            <Flex vertical={true} justify="end" style={{textAlign: 'end'}}>
                                <Title level={5} className={globalStyles.noMargin}>Signed On</Title>
                                <Text style={{fontSize: `${token.fontSizeSM}px`}}>{dateTimeDisplay}</Text>
                            </Flex>
                        </Flex>
                    }
                </>
            </Flex>
            
            <Button type="primary"
                    block
                    onClick={() => {setSelectedWaiverToView(disclosure)}}
                    htmlType="button">
                {t('disclosure.viewWaiverButton', {name: disclosure.Name})}
            </Button>
            
            {/*{!isNullOrEmpty(disclosure.ReadAgreementMessage) &&*/}
            {/*    <Checkbox*/}
            {/*        checked={disclosure.AcceptAgreement}*/}
            {/*        onChange={handleReadAgreementCheckboxChange}*/}
            {/*    >*/}
            {/*        {disclosure.ReadAgreementMessage}*/}
            {/*    </Checkbox>*/}
            {/*}*/}
            
            {/*INSTRUCTIONS*/}
            <DrawerBottom showDrawer={instructionsIndexToShow}
                          maxHeightVh={60}
                          closeDrawer={() => {setInstructionsIndexToShow(false)}}
                          onConfirmButtonClick={() => {setInstructionsIndexToShow(false)}}
                          showButton={true}
                          confirmButtonText={'Close'}
                          label={'Instructions'}>
                {!isNullOrEmpty(disclosure?.RuleInstructions) &&
                    <PaddingBlock topBottom={true}>
                        <Text>
                            <div dangerouslySetInnerHTML={{__html: disclosure?.RuleInstructions}}/>
                        </Text>
                    </PaddingBlock>
                }
            </DrawerBottom>
            
            
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
                customFooter={<Flex vertical={true} gap={token.paddingMD}>
                    {!isNullOrEmpty(selectedWaiverToView?.ReadAgreementMessage) &&
                        <FormSwitch formik={formik}
                                    name={`test`}
                                    rows={2}
                                    checked={toBoolean(selectedWaiverToView?.AcceptAgreement)}
                                    label={'By signing I agree to the terms and conditions of this Membership Agreement'} />
                    }

                    <Flex gap={token.padding}>
                        {equalString(selectedWaiverToView?.ContentType, 2) &&
                            <Button type="primary" block icon={<DownloadOutlined />} onClick={() => {openPdfInNewTab(selectedWaiverToView?.FullPath)}}>
                                {t('disclosure.downloadFile')}
                            </Button>
                        }

                        <Button type={'primary'} 
                                block 
                                onClick={() => {
                                    if (!isNullOrEmpty(disclosure.ReadAgreementMessage)) {
                                        if (toBoolean(disclosure.ReadAgreementMessage)) {
                                            setSelectedWaiverToView(null)
                                        } else {
                                            displayMessageModal({
                                                title: 'Error',
                                                html: (onClose) => `Please agree ${disclosure?.Name}.`,
                                                type: "warning",
                                                buttonType: modalButtonType.DEFAULT_CLOSE,
                                                onClose: () => {

                                                },
                                            })
                                        }
                                    } else {
                                        setSelectedWaiverToView(null)
                                    }
                        }}>
                            {!isNullOrEmpty(disclosure?.ReadAgreementMessage) ? 'Agree' : t('close')}
                        </Button>
                    </Flex>
                </Flex>
               }
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
}

export default DisclosureBlock
