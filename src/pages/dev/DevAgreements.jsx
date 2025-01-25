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

function DevAgreements() {
    const {token} = useApp();

    const formik = useCustomFormik({
        initialValues: {

            disclosureAgree: false,
            disclosureAgreeErrorStatus: '',
            
            disclosures: [
                {RuleInstructions: 'RuleInstructions Text0',
                    Id: '0',
                    Name: 'Name PDF',
                    DisclosureText: 'DisclosureText 0',
                    SignatureDataUrl: '', 
                    Status: '',
                    ContentType: '2', 
                    FullPath:'https://tgcstorage.blob.core.windows.net/court-reserve-6969/4fdd4728-d074-49a0-9510-21c4e73d74a5.pdf'},
                
                {RuleInstructions: 'RuleInstructions Text1', Id: '1', Name: 'Name 1', DisclosureText: 'DisclosureText 1', SignatureDataUrl: '', Status: ''},
                {RuleInstructions: 'RuleInstructions Text2', Id: '2', Name: 'Name 2', DisclosureText: 'DisclosureText 2', SignatureDataUrl: '', Status: ''},
                {RuleInstructions: 'RuleInstructions Text3', Id: '3', Name: 'Name 3', DisclosureText: 'DisclosureText 3 ReadAgreementMessage', ReadAgreementMessage: 'ReadAgreementMessage 3', SignatureDataUrl: '', Status: ''},
                {RuleInstructions: 'RuleInstructions Text4', Id: '4', Name: 'Name 4', DisclosureText: 'DisclosureText 4 ReadAgreementMessage', ReadAgreementMessage: 'ReadAgreementMessage 4', SignatureDataUrl: '', Status: ''},
            ],
            signFirstName: 'Mike',
            signLastName: 'Jackson',
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });
    
    const validateDisclosures = () => {
        
    }
    
    return (
        <PaddingBlock topBottom={true}>
            <div>
                <FormDisclosures formik={formik} disclosureHtml={'Disclosure Html Body for test'} dateTimeDisplay={'Fake Time 12:00PM'}/>
                
                <Flex gap={16} style={{paddingTop: '16px'}}>
                    <Button type={'primary'} block={true} onClick={validateDisclosures}>Validate Disclosures</Button>
                </Flex>
            </div>
        </PaddingBlock>
    );
}

export default DevAgreements;