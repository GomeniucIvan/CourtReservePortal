import {useFormik} from 'formik';
import {useApp} from "@/context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import {Button, Descriptions, Empty, Flex, Input, Skeleton, Tag, Typography} from 'antd';
import FormInput from "@/form/input/FormInput.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import apiService from "@/api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {cx} from "antd-style";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import InfiniteScroll from "@/components/infinitescroll/InfiniteScroll.jsx";
import * as React from "react";
import {Card, Ellipsis, ErrorBlock} from "antd-mobile";
import {useStyles} from "./../styles.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import SVG from "@/components/svg/SVG.jsx";

const {Text, Title} = Typography;

function LoginSearchOrganization({mainFormik, onOrganizationSelect}) {
    const {setHeaderTitleKey} = useHeader();
    const {formikData, setFormikData, isLoading, setIsLoading, globalStyles, token, setIsFooterVisible, setFooterContent, availableHeight} = useApp();
    const {spGuideId} = useAuth();
    
    const {t} = useTranslation('login');
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    const [searchValue, setSearchValue] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    const [showSelectedOrganization, setShowSelectedOrganization] = useState(false);
    const [showNoOrganizations, setShowNoOrganizations] = useState(false);

    const email = mainFormik?.values?.email;
    const password = mainFormik?.values?.password;
    const confirmPassword = mainFormik?.values?.confirmPassword;

    const { styles } = useStyles();
    const headerRef = useRef();

    useEffect(() => {
        setIsFooterVisible(false);
        fixHeaderItems();
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                {t('searchOrganization.button.continue')}
            </Button>
        </FooterBlock>);
        setHeaderTitleKey('loginOrganization')
    }, []);

    const initialValues = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        spGuideId: spGuideId,
        selectedOrgId: '',
        selectedOrgName: '',
        selectedOrgFullAddress: '',
    };

    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - 8); //added padding for description search
        } else {

        }
    }

    const validationSchema = Yup.object({

    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);
            console.log(selectedOrganization)
            
            let formikValues = values;
            formikValues.selectedOrgId = selectedOrganization.Id;
            formikValues.selectedOrgName = selectedOrganization.Name;
            formikValues.selectedOrgFullAddress = selectedOrganization.FullAddress;
            formikValues.BaseTextColor = selectedOrganization.BaseTextColor;
            formikValues.BaseBackgroundColor = selectedOrganization.BaseBackgroundColor;

            onOrganizationSelect(formikValues);

            setIsLoading(false);
        },
    });

    const loadOrganizations = async (loadMore) => {
        setShowNoOrganizations(false)
        
        if (!isNullOrEmpty(searchValue) && searchValue.length >=4){
            let currentOrganizations = organizations;
            if (!loadMore){
                setOrganizations([]);
                currentOrganizations = [];
            }

            setIsLoading(true);
            setIsFetching(true);

            const postModel = {
                InputValue: searchValue,
                TakeRows: 30,
                SpGuideId: '',
                SkipRows: countListItems(currentOrganizations),
                RemoveOrgId: selectedOrganization?.Id
            };

            let response = await apiService.post('/api/create-account/search-organization', postModel);

            if (toBoolean(response?.IsValid)){
                const resultData = response.Data;
                let dbOrganizations = resultData.Organizations;
                setOrganizations(prev => [...prev, ...dbOrganizations]);
                setHasMore(resultData.LeftCount > 0);

                setShowNoOrganizations(!anyInList(currentOrganizations) && !anyInList(dbOrganizations));
            }

            setIsFetching(false);
            setIsLoading(false);
        } else{
            setOrganizations([]);
            setHasMore(false)
        }
    }

    useEffect(() => {
        loadOrganizations();
    }, [searchValue])

    return (
        <>
            <>
                <div ref={headerRef}>
                    <PaddingBlock headerSearch={true}>
                        <FormInput label={t('searchOrganization.form.search')}
                                   placeholder={t(`searchOrganization.form.searchPlaceholder`)}
                                   description={t(`searchOrganization.form.searchDescription`)}
                                   onInputTimeout={1000}
                                   className={'no-margin'}
                                   onInput={(e) => {
                                       setSearchValue(e);
                                   }}/>
                    </PaddingBlock>
                </div>


                {(isFetching && !anyInList(organizations)) &&
                    <PaddingBlock onlyBottom={true}>
                        <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                            <Flex vertical={true} gap={token.padding}>
                                {emptyArray(4).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button active={true} block style={{height: `80px`}}/>
                                    </div>
                                ))}
                            </Flex>
                        </div>
                    </PaddingBlock>
                }

                {showNoOrganizations &&
                    <PaddingBlock onlyBottom={true}>
                        <ErrorBlock
                            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                            style={{
                                '--image-height': '150px',
                                paddingTop: '10vh'
                            }}
                            title={'No any organizations found.'}
                            description={' TODO find image for that'}
                        >
                        </ErrorBlock>
                    </PaddingBlock>
                }

                {anyInList(organizations) &&
                    <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
                        <PaddingBlock onlyBottom={true}>
                            <Flex vertical={true} gap={token.padding}>
                                {organizations.map((organization, index) => {
                                    return (
                                        <div key={index}>
                                            <Card
                                                className={cx(globalStyles.card, globalStyles.clickableCard, globalStyles.cardSMPadding)}
                                                onClick={() => {
                                                    setSelectedOrganization(organization);
                                                    setShowSelectedOrganization(true);
                                                }}>
                                                <Flex gap={token.padding} align={'center'}>
                                                    <Flex justify={'center'}
                                                          align={'center'}
                                                          className={cx(styles.searchOrganizationImage, isNullOrEmpty(organization.FullLogoUrl) && styles.searchOrganizationNoImage)}>
                                                        {isNullOrEmpty(organization.FullLogoUrl) &&
                                                            <img
                                                                src='https://app.courtreserve.com/Content/Images/icons-svg/no-photos.svg'/>
                                                        }

                                                        {!isNullOrEmpty(organization.FullLogoUrl) &&
                                                            <img src={organization.FullLogoUrl}/>
                                                        }
                                                    </Flex>

                                                    <Flex vertical={true} gap={token.paddingXS}>

                                                        <Title level={3}>
                                                            <Ellipsis direction='end' content={organization.Name}/>
                                                        </Title>
                                                        {!isNullOrEmpty(organization.FullAddress) &&
                                                            <Text
                                                                className={cx(token.colorTextTertiary, globalStyles.noPadding, styles.searchOrganizationFullAddress)}>
                                                                <Ellipsis rows={2} direction='end'
                                                                          content={organization.FullAddress}/>
                                                            </Text>
                                                        }
                                                    </Flex>
                                                </Flex>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </Flex>

                            {hasMore &&
                                <InfiniteScroll loadMore={() => {loadOrganizations(true)}} hasMore={hasMore}/>
                            }
                        </PaddingBlock>
                    </div>
                }
            </>

            <DrawerBottom showDrawer={showSelectedOrganization}
                          closeDrawer={() => setShowSelectedOrganization(false)}
                          showButton={true}
                          customFooter={<Flex gap={token.padding}>
                              <Button block onClick={() => {
                                  setShowSelectedOrganization(false);
                                  setSelectedOrganization(null);
                              }}>
                                  {t(`searchOrganization.drawer.close`)}
                              </Button>

                              <Button type={'primary'}
                                      block 
                                      onClick={() => {
                                  formik.submitForm();
                              }}>
                                  {t(`searchOrganization.drawer.select`)}
                              </Button>
                          </Flex>}
                          label={t(`searchOrganization.drawer.title`)}>
                <PaddingBlock onlyBottom={true}>

                    <Flex align={"center"} justify={"center"}>
                        {!isNullOrEmpty(selectedOrganization?.FullLogoUrl) &&
                            <img style={{height: '56px', paddingBottom: token.padding}} src={selectedOrganization?.FullLogoUrl}/>
                        }
                    </Flex>
                    <Descriptions>
                        <Descriptions.Item label={t(`searchOrganization.drawer.name`)}>{selectedOrganization?.Name}</Descriptions.Item>

                        {!isNullOrEmpty(selectedOrganization?.Address1) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.address1`)}>{selectedOrganization?.Address1}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(selectedOrganization?.Address2) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.address2`)}>{selectedOrganization?.Address2}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(selectedOrganization?.PhoneNumber) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.phoneNumber`)}>{selectedOrganization?.PhoneNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(selectedOrganization?.City) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.city`)}>{selectedOrganization?.City}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(selectedOrganization?.State) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.state`)}>{selectedOrganization?.State}</Descriptions.Item>
                        }

                        <Descriptions.Item label={t(`searchOrganization.drawer.workingHours`)}>TODO PROC!</Descriptions.Item>
                        <Descriptions.Item label="Facebook">TODO PROC!</Descriptions.Item>
                        <Descriptions.Item label={t(`searchOrganization.drawer.website`)}>TODO PROC!</Descriptions.Item>

                    </Descriptions>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default LoginSearchOrganization
