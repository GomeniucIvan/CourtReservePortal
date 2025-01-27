import {useStyles} from "./styles.jsx";
import {Button, Card, Flex, Skeleton, Switch, Typography, Upload} from "antd";
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
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import {cx} from 'antd-style';
import {Ellipsis} from "antd-mobile";
import {addCypressTag} from "@/utils/TestUtils.jsx";
import SVG from "@/components/svg/SVG.jsx";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;

const {Text, Title} = Typography;


function DisclosureBlock({disclosure,
                             memberFullName, 
                             type='disclosure', //disclosure(create acc by membership), waivers -- waivers page
                             formik, 
                             membersData,   //disclosure page
                             setMembersData,   //disclosure page
                             onSign,
                             onClear,
                             dateTimeDisplay,
                             onAcceptAgreementChange
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
    const {styles} = useStyles();
    
    useEffect(() => {
        if (selectedWaiverToView && selectedWaiverToView.FullPath) {
            const fetchPdf = async () => {
                const base64String = await getPdfFileDataUrl(selectedWaiverToView.FullPath);
                if (base64String) {
                    //setPdfDataUrl(`data:application/pdf;base64,${base64String}`);
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

            onClear();
        }
    };


    const saveSignature = () => {
        if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
            const dataUrl = sigCanvasRef.current.toDataURL();

            onSign(dataUrl);

            setSelectedWaiverToSign(prevState => ({
                ...prevState,
                SignatureDataUrl: dataUrl
            }));
        }
    };

    const displayWaiverDescriptionWithStatus = (item, itemHasError) => {
        let text = ' Please review and sign this Membership Agreement.';
        if (equalString('waivers', type)) {
            text = ` Please review and sign this Waiver.`
        }
        
        let status = <Text>{text}</Text>

        if (equalString(item.Status, 'Success') || (!isNullOrEmpty(item.SignatureDataUrl) && toBoolean(item.AcceptAgreement))) {
            status = <Flex gap={token.paddingSM}><SVG icon='circle-check' preventFill={true} /> Completed</Flex>;
        }
        else if (equalString(item.Status, 'error') || itemHasError) {
            status = <Flex gap={token.paddingSM} style={{color: token.colorError}}><SVG icon='alert-triangle' preventFill={true} />{text}</Flex>;
        }

        return status;
    }
    
    let isSignedWaiver = toBoolean(disclosure.AcceptAgreement) && !isNullOrEmpty(disclosure.SignatureDataUrl);
    let isErrorState = !isSignedWaiver && equalString(disclosure?.Status, 'error');
    
    let cardTitle = `Membership Agreement: ${disclosure?.Name}`;
    if (equalString(type, 'waivers')) {
        cardTitle = disclosure?.Name;
    }
    
    return (
        <>
            <Flex vertical={true} gap={20} className={cx(styles.disclosureBlock, isErrorState && styles.errorBlock)}>
                <Flex vertical={true} gap={4}>
                    <Title level={3}>{cardTitle}<Text style={{color: token.colorError}}>*</Text></Title>
                    {displayWaiverDescriptionWithStatus(disclosure)}
                </Flex>
                {!isNullOrEmpty(disclosure?.RuleInstructions) &&
                    <Button onClick={() => {setInstructionsIndexToShow(true)}} block={true}>
                        Instructions
                    </Button>
                }

                <Flex className={cx(globalStyles.waiverUploadFlex)}
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
                    {!isNullOrEmpty(disclosure?.ReadAgreementMessage) ? t('disclosure.viewWaiverButton', {name: disclosure.Name}) : `View ${disclosure.Name}` }
                </Button>
            </Flex>
            
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
                        {isNullOrEmpty(selectedWaiverToSign?.SignatureDataUrl) &&
                            <>{t('close')}</>
                        }
                        {!isNullOrEmpty(selectedWaiverToSign?.SignatureDataUrl) &&
                            <>Save</>
                        }
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
                label={disclosure?.Name}
                maxHeightVh={80}
                showButton={true}
                customFooter={<Flex vertical={true} gap={token.paddingMD}>
                    {!isNullOrEmpty(disclosure?.ReadAgreementMessage) &&
                        <Flex justify={"space-between"} align={"center"} style={{height: 44}}>
                            <Text onClick={() => {onAcceptAgreementChange(!disclosure?.AcceptAgreement)}}>
                                <Ellipsis direction='end' rows={2} content={'By signing I agree to the terms and conditions of this Membership Agreement'}/>
                            </Text>

                            <Switch {...addCypressTag(`disclosure_${disclosure?.Id}`)}
                                    checked={toBoolean(disclosure?.AcceptAgreement)}
                                    onChange={onAcceptAgreementChange} />
                        </Flex>
                    }

                    <Flex gap={token.padding}>
                        {equalString(selectedWaiverToView?.ContentType, 2) &&
                            <Button type="default" block icon={<DownloadOutlined />} onClick={() => {openPdfInNewTab(selectedWaiverToView?.FullPath)}}>
                                {t('disclosure.downloadFile')}
                            </Button>
                        }

                        <Button type={ 'primary'} 
                                block 
                                onClick={() => {
                                    if (!isNullOrEmpty(disclosure.ReadAgreementMessage)) {
                                        if (disclosure?.AcceptAgreement) {
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
