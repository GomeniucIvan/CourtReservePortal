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

function ProfilePersonalInformation() {
    const navigate = useNavigate();
    let { memberId } = useParams();

    const {setIsLoading, isMockData, setIsFooterVisible, setHeaderRightIcons, setFooterContent, isLoading} = useApp();

    const initialValues = {
        reservationTypeId: '',
    };

    const validationSchema = Yup.object({
        reservationTypeId: Yup.string().required('Reservation Type is require.'),
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
                       name='dateofbirth'
            />
        </PaddingBlock>
    )
}

export default ProfilePersonalInformation
