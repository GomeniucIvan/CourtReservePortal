import styles from './ProfilePersonalInformation.module.less'
import {useNavigate, useParams} from "react-router-dom";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {genderList} from "../../../utils/SelectUtils.jsx";

function ProfilePersonalInformation() {
    const navigate = useNavigate();
    let { memberId } = useParams();

    return (
        <PaddingBlock>
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
            
            
        </PaddingBlock>
    )
}

export default ProfilePersonalInformation
