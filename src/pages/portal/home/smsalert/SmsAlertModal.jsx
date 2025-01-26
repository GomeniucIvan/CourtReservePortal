import * as React from "react";
import {useEffect, useState} from "react";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {Button, Card, Divider, Flex, Switch, Typography} from "antd";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {useFormik} from "formik";
import {toBoolean} from "@/utils/Utils.jsx";
import SVG from "@/components/svg/SVG.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {toLocalStorage} from "@/storage/AppStorage.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import {useNavigate} from "react-router-dom";
const {Title, Text} = Typography;

function SmsAlert() {
    const {setHeaderRightIcons} = useHeader();
    const {token, globalStyles, setIsFooterVisible, setFooterContent} = useApp();
    const {orgId, authData} = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
    }, []);
    
    const formik = useFormik({
        initialValues: {
            IsOptInSelected: true,
            IsSubscribeTextAlertMarketing: true,
            IsSubscribeToOrganizationTextAlerts: true,
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsSubmitting(true);
            
            let postModel = {
                isOptIn: values.IsOptInSelected,
                IsSubscribeTextAlertMarketing: values.IsSubscribeTextAlertMarketing && values.IsOptInSelected,
                IsSubscribeToOrganizationTextAlerts: values.IsSubscribeToOrganizationTextAlerts && values.IsOptInSelected,
                MemberId: authData.MemberId,
                OrgMemberId: authData.OrgMemberId,
            }

            let response = await appService.post(`/app/Online/MyProfile/SetTextAlertOptInData?id=${orgId}`, postModel);
            if (response) {
                toLocalStorage(`data_show_unsubscribe_modal${orgId}`, `false`);
            }
            
            setTimeout(function() {
                navigate(HomeRouteNames.INDEX);
            }, 500)

            setIsSubmitting(false);
        },
    });

    useEffect(() => {
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary" block loading={isSubmitting} onClick={() => {formik.submitForm()}}>
                Save
            </Button>
        </FooterBlock>)
    }, [isSubmitting]);
    
    useEffect(() => {
        formik.setFieldValue('IsSubscribeTextAlertMarketing', true);
        formik.setFieldValue('IsSubscribeToOrganizationTextAlerts', true);
    }, [formik.values.IsOptInSelected]);

    useEffect(() => {
        if (!toBoolean(formik.values.IsSubscribeTextAlertMarketing) && !toBoolean(formik.values.IsSubscribeToOrganizationTextAlerts)) {
            formik.setFieldValue('IsOptInSelected', false);
        }
    }, [formik.values.IsSubscribeTextAlertMarketing, formik.values.IsSubscribeToOrganizationTextAlerts]);
    
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                <Flex vertical={true} gap={token.paddingSM}>
                    <Title level={1}>
                        Set Your Preferences
                    </Title>
                    <Text style={{color: token.colorSecondary}}>
                        Select your settings for periodic text messages from this organization.
                    </Text>
                </Flex>

                <Card>
                    <Flex vertical={true} gap={token.paddingLG}>
                        <Flex justify="space-between" 
                              align="center"
                              style={{minHeight: "34px"}}
                              onClick={(e) => {
                            formik.setFieldValue("IsOptInSelected", true);
                        }}>
                            <Title level={4}>
                                Opt-In to Text Messages
                            </Title>

                            {toBoolean(formik?.values?.IsOptInSelected) ? (
                                <SVG icon={'checked-radio'} color={token.colorPrimary} replaceColor={true} size={20} />
                            ) : (
                                <SVG icon={'circle'} color={token.colorBorder} size={20} />
                            )}
                        </Flex>

                        {toBoolean(formik.values.IsOptInSelected) &&
                            <>
                                <Divider className={globalStyles.noMargin} />

                                <Flex justify="space-between" align="center">
                                    <Flex vertical={true} gap={token.paddingXXS} onClick={() => {
                                        formik.setFieldValue("IsSubscribeTextAlertMarketing", !toBoolean(formik?.values?.IsSubscribeTextAlertMarketing));
                                    }}>
                                        <Title level={4}>
                                            Marketing
                                        </Title>
                                        <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>
                                            Newsletter, Special Offers,
                                            <br/>
                                            General Announcements
                                        </Text>
                                    </Flex>

                                    <Switch checked={toBoolean(formik?.values?.IsSubscribeTextAlertMarketing)} onChange={(e) => {
                                        formik.setFieldValue("IsSubscribeTextAlertMarketing", e);
                                    }} />
                                </Flex>

                                <Divider className={globalStyles.noMargin} />

                                <Flex justify="space-between" align="center">
                                    <Flex vertical={true} gap={token.paddingXXS} onClick={() => {
                                        formik.setFieldValue("IsSubscribeToOrganizationTextAlerts", !toBoolean(formik?.values?.IsSubscribeToOrganizationTextAlerts));
                                    }}>
                                        <Title level={4}>
                                            Organization Alerts
                                        </Title>
                                        <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>
                                            Confirmations, Cancellations,
                                            <br/>
                                            Special Alerts
                                        </Text>
                                    </Flex>

                                    <Switch checked={toBoolean(formik?.values?.IsSubscribeToOrganizationTextAlerts)} onChange={(e) => {
                                        formik.setFieldValue("IsSubscribeToOrganizationTextAlerts", e);
                                    }} />
                                </Flex>

                                <Divider className={globalStyles.noMargin} />

                                <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>
                                    By opting in, you agree to receive recurring automated text messages. Reply STOP to unsubscribe. Message frequency varies. Msg & data rates may apply.
                                </Text>
                            </>
                        }
                    </Flex>
                </Card>

                <Card>
                    <Flex justify="space-between" align="center" onClick={() => {
                        formik.setFieldValue("IsOptInSelected", false);
                    }}>
                        <Flex vertical={true} gap={token.paddingXXS}>
                            <Title level={4}>
                                Opt-Out
                            </Title>
                            <Text style={{color: token.colorSecondary, fontSize: `${token.fontSize}px`}}>
                                I choose to opt-out of receiving text messages at this time.
                            </Text>
                        </Flex>

                        <div style={{width:'40px', display: 'flex', justifyContent:'end'}}>
                            {!toBoolean(formik?.values?.IsOptInSelected) ? (
                                <SVG icon={'checked-radio'} color={token.colorPrimary} replaceColor={true} size={20} />
                            ) : (
                                <SVG icon={'circle'} color={token.colorBorder} size={20} />
                            )}
                        </div>
                    </Flex>
                </Card>
            </Flex>
        </PaddingBlock>
    )
}

export default SmsAlert
