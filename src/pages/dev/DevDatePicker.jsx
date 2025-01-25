import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented, Button} from "antd";
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
import DrawerDatePicker from "@/components/drawer/DrawerDatePicker.jsx";
import FormRangePicker from "@/form/formrangepicker/FormRangePicker.jsx";
import ModalDatePicker from "@/components/modal/ModalDatePicker.jsx";

const { Text, Title } = Typography;

function DevDatePicker() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {globalStyles} = useApp();
    
    const formik = useCustomFormik({
        initialValues: {
            drawerDate: '',
        },
        onSubmit: async (values, {setStatus, setSubmitting}) => {

        },
    });
    
    return (
        <PaddingBlock topBottom={true}>
           <Flex vertical={true} gap={16}>
               <Card className={globalStyles.card}>
                   {"<FormRangePicker onChange={(start, end) => {console.log('onChange', `${start} - ${end}`)}}"}
                   {"minDate={''}/> "}
                   
                   <FormRangePicker onChange={(start, end) => {console.log('onChange', `${start} - ${end}`)}}
                                    minDate={''}/>
               </Card>

               <Card className={globalStyles.card}>
                   <Text>
                       {"<ModalDatePicker selectedDate={startDate} show={showStartDatePicker} "}
                       {"onChange={onStartChange} "}
                       {"onConfirm={onStartConfirm} "}
                       {"onClose={onStartClose} "}
                       {"minDate={minDate} "}
                       {"maxDate={maxDate} />"}
                   </Text>
                   <Button type="primary" block={true} onClick={() => {setShowModal(true)}}>Modal</Button>
               </Card>

               <Card className={globalStyles.card}>
                   <Text>
                       {"<DrawerDatePicker show={show} value={value} minDate={minDate} maxDate={maxDate} "}
                       {"onChange={(e) => { handleChange({ value: e }); }} onClose={() => { setShow(false); }} />"}
                   </Text>
                   <Button type="primary" block={true} onClick={() => {setShowDrawer(true)}}>Drawer</Button>
               </Card>
           </Flex>
            
            <DrawerDatePicker show={showDrawer}
                              value={''}
                              minDate={''}
                              maxDate={''}
                              onChange={(e) => {
                                  console.log('onChange', e);
                              }}
                              onClose={() => {
                                  setShowDrawer(false);
                              }}/>

            <ModalDatePicker selectedDate={null} 
                             show={showModal} 
                             onChange={(e) => {console.log('onChange', e);}}
                             onConfirm={() => {console.log('onConfirm'); setShowModal(false)}}
                             onClose={() => {console.log('onClose'); setShowModal(false)}}
                             minDate={''} 
                             maxDate={''}  />
            
        </PaddingBlock>
    );
}

export default DevDatePicker;