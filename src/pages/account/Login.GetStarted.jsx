import styles from './Login.module.less'
import {Form, Input, Popup} from "antd-mobile";
import {useState} from "react";
import Header from "../../components/header/Header.jsx";

function LoginGetStarted() {
    const [showDrawer, setShowDrawer] = useState(false);

    return (
       <>
           <Header title={'Getting Started'}/>
           
           <div>
               Login get started

               <Popup
                   visible={showDrawer}
                   onMaskClick={() => {
                       setShowDrawer(false)
                   }}
                   onClose={() => {
                       setShowDrawer(false)
                   }}
                   position='bottom'
                   bodyStyle={{
                       height: '90vh',
                       borderTopLeftRadius: '12px',
                       borderTopRightRadius: '12px',
                       background: 'rgba(255, 255, 255, 0.72)',
                       boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 30px',
                       backdropFilter: 'blur(8.5px)'
                   }}
               >
                   <>
                       <Form requiredMarkStyle='asterisk'>
                           <Form.Header>Account</Form.Header>
                           <Form.Item name='email' label='Email' rules={[{ required: true }]}>
                               <Input placeholder='Your email address' />
                           </Form.Item>
                           <Form.Item name='password' label='Password'>
                               <Input placeholder='******' />
                           </Form.Item>
                       </Form>
                   </>
               </Popup>
           </div>
       </>
    )
}

export default LoginGetStarted
