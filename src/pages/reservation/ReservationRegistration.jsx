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
import {anyInList, focus, isNullOrEmpty, toBoolean} from "../../utils/Utils.jsx";
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
    const [isPlayersSearch, setIsPlayersSearch] = useState(false);
    const [searchingPlayers, setSearchingPlayers] = useState([]);
    const [searchPlayersText, setSearchPlayersText] = useState('');
    const [showMiscItems, setShowMiscItems] = useState(false);
    const [miscItems, setMiscItems] = useState([]);
    
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
            setMiscItems(resv.MiscFeesSelectListItems);
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
        setFooterContent(<PaddingBlock topBottom={true}>
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

    const onPlayersSearch = (searchVal) => {
        if (isMockData) {
            setIsPlayersSearch(true);

            setTimeout(function () {
                setIsPlayersSearch(false);
                setSearchPlayersText(searchVal);
            }, 2000);
        }
    }

    useEffect(() => {
        if (isMockData) {
            let data = mockData;
            if (showSearchPlayers) {
                if (isNullOrEmpty(searchPlayersText)) {
                    setSearchingPlayers(data.favplayers);
                } else {
                    setSearchingPlayers(data.players);
                }
            } else {
                //setSearchingPlayers([]);
            }
        }
    }, [showSearchPlayers, searchPlayersText]);

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
                        <Text
                            style={{marginBottom: `${token.Custom.buttonPadding}px`, display: 'block'}}>Player(s)</Text>
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

                                    <SVG icon={'edit-user'} size={23} color={token.colorLink}/>
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

                                    <div onClick={() => ModalRemove({
                                        content: 'Are you sure you want to remove Smith Valmont?',
                                        showIcon: false,
                                        onRemove: (e) => {
                                            console.log(e)

                                        }
                                    })}>
                                        <SVG icon={'circle-minus'} size={23} color={token.colorError}/>
                                    </div>
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
                        <Text
                            style={{marginBottom: `${token.Custom.buttonPadding}px`, display: 'block'}}>Guest(s)</Text>
                        <Card
                            className={cx(globalStyles.card, anyInList(guests) ? styles.playersCard : styles.noPlayersCard)}>
                            <Flex vertical>
                                {guests.map((guest, index) => {
                                    const isLastIndex = index === guests.length - 1;
                                    const firstName = guest?.FirstName;
                                    const lastName = guest?.LastName;
                                    const displayFullName = isNullOrEmpty(firstName) && isNullOrEmpty(lastName) ?
                                        `Guest #${index + 1}` :
                                        `${firstName} ${lastName}`;

                                    return (
                                        <div key={index}
                                             style={{marginBottom: isLastIndex ? `${token.padding}px` : ''}}>
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

                                                <SVG icon={'edit-user'} size={23} color={token.colorLink}/>

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

                        <Link onClick={() => {setShowMiscItems(true)}}>
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
                maxHeightVh={80}
                showDrawer={showSearchPlayers}
                closeDrawer={addPlayers}
                label={'Search Player(s)'}
                onSearch={onPlayersSearch}
                showButton={true}
                searchType={2}
                addSearch={true}
                isSearchLoading={isPlayersSearch}
                confirmButtonText={'Close'}
                onConfirmButtonClick={addPlayers}
            >
                <PaddingBlock>
                    {/*//todo iv change to dynamic calculation*/}
                    <Flex vertical style={{minHeight: `calc(80vh - 98px - 72px)`}}>
                        {anyInList(searchingPlayers) &&
                            <Flex vertical gap={token.padding}>
                                {searchingPlayers.map((player, index) => (
                                    <div key={index}>
                                        <Flex justify={'space-between'} align={'center'}>
                                            <Flex gap={token.Custom.cardIconPadding} align={'center'}>
                                                <Flex justify={'center'} align={'center'}
                                                      style={{
                                                          width: 48,
                                                          height: 48,
                                                          borderRadius: 50,
                                                          backgroundColor: 'red'
                                                      }}>
                                                    <Title level={5} className={cx(globalStyles.noSpace)}>{player.FullNameInitial}</Title>
                                                </Flex>

                                                <Text>
                                                    <Ellipsis direction='end' content={player.DisplayName}/>
                                                </Text>
                                            </Flex>

                                            <Flex gap={token.padding}>
                                                <div onClick={() => {
                                                    alert('todo')
                                                }}>
                                                    {toBoolean(player.IsFavoriteMember) ?
                                                        (<SVG icon={'hearth-filled'} size={24} color={token.colorPrimary}/>) : 
                                                        (<SVG icon={'hearth'} size={24} color={token.colorPrimary}/>)}
                                                    
                                                </div>
                                                
                                                <div onClick={() => {
                                                    alert('todo')
                                                }}>
                                                    <SVG icon={'circle-plus'} size={24} color={token.colorPrimary}/>
                                                </div>
                                            </Flex>
                                        </Flex>
                                    </div>
                                ))}
                            </Flex>
                        }
                    </Flex>
                </PaddingBlock>
            </DrawerBottom>

            {/*Edit guest*/}
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
                                    ghost
                                    htmlType={'button'}
                                    onClick={() => {
                                        ModalRemove({
                                            content: 'Are you sure you want to remove Guest?',
                                            showIcon: false,
                                            onRemove: (e) => {
                                                console.log(e)
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

            {/*Misc item*/}
            <DrawerBottom
                maxHeightVh={60}
                showDrawer={showMiscItems}
                closeDrawer={() => {setShowMiscItems(false)}}
                label={'Miscellaneous Items'}
                showButton={true}
                confirmButtonText={'Save'}
                onConfirmButtonClick={() => {setShowMiscItems(false)}}
            >
                <PaddingBlock>
                    {anyInList(miscItems) &&
                        <Flex vertical>
                            {miscItems.map((miscItem, index) => {
                                const isLastIndex = index === miscItems.length - 1;
                                
                                return (
                                   <div key={index} >
                                       <Flex justify={'space-between'} align={'center'}>
                                           <Title level={5} className={cx(globalStyles.noSpace)}>{miscItem.Text}</Title>

                                           <Flex gap={token.padding} align={'center'}>
                                               <SVG icon={'circle-minus'} size={30} color={token.colorError}/>
                                               <Title level={5} className={cx(globalStyles.noSpace)}>0</Title>
                                               <SVG icon={'circle-plus'} size={30} color={token.colorPrimary}/>
                                           </Flex>
                                       </Flex>

                                       {!isLastIndex &&
                                           <Divider className={styles.playersDivider}/> 
                                       }
                                   </div>
                                )
                            })}
                        </Flex>
                    }
                </PaddingBlock>
            </DrawerBottom>  
        </>
    )
}

export default ReservationRegistration
