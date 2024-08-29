import styles from './ProfilePersonalInformation.module.less'
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import {useFormik} from "formik";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import {useEffect} from "react";
import {Button} from "antd";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";

function ProfilePersonalInformation() {
    const navigate = useNavigate();
    let { memberId } = useParams();

    const {setIsLoading, isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading} = useApp();

    const initialValues = {
        dateOfBirthString: '',
    };

    const validationSchema = Yup.object({

    });
    
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            setIsLoading(true);

            if (isMockData) {

            } else {
                //todo
                alert('todo verification')
            }
        },
    });

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Save
            </Button>
        </PaddingBlock>);
    }, []);
    
    return (
        <PaddingBlock topBottom={true}>
            <FormInput label="First Name"
                       form={formik}
                       required={true}
                       name='firstName'
            />
            <FormInput label="Last Name"
                       form={formik}
                       required={true}
                       name='lastName'
            />
            <FormInput label="Email"
                       form={formik}
                       required={true}
                       name='email'
            />
            <FormInput label="Username"
                       form={formik}
                       required={true}
                       name='username'
            />

            <FormSelect form={formik}
                        name={`gender`}
                        label='Gender'
                        options={genderList}
                        required={false}/>

            <FormInput label="Current password"
                       form={formik}
                       type={'password'}
                       name='currentPassword'
            />

            <FormInput label="New password"
                       form={formik}
                       type={'password'}
                       name='newPassword'
            />
            <FormInput label="Confirm password"
                       form={formik}
                       type={'password'}
                       name='comfirmPassword'
            />

            <FormInput label="Phone number"
                       form={formik}
                       required={true}
                       name='phoneNumber'
            />

            <FormDateOfBirth label="Date of birth"
                       form={formik}
                       required={true}
                       name='dateOfBirthString'
            />

            <FormInput label="Address"
                       form={formik}
                       required={true}
                       name='address'
            />

            <FormInput label="City"
                       form={formik}
                       required={true}
                       name='city'
            />

            <FormInput label="State"
                       form={formik}
                       required={true}
                       name='state'
            />

            <FormStateProvince form={formik}
                               dropdown={true}
                               nameKey={`state`}
                               required={true}
            />

            <FormInput label="Zip Code"
                       form={formik}
                       required={true}
                       name='zipCode'
            />

            <FormSwitch label={'Hide my Personal Information from my club/organization\'s public member directories'}
                        form={formik}
                        rows={2}
                        name={'hidePersonalInformation'}/>

            <FormSwitch label={'Unsubscribe from my Club/Organization\'s Emails/Alerts/Newsletters'}
                        form={formik}
                        rows={2}
                        name={'unsubscribeFromEmails'}/>

            <FormSwitch label={'Unsubscribe From Organizations Marketing Push Notifications'}
                        form={formik}
                        rows={2}
                        name={'unsubscribeFromPush'}/>
            
        </PaddingBlock>
    )
}

export default ProfilePersonalInformation
