import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Row, Col, Card, Typography, message, Flex, Segmented, Button} from "antd";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {useApp} from "@/context/AppProvider.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import useCustomFormik from "@/components/formik/CustomFormik.jsx";
import DrawerDatePicker from "@/components/drawer/DrawerDatePicker.jsx";
import FormRangePicker from "@/form/formrangepicker/FormRangePicker.jsx";
import ModalDatePicker from "@/components/modal/ModalDatePicker.jsx";
import ModalTimePicker from "@/components/modal/ModalTimePicker.jsx";

const { Text, Title } = Typography;

function DevDatePicker() {
    const [showDrawer, setShowDrawer] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const [showTime24Modal, setShowTime24Modal] = useState(false);
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

               <Card className={globalStyles.card}>
                   <Button type="primary" block={true} onClick={() => {setShowTimeModal(true)}}>12h Time Picker</Button>
               </Card>

               <Card className={globalStyles.card}>
                   <Button type="primary" block={true} onClick={() => {setShowTime24Modal(true)}}>24h Time Picker</Button>
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
                             onChange={(e) => {pNotify('onChange', e);}}
                             onConfirm={() => {pNotify('onConfirm'); setShowModal(false)}}
                             onClose={() => {pNotify('onClose'); setShowModal(false)}}
                             minDate={''} 
                             maxDate={''}  />

            <ModalTimePicker show={showTimeModal}
                             onConfirm={(e) => {pNotify(`onConfirm ${e}`); setShowTimeModal(false)}}
                             onClear={() => {pNotify(`onClear`); setShowTimeModal(false)}}
                             twelveFormat={true} />

            <ModalTimePicker show={showTime24Modal}
                             onConfirm={(e) => {pNotify(`onConfirm ${e}`); setShowTime24Modal(false)}}
                             onClear={() => {pNotify(`onClear`); setShowTime24Modal(false)}}  />
            
        </PaddingBlock>
    );
}

export default DevDatePicker;