import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import {Button, Card, Carousel, Divider, Flex, Switch, Typography} from "antd";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import React, {useCallback, useEffect, useState} from "react";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {useFormik} from "formik";
import {logDebug} from "@/utils/ConsoleUtils.jsx";
import LoginSearchOrganization from "@portal/account/modules/Login.SearchOrganization.jsx";
import {useAntd} from "@/context/AntdProvider.jsx";
import LoginAdditionalInfo from "@portal/account/login/Login.AdditionalInfo.jsx";
import LoginMemberships from "@portal/account/modules/Login.Memberships.jsx";
import LoginMembershipDetails from "@portal/account/modules/Login.MembershipDetails.jsx";
import {getMembershipText} from "@/utils/TranslateUtils.jsx";
import LoginReview from "@portal/account/modules/Login.Review.jsx";
import LoginCreateAccountReviewModal from "@portal/account/login/Login.CreateAccountReviewModal.jsx";
import * as Yup from "yup";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import JoinOrganizationReviewModal from "@portal/account/joinorganization/JoinOrganization.ReviewModal.jsx";
import {getLastFromHistory} from "@/toolkit/HistoryStack.js";
import {authMember} from "@/storage/AppStorage.jsx";
import {HomeRouteNames} from "@/routes/HomeRoutes.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {genderList} from "@/utils/SelectUtils.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormDateOfBirth from "@/form/formdateofbirth/FormDateOfBirth.jsx";
import FormStateProvince from "@/form/formstateprovince/FormStateProvince.jsx";
import {isNonUsCulture} from "@/utils/DateUtils.jsx";
import FormCustomFields from "@/form/formcustomfields/FormCustomFields.jsx";
import {useTranslation} from "react-i18next";
const {Title, Text, Paragraph, Link} = Typography;

