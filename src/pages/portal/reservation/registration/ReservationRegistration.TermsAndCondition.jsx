import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    fullNameInitials,
    isNullOrEmpty,
    toBoolean
} from "@/utils/Utils.jsx";
import React, {useEffect, useState} from "react";
import appService, {apiRoutes} from "@/api/app.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import FormCheckbox from "@/form/formcheckbox/FomCheckbox.jsx";
import {DownloadOutlined} from "@ant-design/icons";
import {getPdfFileDataUrl, isFileType, openPdfInNewTab} from "@/utils/FileUtils.jsx";
import {Document} from "react-pdf";
import IframeContent from "@/components/iframecontent/IframeContent.jsx";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const {Title, Text} = Typography;

function ReservationRegistrationTermsAndCondition({disclosure, formik }) {
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);
    const [pdfDataUrl, setPdfDataUrl] = useState(null);
    const [selectedWaiverToView, setSelectedWaiverToView] = useState(null);
    const {t} = useTranslation('');
    const {orgId} = useAuth();
    const navigate = useNavigate();
    const { token} = useApp();
    
    useEffect(() => {
        if (isNullOrEmpty(selectedWaiverToView)) {
            appService.get(navigate, `/app/Online/Disclosures/GetDisclosureDetailsById?id=${orgId}&disclosureId=${disclosure.Id}`).then(response => {
                if (toBoolean(response?.IsValid)) {
                    const incWaiver = response.Data;

                    if (incWaiver && incWaiver.FullPath) {
                        const fetchPdf = async () => {
                            const base64String = await getPdfFileDataUrl(incWaiver.FullPath);
                            if (base64String) {
                                setPdfDataUrl(`data:application/pdf;base64,${base64String}`);
                            }
                        };

                        fetchPdf();
                    } else {
                        setPdfDataUrl('');
                    }

                    setSelectedWaiverToView(incWaiver);
                }
            })
        }
    }, [showTermAndCondition]);
    
    return (
        <>
            {!isNullOrEmpty(disclosure) &&
                <FormCheckbox label={disclosure?.Name}
                              formik={formik}
                              name={'DisclosureAgree'}
                              text={`I agree to the `}
                              description={'Terms and Conditions'}
                              descriptionClick={() => setShowTermAndCondition(true)}/>
            }

            {/*//term drawer*/}
            <DrawerBottom
                showDrawer={showTermAndCondition}
                showButton={true}
                customFooter={<Flex gap={token.padding}>
                    {!isNullOrEmpty(selectedWaiverToView) &&
                        <>
                            {equalString(selectedWaiverToView?.ContentType, 2) &&
                                <Button type="primary" block icon={<DownloadOutlined/>} onClick={() => {
                                    openPdfInNewTab(selectedWaiverToView?.FullPath)
                                }}>
                                    {t('disclosure.downloadFile')}
                                </Button>
                            }
                        </>
                    }

                    <Button type={'primary'} block onClick={() => {
                        setShowTermAndCondition(false)
                    }}>
                        {t('close')}
                    </Button>
                </Flex>}
                closeDrawer={() => setShowTermAndCondition(false)}
                label={'Terms and Conditions'}
                onConfirmButtonClick={() => setShowTermAndCondition(false)}
            >
                <PaddingBlock>
                    {isNullOrEmpty(selectedWaiverToView) &&
                        <Skeleton.Button active={true} block style={{height: `200px`}}/>
                    }

                    {!isNullOrEmpty(selectedWaiverToView) &&
                        <>
                            {equalString(selectedWaiverToView?.ContentType, 2) &&
                                <>
                                    {isFileType(selectedWaiverToView?.FullPath, 'pdf') &&
                                        <>
                                            {(!isNullOrEmpty(selectedWaiverToView?.FullPath)) &&
                                                <>
                                                    {isNullOrEmpty(pdfDataUrl) &&
                                                        <Skeleton.Button active={true} block
                                                                         style={{height: `160px`}}/>
                                                    }

                                                    {!isNullOrEmpty(pdfDataUrl) &&
                                                        <Document file={pdfDataUrl}/>
                                                    }
                                                </>
                                            }
                                        </>
                                    }
                                    {!isFileType(selectedWaiverToView?.FullPath, 'pdf') &&
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
                        </>
                    }
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ReservationRegistrationTermsAndCondition