import {useStyles} from "./styles.jsx";
import {useNavigate} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import React, {useEffect, useState, useRef} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {isNullOrEmpty, randomNumber, toBoolean} from "../../../utils/Utils.jsx";
import {Alert, Button, Card, Checkbox, Divider, Flex, Skeleton, Typography, Upload} from "antd";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import IframeContent from "../../../components/iframecontent/IframeContent.jsx";
import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import SignatureCanvas from 'react-signature-canvas'
const {Title, Text} = Typography;

function DisclosurePending({scope}) {
    const navigate = useNavigate();
    const { styles } = useStyles();
    const [isFetching, setIsFetching] = useState(true);

    const{isLoading, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const [modelData, setModelData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const [selectedWaiverToSign, setSelectedWaiverToSign] = useState(null);
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - (token.padding * 2));
    const {orgId} = useAuth();
    const {t} = useTranslation('');
    const cardRef = useRef();
    const sigCanvasRef = useRef();
    
    const loadData = (refresh) => {
        setIsFetching(true);

        appService.get(navigate, `/app/Online/Disclosures/Pending?id=${orgId}&scope=${scope}`).then(r => {
            console.log(r.Data)
            if (r.IsValid){
                setModelData(r.Data);
                setMembersData(r.Data.Members);
                setIsFetching(false);
                setIsLoading(false);
            }
        })

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


        },
    });

    useEffect(() => {
        loadData();
    }, []);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);

        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching || !toBoolean(modelData?.LogInMemberIsAllowedToSign)}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                {t('disclosure.saveSignature')}
            </Button>
        </PaddingBlock>);
    }, [isFetching, modelData]);

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
    
    return (
        <>
            <PaddingBlock topBottom={true} leftRight={false}>
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
                                    {membersData.map((member, memberIndex) => (
                                        <div key={memberIndex}>
                                            {member.Disclosures.map((disclosure, disclosureIndex) => (
                                                <div key={disclosureIndex}>
                                                    <PaddingBlock leftRight={true}>
                                                        <Flex gap={token.Custom.buttonPadding} vertical={true}>
                                                            <Button type="primary"
                                                                    block
                                                                    htmlType="button">
                                                                {t('disclosure.viewWaiverButton' , {name: disclosure.Name})}
                                                            </Button>
                                                            <IframeContent content={disclosure.RuleInstructions} id={disclosure?.Id}/>

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
                                                                            <Title level={4}>{t('disclosure.clickToSign')}</Title> 
                                                                        ) :
                                                                            (
                                                                                <img src={disclosure.SignatureDataUrl} style={{width: '100%', objectFit: 'contain', height: '100%'}}/>
                                                                            )}
                                                                    </Upload>

                                                                    {!isNullOrEmpty(disclosure.SignatureDataUrl) &&
                                                                        <Flex gap={token.Custom.buttonPadding} vertical={true}>
                                                                            <div>
                                                                                <Title level={5} className={globalStyles.noMargin}>{t('disclosure.signedBy')}</Title>
                                                                                <Text>{modelData?.AuthMemberFullName}</Text>
                                                                            </div>
                                                                        </Flex>
                                                                    }
                                                                </>
                                                            </Flex>
                                                        </Flex>
                                                    </PaddingBlock>

                                                    {disclosureIndex !== member.Disclosures.length - 1 && <Divider />}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )
                        }
                    </>
                }
            </PaddingBlock>

            <DrawerBottom
                showDrawer={!isNullOrEmpty(selectedWaiverToSign)}
                closeDrawer={() => {setSelectedWaiverToSign(null)}}
                label={selectedWaiverToSign?.Name}
                maxHeightVh={80}
                showButton={true}
                customFooter={<Flex gap={token.padding}>
                    <Button type={'primary'} danger block disabled={isNullOrEmpty(selectedWaiverToSign?.SignatureDataUrl)} onClick={clearSignature}>
                        {t('clear')}
                    </Button>

                    <Button type={'primary'} block onClick={() => {setSelectedWaiverToSign(null)}}>
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
                                canvasProps={{ width: canvasWidth, height: 400, className: 'sigCanvas' }}
                                onEnd={saveSignature}
                            />
                        </Card>
                    </div>
                </div>
            </DrawerBottom>
        </>
    )
}

export default DisclosurePending
