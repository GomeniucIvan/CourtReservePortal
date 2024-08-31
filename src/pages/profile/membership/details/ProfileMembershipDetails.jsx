import {useNavigate} from "react-router-dom";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Tabs, Typography} from "antd";
const {Text} = Typography
import mockData from "../../../../mocks/personal-data.json";
import {useEffect, useState} from "react";
import {useApp} from "../../../../context/AppProvider.jsx";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import InlineBlock from "../../../../components/inlineblock/InlineBlock.jsx";
import {cx} from "antd-style";
import DrawerBottom from "../../../../components/drawer/DrawerBottom.jsx";
import FormInput from "../../../../form/input/FormInput.jsx";
import FormTextarea from "../../../../form/formtextarea/FormTextArea.jsx";
import {useFormik} from "formik";
import * as Yup from "yup";
const {Title} = Typography;

function ProfileMembershipDetails() {
    const navigate = useNavigate();
    const {isMockData, token, globalStyles, setIsLoading} = useApp();
    const [data, setData] = useState(null);
    const [billingCycles, setBillingCycles] = useState([]);
    const [features, setFeatures] = useState([]);
    const [showCancelMembership, setShowCancelMembership] = useState(false);
    
    useEffect(() => {
        if (isMockData){
            const data = mockData.profile_membership;

            setData(data);
            setBillingCycles()
        }
    }, []);

    const tabContent = (key) => {
        if (isMockData){
            return (<>{key}</>)
        }
    }

    const cancelValidationSchema = Yup.object({
        reason: Yup.string().required('Cancellation Reason is require.'),
    });
    
    const cancelFormik = useFormik({
        initialValues: {membershipName: '',reason: ''},
        validationSchema: cancelValidationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, {setStatus, setSubmitting }) => {
            setIsLoading(true);

            if (isMockData) {

            } else {
                //todo
                alert('todo verification')
            }
        },
    });

    useEffect(() => {
        if (data) {
            cancelFormik.setValues({
                membershipName: data?.Membership?.Name || '',
            });
        }
    }, [data])
    
    return (
        <>
            <PaddingBlock >
                <Text> ref: https://dribbble.com/shots/20602433-Gym-Mobile-App</Text>

                <Title level={4}>{data?.Membership?.Name}</Title>

                <CardIconLabel icon={'money'} description={data?.BillingDetails?.MembershipPriceDisplay}/>
                <CardIconLabel icon={'money'} description={`Next Billing Date: ${data?.BillingDetails?.NextBillingDateDisplay}`}/>

                <InlineBlock style={{padding: `${token.padding}px 0`}}>
                    <Button block type={'primary'}>Pay</Button>
                    <Button block type={'primary'}>Change</Button>
                    <Button block type={'primary'} danger onClick={() => {setShowCancelMembership(true)}}>Cancel</Button>
                </InlineBlock>
            </PaddingBlock>

            <Tabs
                rootClassName={cx(globalStyles.tabs)}
                defaultActiveKey="billingcycles"
                items={[
                    {
                        label: 'Billing Cycles',
                        key: 'billingcycles',
                        children: tabContent('billingcycles')
                    },
                    {
                        label: 'Features',
                        key: 'features',
                        children: tabContent('features')
                    }
                ]}
            />

            <DrawerBottom showDrawer={showCancelMembership}
                          closeDrawer={() => setShowCancelMembership(false)}
                          showButton={true}
                          dangerButton={true}
                          confirmButtonText={'Cancel Membership'}
                          label='Cancel Membership'
                          onConfirmButtonClick={() => {
                              cancelFormik.handleSubmit();
                          }}>
                <PaddingBlock topBottom={true}>
                    <FormInput label="Membership"
                               form={cancelFormik}
                               disabled={true}
                               name='membershipName'
                    />

                    <FormTextarea form={cancelFormik}
                                  max={200}
                                  isRequired={true}
                                  label={'Cancellation Reason'}
                                  name={`reason`}/>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ProfileMembershipDetails
