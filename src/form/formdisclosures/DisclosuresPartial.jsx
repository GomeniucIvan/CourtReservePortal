import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, isNullOrEmpty, moreThanOneInList, toBoolean} from "@/utils/Utils.jsx";
import {Alert, Button, Card, Flex, Skeleton, Typography} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {pNotify} from "@/components/notification/PNotify.jsx";
import EmptyBlock, {emptyBlockTypes} from "@/components/emptyblock/EmptyBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import DisclosureBlock from "@/form/formdisclosures/DisclosureBlock.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";

const DisclosuresPartial = forwardRef(({readUrl, onPostSuccess, onLoad, isModal, disclosureData, navigate, isFormSubmit}, ref) => {
    const [isFetching, setIsFetching] = useState(true);
    const {setHeaderRightIcons} = useHeader();
    const{isLoading, setIsFooterVisible, shouldFetch, resetFetch, setIsLoading, token, setFooterContent, globalStyles} = useApp();
    const [modelData, setModelData] = useState(null);
    const [membersData, setMembersData] = useState(null);

    useImperativeHandle(ref, () => ({
        submit: () => {
            formik.handleSubmit();
        },
    }));

    const {orgId, authData} = useAuth();
    const {t} = useTranslation('');

    const loadData = async (refresh) => {
        if (isModal){
            setModelData(disclosureData);
            setMembersData(disclosureData.Members);
            setIsFetching(false);
            setIsLoading(false);

        } else {
            setIsFetching(true);

            let response = await appService.get(navigate, readUrl);
            if (response.IsValid){
                setModelData(response.Data);
                setMembersData(response.Data.Members);
                setIsFetching(false);
                setIsLoading(false);

                if (typeof onLoad === 'function'){
                    onLoad(response.Data);
                }
            }
        }
        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    const formik = useCustomFormik({
        initialValues: {},
        validation: () => {
            let isValidDisclosures = true;

            membersData.forEach((member) => {
                member.Disclosures.forEach((disclosure) => {
                    if (disclosure.AllowToSign && !isNullOrEmpty(disclosure.ReadAgreementMessage) && !disclosure.AcceptAgreement) {
                        isValidDisclosures = false;
                        disclosure.Status = 'Error';
                    }
                });
            });
            
            if (!isValidDisclosures) {
                setMembersData(membersData);
            }
            
            return isValidDisclosures;
        },
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

                        displayMessageModal({
                            title: "Agreement Requirement",
                            html: (onClose) => t('disclosure.shouldAgree', { name: disclosure.Name }),
                            type: "warning",
                            buttonType: modalButtonType.DEFAULT_CLOSE,
                            onClose: () => {},
                        })
                    }
                });
            });

            if (!allDisclosuresAccepted) {
                setIsLoading(false);
                if (typeof isFormSubmit === 'function'){
                    isFormSubmit(false);
                }
                return;
            }

            appService.post(`/app/Online/Disclosures/Pending?id=${orgId}`, postData).then(r => {
                if (toBoolean(r?.IsValid)){
                    pNotify(t('disclosure.waiversSuccessfullySigned'));
                    setIsLoading(false);
                    if (typeof isFormSubmit === 'function'){
                        isFormSubmit(false);
                    }

                    if (typeof onPostSuccess === 'function'){
                        onPostSuccess(r);
                    }
                } else{
                    setIsLoading(false);
                    if (typeof isFormSubmit === 'function'){
                        isFormSubmit(false);
                    }

                    displayMessageModal({
                        title: "Server error",
                        html: (onClose) => r.Message,
                        type: "error",
                        buttonType: modalButtonType.DEFAULT_CLOSE,
                        onClose: () => {

                        },
                    })
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

    return (
        <>
            <PaddingBlock topBottom={!isModal}>
                <Flex vertical={true} gap={token.padding}>
                    {isFetching &&
                        <>
                            {emptyArray(4).map((item, index) => (
                                <Card key={index} className={globalStyles.card}>
                                    <Flex vertical={true} gap={12}>
                                        <Skeleton.Button active={true} block/>
                                        <Skeleton.Button active={true} block style={{height: `100px`}} />
                                        <Skeleton.Button active={true} block/>
                                    </Flex>
                                </Card>
                            ))}
                        </>
                    }

                    {(!isFetching && !toBoolean(modelData?.LogInMemberIsAllowedToSign)) &&
                        <Alert
                            description={t('disclosure.notAllowToSignMessage')}
                            type="error"
                        />
                    }

                    {(!isFetching && toBoolean(modelData?.LogInMemberIsAllowedToSign)) &&
                        <>
                            {anyInList(membersData) ? (
                                    <>
                                        {membersData.map((member, memberIndex) => {
                                            return (
                                                <div key={memberIndex}>
                                                    {member.Disclosures.map((disclosure, disclosureIndex) => {
                                                        if (!toBoolean(disclosure.AllowToSign)){
                                                            return (<></>);
                                                        }

                                                        let memberFullName = `${authData?.MemberFirstName} ${authData?.MemberLastName}`;

                                                        return (
                                                           <div key={disclosureIndex}>
                                                               <DisclosureBlock memberFullName={memberFullName}
                                                                                disclosure={disclosure}
                                                                                membersData={membersData}
                                                                                setMembersData={setMembersData}
                                                                                handleReadAgreementCheckboxChange={handleCheckboxChange}
                                                                                type={'waivers'}
                                                                                onSign={(dataUrl) => {
                                                                                    const updatedMembers = [...membersData];
                                                                                    updatedMembers[memberIndex].Disclosures[disclosureIndex].SignatureDataUrl = dataUrl;
                                                                                    setMembersData(updatedMembers);
                                                                                }}
                                                                                onClear={() => {
                                                                                    const updatedMembers = [...membersData];
                                                                                    updatedMembers[memberIndex].Disclosures[disclosureIndex].SignatureDataUrl = "";
                                                                                    setMembersData(updatedMembers);
                                                                                }}
                                                                                onAcceptAgreementChange={(e) => {
                                                                                    handleCheckboxChange(memberIndex, disclosureIndex);
                                                                                }}/>
                                                           </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </>
                                ) :
                                (
                                    <EmptyBlock description={t('disclosure.noWaivers')} type={emptyBlockTypes.WAIVER}/>
                                )
                            }
                        </>
                    }
                </Flex>
            </PaddingBlock>
        </>
    )
})

export default DisclosuresPartial
