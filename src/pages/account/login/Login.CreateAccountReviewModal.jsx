import {useFormik} from 'formik';
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import {Button, Descriptions, Divider, Flex, QRCode, Skeleton, Typography} from 'antd';
import FormInput from "../../../form/input/FormInput.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import mockData from "../../../mocks/auth-data.json";
import {ModalClose} from "../../../utils/ModalUtils.jsx";
import {
    anyInList,
    equalString,
    focus,
    isNullOrEmpty,
    isValidEmail,
    nullToEmpty, oneListItem,
    randomNumber,
    toBoolean
} from "../../../utils/Utils.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import PageForm from "../../../form/pageform/PageForm.jsx";
import apiService, {getBearerToken, setBearerToken} from "../../../api/api.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../context/AuthProvider.jsx";
import appService from "../../../api/app.jsx";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {isCanadaCulture, requiredMessage} from "../../../utils/OrganizationUtils.jsx";
import {dateToTimeString, isNonUsCulture} from "../../../utils/DateUtils.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import FormCustomFields from "../../../form/formcustomfields/FormCustomFields.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import Modal from "../../../components/modal/Modal.jsx";
import Barcode from "react-barcode";

const {Paragraph, Link, Title} = Typography;

function LoginCreateAccountReviewModal({show, setShow, formik}) {
    const {isLoading, setIsLoading, token} = useApp();
    const {t} = useTranslation('login');
    let values = formik?.values;
    
    const createAccount = async () => {
        setIsLoading(true);

        
    }
    
    return (
        <>
            <Modal show={show}
                   onClose={() => {setShow(false)}}
                   onConfirm={createAccount}
                   loading={isLoading}
                   showConfirmButton={true}
                   title={t('review.modalTitle')}>
                
                <PaddingBlock>
                    <Title level={4} style={{paddingBottom: token.padding}}>{t('review.confirmMessage')}</Title>

                    <Descriptions title={t('review.orgInfo')} >
                        <Descriptions.Item label={t(`searchOrganization.drawer.name`)}>{values?.selectedOrgName}</Descriptions.Item>

                        {!isNullOrEmpty(values?.OrgFullAddress) &&
                            <Descriptions.Item label={t(`searchOrganization.drawer.fullAddress`)}>{values?.selectedOrgFullAddress}</Descriptions.Item>
                        }
                    </Descriptions>

                    <Divider />
                    <Descriptions title={t('review.profileInfo')}>
                        <Descriptions.Item label={t(`getStarted.form.email`)}>{values?.email}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.firstName`)}>{values?.firstName}</Descriptions.Item>
                        <Descriptions.Item label={t(`additionalInfo.form.lastName`)}>{values?.lastName}</Descriptions.Item>


                        {!isNullOrEmpty(values?.streetAddress) &&
                            <Descriptions.Item label={t(`additionalInfo.form.streetAddress`)}>{values?.streetAddress}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.city) &&
                            <Descriptions.Item label={t(`additionalInfo.form.city`)}>{values?.city}</Descriptions.Item>
                        }

                        {!isNullOrEmpty(values?.state) &&
                            <Descriptions.Item label={t(isCanadaCulture(values?.UiCulture) ? 'additionalInfo.form.province' : 'additionalInfo.form.state')}>{values?.state}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.zipCode) &&
                            <Descriptions.Item label={t(isNonUsCulture(values?.UiCulture) ? 'additionalInfo.form.postalCode' : 'additionalInfo.form.zipCode')}>{values?.zipCode}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.phoneNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.phoneNumber`)}>{values?.phoneNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.dateOfBirthString) &&
                            <Descriptions.Item label={t(`additionalInfo.form.dateOfBirth`)}>{values?.dateOfBirthString}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.membershipNumber) &&
                            <Descriptions.Item label={t(`additionalInfo.form.membershipNumber`)}>{values?.membershipNumber}</Descriptions.Item>
                        }
                        {!isNullOrEmpty(values?.gender) &&
                            <Descriptions.Item label={t(`additionalInfo.form.gender`)}>{values?.gender}</Descriptions.Item>
                        }
                    </Descriptions>

                    {(anyInList(values?.ratingCategories) || anyInList(values?.userDefinedFields)) &&
                        <>
                            <Divider />

                            <Descriptions title={t('review.additionalInfo')}>
                                {anyInList(values?.ratingCategories) &&
                                    <>
                                        {values?.ratingCategories.map((ratingCategory, index) => {
                                            return (
                                                <Descriptions.Item key={index} label={ratingCategory.Name}>{(ratingCategory.AllowMultupleRatingValues ? 'SelectedRatingsIds TODO' : 'SelectedRatingId TODO')}</Descriptions.Item>
                                            )
                                        })}
                                    </>
                                }
                                {anyInList(values?.userDefinedFields) &&
                                    <>
                                        {values?.userDefinedFields.map((udf, index) => {
                                            return (
                                                <Descriptions.Item key={index} label={udf.Label}>{udf.Value}</Descriptions.Item>
                                            )
                                        })}
                                    </>
                                }
                            </Descriptions>
                        </>
                    }
                </PaddingBlock>
            </Modal>
        </>
    )
}

export default LoginCreateAccountReviewModal