function JoinOrganizationFamilyMembers({formik, signupData, onSubmit}) {
    const {t} = useTranslation('login');
    const {isLoading, setIsLoading, token, setIsFooterVisible, setFooterContent } = useApp();
    const {setHeaderTitleKey} = useHeader();
    
    const validateAndSubmit = () => {
        setIsLoading(true);
        onSubmit();
        
        setIsLoading(false);
    }

    useEffect(() => {
        setHeaderTitleKey('joinFamilyMembers');
    }, []);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent(<FooterBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={validateAndSubmit}>
                {t('additionalInfo.button.continue')}
            </Button>
        </FooterBlock>);
    }, [isLoading]);
    
    const toggleInitialCheck = (incMember) => {
        formik.setFieldValue(
            'FamilyMembers',
            formik.values.FamilyMembers.map((member, idx) =>
                equalString(member.Id, incMember.Id) ? { ...member, Register: !member.Register } : member
            )
        );
    }
    
    return (
        <>
            {anyInList(formik?.values?.FamilyMembers) &&
                <PaddingBlock topBottom={true}>
                    <Card>
                        {formik.values.FamilyMembers.map((member, index) => {
                            let isLastItem = index === formik.values.FamilyMembers.length - 1;
                            
                            return (
                                <>
                                    <Flex vertical={true} gap={token.padding} key={index}>
                                        <Flex justify={'space-between'}
                                              align={'center'}
                                              onClick={() => {
                                                  toggleInitialCheck(member)
                                              }}>
                                            <Title level={3}>
                                                {member.FullName}
                                            </Title>
                                            <Switch checked={member.Register}
                                                    onChange={() => toggleInitialCheck(member)}/>
                                        </Flex>
                                        {toBoolean(member.Register) &&
                                            <>
                                                <Divider style={{margin: `${token.paddingSM}px 0px`}} />

                                                <Flex vertical={true} gap={token.padding}>
                                                    {toBoolean(signupData?.IncludeGender) &&
                                                        <FormSelect
                                                            formik={formik}
                                                            name={`FamilyMembers[${index}].Gender`}
                                                            label={t(`additionalInfo.form.gender`)}
                                                            options={genderList}
                                                            required={signupData.IsGenderRequired}
                                                        />
                                                    }
                                                    {toBoolean(signupData?.IncludePhoneNumberBlock) &&
                                                        <FormInput label={t(`additionalInfo.form.phoneNumber`)}
                                                                   formik={formik}
                                                                   name={`FamilyMembers[${index}].PhoneNumber`}
                                                                   required={signupData.IsPhoneNumberRequired}
                                                        />
                                                    }

                                                    {toBoolean(signupData?.IncludeMembershipNumber) &&
                                                        <FormInput label={t(`additionalInfo.form.membershipNumber`)}
                                                                   formik={formik}
                                                                   name={`FamilyMembers[${index}].MembershipNumber`}
                                                                   required={signupData.IsMembershipNumberRequired}
                                                        />
                                                    }

                                                    {toBoolean(signupData?.IncludeDateOfBirthBlock) &&
                                                        <FormDateOfBirth label={t(`additionalInfo.form.dateOfBirth`)}
                                                                         formik={formik}
                                                                         uiCulture={signupData.UiCulture}
                                                                         required={signupData.IsDateOfBirthRequired}
                                                                         name={`FamilyMembers[${index}].DateOfBirthString`}
                                                        />
                                                    }
                                                    {toBoolean(signupData?.IncludeAddressBlock) &&
                                                        <>
                                                            <FormInput label={t(`additionalInfo.form.streetAddress`)}
                                                                       formik={formik}
                                                                       name={`FamilyMembers[${index}].Address`}
                                                                       required={signupData.IsAddressBlockRequired}
                                                            />

                                                            <FormInput label={t(`additionalInfo.form.city`)}
                                                                       formik={formik}
                                                                       name={`FamilyMembers[${index}].City`}
                                                                       required={signupData.IsAddressBlockRequired}
                                                            />

                                                            <Flex gap={token.padding}>
                                                                <FormStateProvince formik={formik}
                                                                                   dropdown={toBoolean(signupData?.ShowStatesDropdown)}
                                                                                   uiCulture={signupData.UiCulture}
                                                                                   nameKey={`FamilyMembers[${index}].State`}
                                                                                   required={signupData.IsAddressBlockRequired}
                                                                />

                                                                <FormInput label={isNonUsCulture(signupData.UiCulture) ? t(`additionalInfo.form.postalCode`) : t(`additionalInfo.form.zipCode`)}
                                                                           formik={formik}
                                                                           nameKey={`FamilyMembers[${index}].State`}
                                                                           required={signupData.IsAddressBlockRequired}
                                                                />
                                                            </Flex>
                                                        </>
                                                    }

                                                    <FormCustomFields customFields={member.Udfs}
                                                                      formik={formik}
                                                                      name={`FamilyMembers[${index}].Udfs[{udfIndex}].Value`} />

                                                    {anyInList(member.RatingCategories) &&
                                                        <>
                                                            {member.RatingCategories.map((ratingCategory, index) => {
                                                                return (
                                                                    <FormSelect
                                                                        key={index}
                                                                        label={ratingCategory.Name}
                                                                        name={toBoolean(ratingCategory.AllowMultipleRatingValues) ? `FamilyMembers[${index}].RatingCategories[${index}].SelectedRatingsIds` : `FamilyMembers[${index}].RatingCategories[${index}].SelectedRatingId`}
                                                                        propText='Name'
                                                                        propValue={'Id'}
                                                                        multi={ratingCategory.AllowMultipleRatingValues}
                                                                        options={ratingCategory.Ratings}
                                                                        required={ratingCategory.IsRequired}
                                                                        formik={formik}
                                                                    />
                                                                )
                                                            })}
                                                        </>
                                                    }
                                                </Flex>
                                            </>
                                        }
                                    </Flex>

                                    {!isLastItem && 
                                        <Divider style={{margin: `${token.paddingSM}px 0px`}} />
                                    }
                                </>
                            )
                        })}
                    </Card>
                </PaddingBlock>
            }
        </>
    )
}

export default JoinOrganizationFamilyMembers
