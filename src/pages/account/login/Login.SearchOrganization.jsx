import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useRef, useState} from "react";
import {Button, Empty, Flex, Input, Skeleton, Tag, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {anyInList, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import apiService from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {cx} from "antd-style";
import {countListItems, emptyArray} from "../../../utils/ListUtils.jsx";
import InfiniteScroll from "../../../components/infinitescroll/InfiniteScroll.jsx";
import * as React from "react";
import {Card, Ellipsis} from "antd-mobile";
import {useStyles} from "./styles.jsx";

const {Text, Title} = Typography;

function LoginSearchOrganization() {
    const {formikData, setFormikData, isLoading, setIsLoading, globalStyles, token, setIsFooterVisible, setFooterContent, availableHeight} = useApp();
    const {t} = useTranslation('');
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);
    const [searchValue, setSearchValue] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    
    const email = formikData?.email;
    const password = formikData?.password;
    const confirmPassword = formikData?.confirmPassword;
    const { styles } = useStyles();
    const headerRef = useRef();
    
    useEffect(() => {
        setIsFooterVisible(false);
        fixHeaderItems();
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    disabled={isFetching}
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                {t('login.searchOrganization.button.continue')}
            </Button>
        </PaddingBlock>);
    }, []);

    const initialValues = {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        selectedOrgId: ''
    };

    // useEffect(() => {
    //     if (isNullOrEmpty(email) || 
    //         isNullOrEmpty(password) || 
    //         isNullOrEmpty(confirmPassword)){
    //         navigate(AuthRouteNames.LOGIN_GET_STARTED);
    //     }
    // }, []);

    const fixHeaderItems = () => {
        if (headerRef.current) {
            setBodyHeight(availableHeight - headerRef.current.offsetHeight - 8); //added padding for description search
        } else{

        }
    }
    
    const validationSchema = Yup.object({
        email: Yup.string().required(t(`login.getStarted.form.emailRequired`)),
        password: Yup.string().required(t(`login.createAccount.form.passwordRequired`))
            .min(6, t(`login.createAccount.form.passwordMinLength`)),
        confirmPassword: Yup.string().required(t(`login.createAccount.form.confirmPasswordRequired`))
            .oneOf([Yup.ref('password'), null], t(`login.createAccount.form.passwordMatch`)),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);



            setIsLoading(false);
        },
    });
    
    const loadOrganizations = async (loadMore) =>{
        if (!isNullOrEmpty(searchValue) && searchValue.length >=4){
            if (!loadMore){
                setOrganizations([]);
            }
            
            setIsLoading(true);
            setIsFetching(true);

            const postModel = {
                InputValue: searchValue,
                TakeRows: 30,
                SpGuideId: '',
                SkipRows: countListItems(organizations),
                RemoveOrgId: selectedOrganization?.Id
            };

            let response = await apiService.post('/api/create-account/search-organization', postModel);

            if (toBoolean(response?.IsValid)){
                const resultData = response.Data;
                let dbOrganizations = resultData.Organizations;
                setOrganizations(prev => [...prev, ...dbOrganizations]);
                setHasMore(resultData.LeftCount > 0)
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
                        <FormInput label={t('login.searchOrganization.form.search')}
                                   placeholder={t(`login.searchOrganization.form.searchPlaceholder`)}
                                   description={t(`login.searchOrganization.form.searchDescription`)}
                                   onInputTimeout={400}
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
                                {emptyArray(8).map((item, index) => (
                                    <div key={index}>
                                        <Skeleton.Button active={true} block style={{height: `80px`}}/>
                                    </div>
                                ))}
                            </Flex>
                        </div>
                    </PaddingBlock>
                }

                {(!isNullOrEmpty(searchValue) && searchValue.length >=4 && !anyInList(organizations) && !isFetching) &&
                    <Empty  />
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

                            <InfiniteScroll loadMore={() => {loadOrganizations(true)}} hasMore={hasMore}/>
                        </PaddingBlock>
                    </div>
                }
            </>
        </>
    )
}

export default LoginSearchOrganization
