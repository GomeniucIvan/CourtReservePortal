import React, {useState, useEffect} from 'react';
import {Flex, Typography} from 'antd';
import {getConfigValue, getWebConfigValue} from "../../config/WebConfig.jsx";
import FormSelect from "../formselect/FormSelect.jsx";
import FormInput from "../input/FormInput.jsx";
import {getAllCountries} from "../../utils/CountryUtils.jsx";
import {useApp} from "../../context/AppProvider.jsx";
import {cx} from "antd-style";
import {addCypressTag} from "@/utils/TestUtils.jsx";
const { Paragraph } = Typography;

const FormPaymentProfileCardConnect = React.forwardRef(({ formik}, ref) => {
    const [validationMessage, setValidationMessage] = useState('');
    const tokenizerUrl = getWebConfigValue('CardConnect_TokenizerURL');
    const {token, globalStyles} = useApp();

    let metaCardConnectCard = null;
    let cardNumberField = null;

    if (formik && typeof formik.getFieldProps === 'function') {
        cardNumberField = formik.getFieldProps('card_number');
        metaCardConnectCard = formik.getFieldMeta('card_number');
    }
    
    let cardConnectCardHasError = metaCardConnectCard && metaCardConnectCard.error && metaCardConnectCard.touched;

    //Card Connect Only!
    useEffect(() => {
        const handleMessage = (event) => {
            if (event && event.data !== "recaptcha-setup") {
                let token = '';

                try {
                    token = JSON.parse(event.data);
                } catch (e) {

                }

                if (token) {
                    formik.setFieldValue("card_number", token.message);
                    const validationMsg = token.validationError;
                    setValidationMessage(validationMsg);
                }
            }
        };

        window.addEventListener('message', handleMessage, false);

        // Cleanup
        return () => {
            window.removeEventListener('message', handleMessage, false);
        };
    }, []);

    const cssCardConnect = "form{display:flex;height: 44px;}input{height: 36px;width: 100%;border-radius:8px;border: 1px solid #dfdfdf;padding-left: 12px;font-size: 14px;font-family: system-ui;outline: none;}body{margin: 0;}";
    const encodedCssCardConnect = encodeURIComponent(cssCardConnect);
    
    return (
        <>
            <div className={cx(globalStyles.formBlock)}>
                <label htmlFor='card_number' className={globalStyles.globalLabel}>
                    Card Number
                    <span style={{
                        color: token.Form.labelRequiredMarkColor,
                        marginLeft: token.Form.marginXXS
                    }}>*</span>
                </label>
                {/*NOT SURE WHY IS NOT WORKING WITHOUT ZINDEX 999*/}
                <div style={{position: 'relative', zIndex: 999}}>
                    <iframe
                        id="tokenFrame"
                        name="tokenFrame"
                        src={`${tokenizerUrl}?invalidinputevent=true&tokenizewheninactive=true&inactivityto=2500&css=${encodedCssCardConnect}`}
                        frameBorder="0"
                        scrolling="no"
                        style={{
                            width: '100%',
                            height: '40px'
                        }}
                    />
                </div>

                {validationMessage ?
                    (<Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
                        {validationMessage}
                    </Paragraph>) :
                    (<>{cardConnectCardHasError && metaCardConnectCard && typeof metaCardConnectCard.error === 'string' ? (
                        <Paragraph {...addCypressTag(`error-${name}`)} className={cx(globalStyles.formError, 'ant-input-status-error')}>
                            {metaCardConnectCard.error}
                        </Paragraph>
                    ) : null}</>)
                }
            </div>

            <Flex gap={token.padding}>
                <FormInput label='Expiry Date'
                           formik={formik}
                           name='card_expiryDate'
                           placeholder='MM/YY'
                           mask={'XX/XX'}
                           required={true}
                           onlyDigits={true}
                           maxLength='5'
                           isExpiryDate={true}
                />

                <FormInput label='Security Code'
                           formik={formik}
                           name='card_securityCode'
                           placeholder='Security Code'
                           required={true}
                           onlyDigits={true}
                           max={9999}
                />
            </Flex>
        </>
    );
})

export default FormPaymentProfileCardConnect;