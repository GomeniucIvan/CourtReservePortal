import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented, Divider, Button} from "antd";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {Ellipsis} from "antd-mobile";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import FormPaymentProfileCardConnect from "@/form/formpaymentprofile/FormPaymentProfile.CardConnect.jsx";
import FormPaymentProfileStripe from "@/form/formpaymentprofile/FormPaymentProfile.Stripe.jsx";
import FormPaymentProfileSafeSave from "@/form/formpaymentprofile/FormPaymentProfile.SafeSave.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import {membershipRequirePayment} from "@/utils/CostUtils.jsx";
import {setFormikError, validatePaymentProfile} from "@/utils/ValidationUtils.jsx";
import {CardConstants} from "@/constants/CardConstants.jsx";
import {getConfigValue} from "@/config/WebConfig.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import FormDateOfBirth from "@/form/formdateofbirth/FormDateOfBirth.jsx";
import FormCheckbox from "@/form/formcheckbox/FomCheckbox.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import InstructionBlock from "@/components/instructionblock/InstructionBlock.jsx";
import FormDisclosures from "@/form/formdisclosures/FormDisclosures.jsx";

const { Text, Title } = Typography;

function DevForm() {
    const {token} = useApp();
    const [options, setOptions] = useState([
        {Text: 'Text1', Value: '1'},
        {Text: 'Text2', Value: '2'},
        {Text: 'Text3', Value: '3'},
        {Text: 'Text4', Value: '4'},
    ]);

    const formik = useCustomFormik({
        initialValues: {
            input: '',
            inputDigit: '',
            phoneNumber: '',
            inputLoading: '',
            inputDisabled: '',
            inputPassword: '',
            inputDescription: '',
            inputRequired: '',
            inputSearch: '',
            inputMask: '',
            formInputDisplay: 'Test Input Value - by name or /value',
            
            
            textarea: '',
            textareaRows: '',
            textareaRequired: '',
            textareaMax: '',
            
            
            select: '',
            selectDisabled: '',
            selectRequired: '',
            multiselect: [],
            multiselectDisabled: [],
            multiselectRequired: [],

            dateOfBirthString: '',


            switch: true,
            switchDisabled: false,
            switchRows: false,

            checkbox: false,
            checkboxDescription: true,
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });
    
    const validateDisclosures = () => {
        
    }
    
    return (
        <PaddingBlock topBottom={true}>
           <Flex vertical={true} gap={16}>
               <FormInput formik={formik} name={'input'} label={'Input'} placeholder={'Input'} />
               <FormInput formik={formik} name={'inputRequired'} label={'Required'} placeholder={'Required'} required={true} />
               <FormInput formik={formik} name={'inputDigit'} label={'Input Digits'} placeholder={'Input Digits'} onlyDigits={true} />
               <FormInput formik={formik} name={'phoneNumber'} label={'Phone Number'} placeholder={'Phone Number'} />
               <FormInput formik={formik} name={'inputLoading'} label={'Loading'} placeholder={'Loading'} loading={true} />
               <FormInput formik={formik} name={'inputDisabled'} label={'Disabled'} placeholder={'Disabled'} disabled={true} />
               <FormInput formik={formik} name={'inputPassword'} label={'Password'} placeholder={'Password'} addIconToSeePassword={true} />
               <FormInput formik={formik} name={'inputDescription'} label={'Description'} placeholder={'Description'} description={'Description Add to display some message for input'} />
               <FormInput formik={formik} name={'inputSearch'} label={'Search'} placeholder={'Search'} isSearch={true} />
               <FormInput formik={formik} name={'inputMask'} label={'Mask Numeric'} placeholder={'XX/XX'} mask={'XX/XX'} />
           </Flex>

            <Divider />
            <FormInputDisplay formik={formik} name={'formInputDisplay'} label={'label'} placeholder={'FormInputDisplay'} />
            <Divider />
            <Flex vertical={true} gap={16}>
                <FormTextarea formik={formik} name={'textarea'} label={'Textarea'} placeholder={'Textarea'} />
                <FormTextarea formik={formik} name={'textareaRows'} label={'Textarea Rows'} placeholder={'Textarea Rows'} rows={3} />
                <FormTextarea formik={formik} name={'textareaRequired'} label={'Textarea Required'} placeholder={'Textarea Required'} isRequired={true} />
                <FormTextarea formik={formik} name={'textareaMax'} label={'Textarea Max'} placeholder={'Textarea Max'} rows={2} max={200} />
            </Flex>

            <Divider />
            <Flex vertical={true} gap={16}>
                <FormSelect formik={formik} name={'select'} label={'Select'} placeholder={'Select'} options={options} />
                <FormSelect formik={formik} name={'selectDisabled'} label={'Select Disabled'} placeholder={'Select Disabled'} options={options} disabled={true} />
                <FormSelect formik={formik} name={'selectRequired'} label={'Select Required'} placeholder={'Select Required'} options={options} required={true} />
                <FormSelect formik={formik} name={'multiselect'} label={'Multiselect'} placeholder={'Multiselect'} options={options} multi={true} />
                <FormSelect formik={formik} name={'multiselectDisabled'} label={'Multiselect Disabled'} placeholder={'Multiselect Disabled'} disabled={true} options={options} multi={true} />
               
                <FormSelect formik={formik} 
                            name={'multiselectRequired'} 
                            label={'Multiselect Required'}
                            placeholder={'Multiselect Required'} 
                            options={options}
                            required={true} 
                            multi={true} />
            </Flex>

            <Divider />
            
            <FormDateOfBirth formik={formik} name={'dateOfBirthString'} />

            <Divider />
            
            <FormSwitch formik={formik} name={'switch'} label={'Switch'} />
            <FormSwitch formik={formik} name={'switchDisabled'} label={'Switch disabled'} disabled={true} />
            <FormSwitch formik={formik}
                        name={'switchRows'}
                        label={'Switch disabled max allowed rows to display before trim end of a text. Test message for long display and trim to be visible'}
                        rows={2} />

            <Divider />
            <FormCheckbox formik={formik} name={'checkbox'} label={'Checkbox'} />
            <FormCheckbox label={'Checkbox description'}
                          formik={formik}
                          name={'checkboxDescription'}
                          text={`Text `}
                          description={'Description'}
                          descriptionClick={() => {pNotify('onDescriptionClick')}}/>

            <Divider />

            <InstructionBlock instructions={'Some instruction to test display of'} />
        </PaddingBlock>
    );
}

export default DevForm;