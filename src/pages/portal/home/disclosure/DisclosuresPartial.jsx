import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useEffect, useState, useRef, forwardRef, useImperativeHandle} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, focus, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {Alert, Button, Card, Checkbox, Divider, Flex, Skeleton, Typography, Upload} from "antd";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {useFormik} from "formik";
import {useTranslation} from "react-i18next";
import {pNotify} from "@/components/notification/PNotify.jsx";
import EmptyBlock, {emptyBlockTypes} from "@/components/emptyblock/EmptyBlock.jsx";
import {randomNumber} from "@/utils/NumberUtils.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {displayMessageModal} from "@/context/MessageModalProvider.jsx";
import {modalButtonType} from "@/components/modal/CenterModal.jsx";
import DisclosureBlock from "@/components/disclosureBlock/DisclosureBlock.jsx";

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
                                                                       <DisclosureBlock memberFullName={`${authData?.MemberFirstName} ${authData?.MemberLastName}`}
                                                                                        disclosure={disclosure}
                                                                                        membersData={membersData}
                                                                                        setMembersData={setMembersData}
                                                                                        handleReadAgreementCheckboxChange={handleCheckboxChange}/>
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
        </>
    )
})

export default DisclosuresPartial
