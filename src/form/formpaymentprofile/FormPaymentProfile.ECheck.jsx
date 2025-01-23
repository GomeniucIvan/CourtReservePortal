import React, {useState, useEffect} from 'react';
import {Flex, Skeleton, Typography} from 'antd';
import {getConfigValue} from "../../config/WebConfig.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import FormInput from "../input/FormInput.jsx";
import {getAllCountries} from "../../utils/CountryUtils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {toBoolean} from "@/utils/Utils.jsx";
const { Paragraph } = Typography;

const FormPaymentProfileECheck = React.forwardRef(({ formik,
                                                     isUsingCollectJs,
                                                       isUsingCollectJsLoading,
                                                       validationMessages}, ref) => {

    return (
        <>
            {toBoolean(isUsingCollectJs) &&
                <>
                    {toBoolean(isUsingCollectJsLoading) &&
                        <>
                            <div className="react-form-block ">
                                <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                            </div>

                            <div className="react-form-block ">
                                <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                            </div>
                            <div className="react-form-block ">
                                <Skeleton.Input active={true} block={true} style={{ width: '100%' }} />
                            </div>
                        </>
                    }

                    <span style={{ opacity: (isUsingCollectJsLoading ? 0 : 1), position: (isUsingCollectJsLoading ? 'absolute' : 'initial'), top: (isUsingCollectJsLoading ? '-100vh' : '0px') }}>
                            <div className="react-form-block ">
                                <label htmlFor='checkName' className={`required-label`}>Account Holder Name</label>

                                <div className="p-relative">
                                    <div id="check-name"></div>
                                    {validationMessages.checkname && (
                                        <div className="form-invalid">{validationMessages.checkname}</div>
                                    )}
                                </div>
                            </div>
                            <div className="react-form-block ">
                                <label htmlFor='checkRoutingNumber' className={`required-label`}>Routing Number</label>

                                <div className="p-relative">
                                    <div id="check-routingnumber"></div>
                                    {validationMessages.checkaba && (
                                        <div className="form-invalid">{validationMessages.checkaba}</div>
                                    )}
                                </div>
                            </div>
                            <div className="react-form-block ">
                                <label htmlFor='checkAccountNumber' className={`required-label`}>Account Number</label>

                                <div className="p-relative">
                                    <div id="check-accountnumber"></div>
                                    {validationMessages.checkaccount && (
                                        <div className="form-invalid">{validationMessages.checkaccount}</div>
                                    )}
                                </div>
                            </div>
                        </span>
                </>
            }

            {!toBoolean(isUsingCollectJs) &&
                <>
                    <FormInput label='Routing Number'
                               formik={formik}
                               name='card_routingNumber'
                               placeholder='Routing Number'
                               required={true}
                    />

                    <FormInput label='Account Number'
                               formik={formik}
                               name='card_accountNumber'
                               placeholder='Account Number'
                               required={true}
                    />
                </>
            }
        </>
    );
})

export default FormPaymentProfileECheck;