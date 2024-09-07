import {useNavigate} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";
import {useFormik} from "formik";
import {useApp} from "../../../context/AppProvider.jsx";
import * as Yup from "yup";
import FormDateOfBirth from "../../../form/formdateofbirth/FormDateOfBirth.jsx";
import {useEffect, useState} from "react";
import {Button} from "antd";
import FormStateProvince from "../../../form/formstateprovince/FormStateProvince.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import {equalString, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {useTranslation} from "react-i18next";

function MyProfileDetails({selectedTab}) {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const {t} = useTranslation('');
    const [isFetching, setIsFetching] = useState(true);
    
    const {isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading, setIsLoading} = useApp();
    const {orgId} = useAuth();
    
    const loadData = () => {
        setIsFetching(true);
        setIsLoading(true);
        
        appService.get(`/app/Online/MyProfile/MyProfile?id=${orgId}`).then(r => {
            if (toBoolean(r?.IsValid)){
                setProfileData(r.Data);
                console.log(r.Data)
            }
            setIsFetching(false);
            setIsLoading(false);
        })
    }

    const initialValues = {
        firstName: profileData?.FirstName,
        dateOfBirthString: '',
    };

    const validationSchema = Yup.object({});

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
        if (equalString(selectedTab, 'pers')) {
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

            loadData();
        }
    }, [selectedTab]);

    return (
        <PaddingBlock topBottom={true}>
            <FormInput label="First Name"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='firstName'
            />
            <FormInput label="Last Name"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='lastName'
            />
            <FormInput label="Email"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='email'
            />
            <FormInput label="Username"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='username'
            />

            <FormSelect form={formik}
                        name={`gender`}
                        label='Gender'
                        loading={isFetching}
                        options={genderList}
                        required={false}/>

            <FormInput label="Current password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='currentPassword'
            />

            <FormInput label="New password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='newPassword'
            />
            <FormInput label="Confirm password"
                       form={formik}
                       loading={isFetching}
                       type={'password'}
                       name='comfirmPassword'
            />

            <FormInput label="Phone number"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='phoneNumber'
            />

            <FormDateOfBirth label="Date of birth"
                             form={formik}
                             loading={isFetching}
                             required={true}
                             displayAge={true}
                             name='dateOfBirthString'
            />

            <FormInput label="Address"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='address'
            />

            <FormInput label="City"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='city'
            />

            <FormInput label="State"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='state'
            />

            <FormStateProvince form={formik}
                               loading={isFetching}
                               dropdown={true}
                               nameKey={`state`}
                               required={true}
            />

            <FormInput label="Zip Code"
                       form={formik}
                       loading={isFetching}
                       required={true}
                       name='zipCode'
            />

            <FormSwitch label={'Hide my Personal Information from my club/organization\'s public member directories'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'hidePersonalInformation'}/>

            <FormSwitch label={'Unsubscribe from my Club/Organization\'s Emails/Alerts/Newsletters'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'unsubscribeFromEmails'}/>

            <FormSwitch label={'Unsubscribe From Organizations Marketing Push Notifications'}
                        form={formik}
                        loading={isFetching}
                        rows={2}
                        name={'unsubscribeFromPush'}/>

        </PaddingBlock>
    )
}

export default MyProfileDetails
