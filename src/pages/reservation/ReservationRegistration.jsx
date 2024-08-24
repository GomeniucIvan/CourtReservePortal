import {useStyles} from "./styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Alert, Button, Card, Checkbox, Divider, Flex, Typography} from "antd";
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
import {focus, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
import FormTextarea from "../../form/formtextarea/FormTextArea.jsx";
import {Modal} from 'antd-mobile'
import {ModalClose, ModalRemove} from "../../utils/ModalUtils.jsx";

const {Title, Text, Link} = Typography;

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
    const [showTermAndCondition, setShowTermAndCondition] = useState(false);
    const [showMatchMakerDrawer, setShowMatchMakerDrawer] = useState([]);
    const [matchTypes, setMatchTypes] = useState([]);
    const [isOpenMatchFilled, setIsOpenMatchFilled] = useState(false);
    const [showSearchPlayers, setShowSearchPlayers] = useState(false);
    const [guests, setGuests] = useState([]);
    const [selectedGuest, setSelectedGuest] = useState(null);

    const initialValues = {
        reservationTypeId: '',
        duration: '',
        endTime: '12:30 pm',
        courtId: '',
        isOpenReservation: false,
        isValidOpenMatch: false,
        MatchMakerTypeId: '',
        MatchMakerGender: '',
        MatchMakerRatingCategoryId: null,
        MatchMakerMemberGroupIds: [],
        MatchMakerMinNumberOfPlayers: null,
        MatchMakerMaxNumberOfPlayers: null,
        Description: null,
        MatchMakerIsPrivateMatch: false,
        MatchMakerJoinCode: '',
    };

    const fields = Object.keys(initialValues);
    const {loadingState, setLoading} = useLoadingState(fields);

    const loadData = (refresh) => {
        if (isMockData) {
            const resv = mockData.create;
            setReservation(resv);
            setReservationTypes(resv.ReservationTypes);
            setMatchTypes(resv.MatchTypes);
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
        reservationTypeId: Yup.string().required('Reservation Type is require.'),
        MatchMakerTypeId: Yup.string().when('isOpenReservation', {
            is: true,
            then: (schema) => schema.required('Match Type is required.'),
            otherwise: (schema) => schema.nullable(),
        }),
        // MatchMakerGender: Yup.string().when('isOpenReservation', {
        //     is: true,
        //     then: (schema) => schema.required('Gender Restriction is required.'),
        //     otherwise: (schema) => schema.nullable(),
        // }),
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
        if (isMockData) {
            setLoading('duration', true);

            setTimeout(() => {
                const durations = mockData.loading.Durations;
                setLoading('duration', false);
                setDurations(durations);
            }, 2000);
        }
    }

    const isValidMatchMakerData = async () => {
        await formik.validateField('MatchMakerTypeId');
        //await formik.validateField('MatchMakerGender');
        // await formik.validateField('MatchMakerRatingCategoryId');
        // await formik.validateField('MatchMakerMemberGroupIds');
        // await formik.validateField('MatchMakerMinNumberOfPlayers');
        // await formik.validateField('MatchMakerMaxNumberOfPlayers');
        // await formik.validateField('MatchMakerJoinCode');

        const matchMakerTypeIdError = formik.errors.MatchMakerTypeId;
        const matchMakerGenderError = formik.errors.MatchMakerGender;
        const matchMakerRatingCategoryIdError = formik.errors.MatchMakerRatingCategoryId;
        const matchMakerMemberGroupIdsError = formik.errors.MatchMakerMemberGroupIds;
        const matchMakerMinNumberOfPlayersError = formik.errors.MatchMakerMinNumberOfPlayers;
        const matchMakerMaxNumberOfPlayersError = formik.errors.MatchMakerMaxNumberOfPlayers;
        const matchMakerJoinCodeError = formik.errors.MatchMakerJoinCode;

        return matchMakerTypeIdError || matchMakerGenderError || matchMakerRatingCategoryIdError ||
            matchMakerMemberGroupIdsError || matchMakerMinNumberOfPlayersError ||
            matchMakerMaxNumberOfPlayersError || matchMakerJoinCodeError;
    }

    const closeAndCheckMatchMakerData = async () => {
        setShowMatchMakerDrawer(false);
        setIsOpenMatchFilled(true);
        let isInvalidMatchMakerInfo = await isValidMatchMakerData();
        await formik.setFieldValue('isValidOpenMatch', !isInvalidMatchMakerInfo);

    }

    const addPlayers = () => {
        setShowSearchPlayers(false);
    }

    const updateSelectedGuest = () => {
        setGuests(prevGuests => prevGuests.map(guest =>
            guest === selectedGuest
                ? {
                    ...guest,
                    FirstName: formik.values.guestFirstName,
                    LastName: formik.values.guestLastName,
                    Email: formik.values.guestEmail
                }
                : guest
        ));
        setSelectedGuest(null);
    }

    return (
        <>
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

                <FormSwitch label={'Allow Players to join this Reservation'}
                            form={formik}
                            name={'isOpenReservation'}/>

                {toBoolean(formik?.values?.isOpenReservation) &&
                    <>
                        {isOpenMatchFilled &&
                            <>
                                <div style={{marginBottom: token.Custom.buttonPadding}}>
                                    {toBoolean(formik?.values?.isValidOpenMatch) ? (
                                            <>
                                                <Alert
                                                    message={<div>
                                                        <Flex align={'center'} justify={'space-between'}>
                                                            <Text>
                                                                <strong>Match Type</strong>
                                                            </Text>
                                                            <Text>
                                                                {formik?.values?.MatchMakerTypeId}
                                                            </Text>
                                                        </Flex>
                                                        <Divider variant="dashed" dashed
                                                                 className={globalStyles.alertDivider}/>

                                                        <Flex align={'center'} justify={'space-between'}>
                                                            <Text>
                                                                <strong>Gender Restriction</strong>
                                                            </Text>
                                                            <Text>
                                                                Male
                                                            </Text>
                                                        </Flex>
                                                    </div>}
                                                    type="info"/>
                                            </>
                                        ) :
                                        (
                                            <>
                                                <Alert
                                                    message="Ensure all required fields for the open match are filled before proceeding"
                                                    type="warning"/>
                                            </>
                                        )}
                                </div>
                            </>
                        }

                        <Button type="primary"
                                block
                                ghost
                                htmlType={'button'}
                                onClick={() => {
                                    setShowMatchMakerDrawer(true)
                                }}>
                            {toBoolean(formik?.values?.isValidOpenMatch) ? (<>Edit Join Criteria</>) : (<>Setup Join
                                Criteria</>)}
                        </Button>
                    </>
                }

                <Divider className={globalStyles.formDivider}/>

                <Flex vertical gap={token.padding}>
                    <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                        <Flex justify={'space-between'} align={'center'}>
                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                <Title level={5} className={cx(globalStyles.noSpace)}>Players Information</Title>
                            </Flex>

                            <Text type="secondary">(1/8)</Text>
                        </Flex>
                    </Flex>

                    <Alert
                        message={<div><strong>Reservation TypeName</strong> min number... 5 minutes note</div>}
                        type="info"/>

                   <div>
                       <Text style={{marginBottom: `${token.Custom.buttonPadding}px`, display: 'block'}}>Player(s)</Text>
                       <Card className={cx(globalStyles.card, styles.playersCard)}>
                           <Flex vertical>
                               <Flex justify={'space-between'} align={'center'}>
                                   <Flex gap={token.Custom.cardIconPadding}>
                                       <Flex justify={'center'} align={'center'}
                                             style={{width: 48, height: 48, borderRadius: 50, backgroundColor: 'red'}}>
                                           <Title level={5} className={cx(globalStyles.noSpace)}>NM</Title>
                                       </Flex>

                                       <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                           <Text>
                                               <Ellipsis direction='end' content={'Nicholas McDonaghue'}/>
                                           </Text>
                                           <Text type="secondary">$2.50</Text>
                                       </Flex>
                                   </Flex>

                                   <SVG icon={'edit-user'} size={20} color={token.colorLink}/>
                               </Flex>

                               <Divider className={styles.playersDivider}/>
                               <Flex justify={'space-between'} align={'center'}>
                                   <Flex gap={token.Custom.cardIconPadding}>
                                       <Flex justify={'center'} align={'center'}
                                             style={{width: 48, height: 48, borderRadius: 50, backgroundColor: 'red'}}>
                                           <Title level={5} className={cx(globalStyles.noSpace)}>SM</Title>
                                       </Flex>

                                       <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                           <Text>
                                               <Ellipsis direction='end' content={'Smith Valmont'}/>
                                           </Text>
                                           <Text type="secondary">$2.50</Text>
                                       </Flex>
                                   </Flex>

                                   <SVG icon={'edit-user'} size={20} color={token.colorLink}/>
                               </Flex>

                               <Button type="primary"
                                       block
                                       ghost
                                       htmlType={'button'}
                                       style={{marginTop: `${token.padding}px`}}
                                       onClick={() => {
                                           setShowSearchPlayers(true)
                                       }}>
                                   Search Player(s)
                               </Button>
                           </Flex>
                       </Card>
                   </div>

                    <div>
                        <Text style={{marginBottom: `${token.Custom.buttonPadding}`, display: 'block'}}>Guest(s)</Text>
                        <Card className={cx(globalStyles.card, styles.playersCard)}>
                            <Flex vertical>
                                {guests.map((guest, index) => {
                                    const isLastIndex = index === guests.length - 1;
                                    const firstName = guest?.FirstName;
                                    const lastName = guest?.LastName;
                                    const displayFullName = isNullOrEmpty(firstName) && isNullOrEmpty(lastName) ?
                                        `Guest #${index + 1}` :
                                        `${firstName} ${lastName}`;

                                    return (
                                        <div key={index} style={{marginBottom: isLastIndex ? `${token.padding}px` : ''}}>
                                            <Flex justify={'space-between'}
                                                  align={'center'}
                                                  onClick={() => {
                                                      setSelectedGuest(guest);
                                                  }}>
                                                <Flex gap={token.Custom.cardIconPadding}>
                                                    <Flex justify={'center'} align={'center'}
                                                          style={{
                                                              width: 48,
                                                              height: 48,
                                                              borderRadius: 50,
                                                              backgroundColor: 'red'
                                                          }}>
                                                        <Title level={5} className={cx(globalStyles.noSpace)}>NM</Title>
                                                    </Flex>

                                                    <Flex vertical gap={token.Custom.cardIconPadding / 2}>
                                                        <Text>
                                                            <Ellipsis direction='end' content={displayFullName}/>
                                                        </Text>
                                                        <Text type="secondary">$2.50</Text>
                                                    </Flex>
                                                </Flex>

                                                <SVG icon={'edit-user'} size={20} color={token.colorLink}/>
                                            </Flex>
                                            {(!isLastIndex) &&
                                                <Divider className={styles.playersDivider}/>
                                            }
                                        </div>
                                    )
                                })}
                                <Button type="primary"
                                        block
                                        ghost
                                        htmlType={'button'}
                                        onClick={() => {
                                            setGuests((prevGuests) => [...prevGuests, {}]);
                                        }}>
                                    Add Guest
                                </Button>
                            </Flex>
                        </Card>
                    </div>
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
                    <u style={{color: token.colorLink}} onClick={() => setShowTermAndCondition(true)}> Terms and
                        Conditions</u>
                </Flex>
            </PaddingBlock>

            {/*//term drawer*/}
            <DrawerBottom
                showDrawer={showTermAndCondition}
                closeDrawer={() => setShowTermAndCondition(false)}
                label={'Terms and Conditions'}
                showButton={false}
                onConfirmButtonClick={() => setShowTermAndCondition(false)}
            >
                <Text>Test content dispaly</Text>
            </DrawerBottom>

            {/*Match maker drawer*/}
            <DrawerBottom
                maxHeightVh={90}
                showDrawer={showMatchMakerDrawer}
                closeDrawer={closeAndCheckMatchMakerData}
                label={'Match Maker Criteria'}
                showButton={true}
                confirmButtonText={'Save'}
                onConfirmButtonClick={closeAndCheckMatchMakerData}
            >
                <PaddingBlock>
                    <FormSelect form={formik}
                                name={`MatchMakerTypeId`}
                                label='Match Type'
                                options={matchTypes}
                                required={true}
                                propText='Name'
                                propValue='Id'/>

                    <FormSelect form={formik}
                                name={`MatchMakerGender`}
                                label='Gender Restrictions'
                                options={[]}
                                required={true}
                                propText='Name'
                                propValue='Id'/>

                    <FormSelect form={formik}
                                name={`MatchMakerRatingCategoryId`}
                                label='Rating Restriction'
                                options={[]}
                                required={true}
                                propText='Name'
                                propValue='Id'/>

                    <InlineBlock>
                        <FormSelect form={formik}
                                    name={`MatchMakerMinNumberOfPlayers`}
                                    label='Min. Players'
                                    options={[]}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>

                        <FormSelect form={formik}
                                    name={`MatchMakerMaxNumberOfPlayers`}
                                    label='Max. Players'
                                    options={[]}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>
                    </InlineBlock>

                    <InlineBlock>
                        <FormSelect form={formik}
                                    name={`MatchMakerMinNumberOfPlayers`}
                                    label='Min. Players'
                                    options={[]}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>

                        <FormSelect form={formik}
                                    name={`MatchMakerMaxNumberOfPlayers`}
                                    label='Max. Players'
                                    options={[]}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>
                    </InlineBlock>

                    <FormTextarea form={formik}
                                  max={200}
                                  label={'What to expect in this match'}
                                  name={`Description`}/>

                    <FormSwitch label={'Is this a private match'}
                                form={formik}
                                name={'MatchMakerIsPrivateMatch'}/>

                    {toBoolean(formik?.values?.MatchMakerIsPrivateMatch) &&
                        <FormInput form={formik}
                                   required={true}
                                   label={'Join Code'}
                                   name={`MatchMakerJoinCode`}/>
                    }
                </PaddingBlock>
            </DrawerBottom>

            {/*Search player*/}
            <DrawerBottom
                maxHeightVh={90}
                showDrawer={showSearchPlayers}
                closeDrawer={addPlayers}
                label={'Search Player'}
                showButton={true}
                confirmButtonText={'Save'}
                onConfirmButtonClick={addPlayers}
            >
                search
            </DrawerBottom>

            {/*Search player*/}
            <DrawerBottom
                maxHeightVh={80}
                showDrawer={!isNullOrEmpty(selectedGuest)}
                closeDrawer={updateSelectedGuest}
                label={'Edit Guest'}
                showButton={false}
                confirmButtonText={''}
                onConfirmButtonClick={updateSelectedGuest}
            >
                <PaddingBlock>
                    <FormInput label="First Name"
                               form={formik}
                               required={true}
                               name='guestFirstName'
                    />
                    <FormInput label="Last Name"
                               form={formik}
                               required={true}
                               name='guestLastName'
                    />
                    <FormInput label="Email"
                               form={formik}
                               required={true}
                               name='guestEmail'
                    />

                    <div style={{paddingBottom: `${token.padding}px`}}>
                        <InlineBlock>
                            <Button type="primary"
                                    danger
                                    block
                                    htmlType={'button'}
                                    onClick={() => {
                                        ModalRemove({
                                            content: 'Are you sure you want to remove Guest?',
                                            showIcon: false,
                                            onConfirm: () => {
                                                setGuests(prevGuests => prevGuests.filter(g => g !== selectedGuest));
                                                setSelectedGuest(null);
                                            }
                                        });
                                    }}>
                                Remove
                            </Button>

                            <Button type="primary"
                                    block
                                    htmlType={'button'}
                                    onClick={updateSelectedGuest}>
                                Save
                            </Button>
                        </InlineBlock>
                    </div>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ReservationRegistration
