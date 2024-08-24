import {useStyles} from "./styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Button, Checkbox, Divider, Flex, Typography} from "antd";
import mockData from "../../mocks/reservation-data.json";
import PaddingBlock from "../../components/paddingblock/PaddingBlock.jsx";
import FormSelect from "../../form/formselect/FormSelect.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useApp} from "../../context/AppProvider.jsx";
import InlineBlock from "../../components/inlineblock/InlineBlock.jsx";
import FormInput from "../../form/input/FormInput.jsx";
import FormSwitch from "../../form/formswitch/FormSwitch.jsx";
import {useLoadingState} from "../../utils/LoadingUtils.jsx";
import {cx} from "antd-style";
import SVG from "../../components/svg/SVG.jsx";
import {Ellipsis} from "antd-mobile";
import DrawerBottom from "../../components/drawer/DrawerBottom.jsx";
const { Title, Text, Link } = Typography;

function ReservationRegistration() {
    const navigate = useNavigate();
    let {id} = useParams();
    const {styles} = useStyles();
    const {
        isMockData,
        setIsFooterVisible,
        shouldFetch,
        resetFetch,
        setHeaderRightIcons,
        setIsLoading,
        globalStyles,
        token,
        setFooterContent,
        isLoading
    } = useApp();
    const [reservation, setReservation] = useState([]);
    const [reservationTypes, setReservationTypes] = useState([]);
    const [durations, setDurations] = useState([]);
    const [courts, setCourts] = useState([]);
    const [showTermAndCondition, setShowTermAndCondition] = useState([]);

    const initialValues = {
        reservationTypeId: '',
        duration: '',
        endTime: '12:30 pm',
        courtId: ''
    };

    const fields = Object.keys(initialValues);
    const { loadingState, setLoading } = useLoadingState(fields);
    
    const loadData = (refresh) => {
        if (isMockData) {
            const resv = mockData.create;
            setReservation(resv);
            setReservationTypes(resv.ReservationTypes);
        } else {
            alert('todo res registation')
        }

        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);

    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent(<PaddingBlock>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Continue
            </Button>
        </PaddingBlock>)
        loadData();
    }, []);

    const validationSchema = Yup.object({
        reservationTypeId: Yup.string().required('Reservation Type is require.')
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

    const onReservationTypeChange = (resType) => {
        if (isMockData){
            setLoading('duration', true);

            setTimeout(() => {
                const durations = mockData.loading.Durations;
                setLoading('duration', false);
                setDurations(durations);
            }, 2000);
        }
    }
    
    return (
        <PaddingBlock topBottom={true}>
            <Title level={5} className={globalStyles.noTopPadding}>Reservation Details</Title>

            <FormSelect form={formik}
                        name={`reservationTypeId`}
                        label='Reservation Type'
                        options={reservationTypes}
                        required={true}
                        onValueChange={onReservationTypeChange}
                        propText='Name'
                        propValue='Id'/>

            <InlineBlock>
                <FormSelect label="Duration"
                            form={formik}
                            name='duration'
                            options={durations}
                            required={true}
                            loading={loadingState.duration}
                />

                <FormInput label="End Time"
                           form={formik}
                           required={true}
                           disabled={true}
                           name='endTime'
                />
            </InlineBlock>

            <FormSelect form={formik}
                        name={`courtId`}
                        label='Court(s)'
                        options={courts}
                        required={true}
                        propText='Name'
                        propValue='Id'/>

            <FormSwitch label={'Allow Players to join this Reservation'}/>

            <Divider className={globalStyles.formDivider}/>

            <Flex vertical gap={token.padding}>
                <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                    <Flex justify={'space-between'} align={'center'}>
                        <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                            <Title level={5} className={cx(globalStyles.noSpace)}>Players</Title>
                            <Text type="secondary">(1/8)</Text>
                        </Flex>

                        <Link href="https://ant.design">
                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                <SVG icon={'person-plus'} size={20} color={token.colorLink}/>
                                <strong>Add Players</strong>
                            </Flex>
                        </Link>
                    </Flex>

                    <Text type="secondary">A minimum of 2 players is required</Text>
                </Flex>

                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={token.Custom.cardIconPadding}>
                        <Flex justify={'center'} align={'center'}
                              style={{width: 48, height: 48, borderRadius: 50, backgroundColor: 'red'}}>
                            <Title level={5} className={cx(globalStyles.noSpace)}>NM</Title>
                        </Flex>

                        <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                            <Text>
                                <Ellipsis direction='end' content={'Nicholas McDonaghue (Me)'}/>
                            </Text>
                            <Text type="secondary">$2.50</Text>
                        </Flex>
                    </Flex>

                    <SVG icon={'edit-user'} size={20} color={token.colorLink}/>
                </Flex>
            </Flex>

            <Divider className={globalStyles.formDivider}/>

            <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                <Flex justify={'space-between'} align={'center'}>
                    <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                        <Title level={5} className={cx(globalStyles.noSpace)}>Miscellaneous Items</Title>
                        <Text type="secondary">(0)</Text>
                    </Flex>

                    <Link href="https://ant.design">
                        <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                            <SVG icon={'circle-plus'} size={20} color={token.colorLink}/>
                            <strong>Add Items</strong>
                        </Flex>
                    </Link>
                </Flex>

            </Flex>

            <Divider className={globalStyles.formDivider}/>

            <Title level={5} className={globalStyles.noTopPadding}>Additional Information</Title>
            <FormInput label="Hand"
                       form={formik}
                       required={true}
                       name='hand'
            />
            <FormInput label="Play Serve Lift"
                       form={formik}
                       required={true}
                       name='play'
            />

            <Divider className={globalStyles.formDivider}/>

            <Flex align={'center'}>
                <Checkbox className={globalStyles.checkboxWithLink}>I agree to the </Checkbox>
                <u style={{color: token.colorLink}} onClick={() => setShowTermAndCondition(true)}> Terms and Conditions</u>
            </Flex>

            <DrawerBottom
                showDrawer={showTermAndCondition}
                closeDrawer={() => setShowTermAndCondition(false)}
                label={'Terms and Conditions'}
                showButton={false}
                onConfirmButtonClick={() => setShowTermAndCondition(false)}
            >
                <Text>Test content dispaly</Text>
            </DrawerBottom>
        </PaddingBlock>
    )
}

export default ReservationRegistration
