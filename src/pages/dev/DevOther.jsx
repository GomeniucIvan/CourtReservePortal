import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented, Divider} from "antd";
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
import CardIconLabel from "@/components/cardiconlabel/CardIconLabel.jsx";
import SVG from "@/components/svg/SVG.jsx";

const { Text, Title } = Typography;

function DevOther() {
    return (
        <PaddingBlock topBottom={true}>
            <Flex vertical={true} gap={16}>
                <CardIconLabel icon={'home'} description={'Icon Description CardIconLabel'} size={16} />
                <SVG icon={'home'} replaceColor={true} color={'red'} size={16} />
                <SVG icon={'home'} size={16} />
            </Flex>
        </PaddingBlock>
    );
}

export default DevOther;