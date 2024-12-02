import DrawerBottom from "../../../components/drawer/DrawerBottom.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Alert, Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {emptyArray} from "../../../utils/ListUtils.jsx";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    fullNameInitials,
    isNullOrEmpty, oneListItem,
    toBoolean
} from "../../../utils/Utils.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import SVG from "../../../components/svg/SVG.jsx";
import React, {useEffect, useState} from "react";
import mockData from "../../../mocks/reservation-data.json";
import appService, {apiRoutes} from "../../../api/app.jsx";
import {costDisplay} from "../../../utils/CostUtils.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {ModalRemove} from "../../../utils/ModalUtils.jsx";
import FormSwitch from "../../../form/formswitch/FormSwitch.jsx";
import FormSelect from "../../../form/formselect/FormSelect.jsx";
import {matchmakerGenderList, numberList} from "../../../utils/SelectUtils.jsx";
import InlineBlock from "../../../components/inlineblock/InlineBlock.jsx";
import FormTextarea from "../../../form/formtextarea/FormTextArea.jsx";
import FormInput from "../../../form/input/FormInput.jsx";
import {validateReservationMatchMaker} from "../../../utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";

const {Title, Text} = Typography;

function ReservationRegistrationMatchMaker({formik, 
                                               matchMaker, 
                                               selectedReservationType,
                                               matchMakerRatingCategories,
                                               matchMakerMemberGroups, 
                                               matchMakerShowSportTypes}) {

    const [showMatchMakerDrawer, setShowMatchMakerDrawer] = useState([]);
    const [matchMakerReceiptData, setMatchMakerReceiptData] = useState(null);
    const { globalStyles, token } = useApp();
    const {t} = useTranslation('');
    
    const closeAndCheckMatchMakerData = async () => {
        setShowMatchMakerDrawer(false);
        setMatchMakerReceiptData(validateReservationMatchMaker(t, formik, matchMaker, true, true));
    }
    
    return (
        <>
            {toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker) &&
                <>
                    <FormSwitch label={'Allow Players to join this Reservation'}
                                form={formik}
                                name={'IsOpenReservation'}/>

                    {toBoolean(formik?.values?.IsOpenReservation) &&
                        <>
                            {anyInList(matchMakerReceiptData) &&
                                <>
                                    <div style={{marginBottom: token.Custom.buttonPadding}}>
                                        <Alert
                                            className={matchMakerReceiptData.some(v => isNullOrEmpty(v.Value)) ? 'ant-input-status-error' : ''}
                                            message={<div>
                                                {matchMakerReceiptData.map((item, index) => {
                                                    const isLastItem = index === matchMakerReceiptData.length - 1;

                                                    return (
                                                        <span key={index}>
                                                                        <Flex align={'center'} justify={'space-between'}>
                                                                            <Text>
                                                                                <strong>{item.Text}</strong>
                                                                            </Text>
                                                                            <Text>
                                                                                {item.Value}
                                                                            </Text>
                                                                        </Flex>
                                                            {!isLastItem && (
                                                                <Divider
                                                                    variant="dashed"
                                                                    className={globalStyles.alertDivider}
                                                                />
                                                            )}
                                                                    </span>
                                                    )
                                                })}
                                            </div>}
                                            type={matchMakerReceiptData.some(v => isNullOrEmpty(v.Value)) ? 'error' : 'info'} />
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
                                {!isNullOrEmpty(matchMakerReceiptData) ? (<>Edit Join
                                    Criteria</>) : (<>Setup
                                    Join
                                    Criteria</>)}
                            </Button>
                        </>
                    }
                </>
            }

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
                    {toBoolean(matchMakerShowSportTypes) &&
                        <FormSelect form={formik}
                                    name={`SportTypeId`}
                                    label='Sport Type'
                                    options={matchMaker?.ActiveSportTypes}
                                    disabled={oneListItem(matchMaker?.ActiveSportTypes)}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>
                    }

                    {(anyInList(matchMaker?.MatchMakerTypes) && toBoolean(matchMaker?.IsMatchTypeEnabled)) &&
                        <FormSelect form={formik}
                                    name={`MatchMakerTypeId`}
                                    label='Match Type'
                                    options={matchMaker?.MatchMakerTypes}
                                    required={true}
                                    propText='Name'
                                    propValue='Id'/>
                    }

                    {toBoolean(matchMaker?.IsGenderCriteriaMatch) &&
                        <FormSelect form={formik}
                                    name={`MatchMakerGender`}
                                    label='Gender Restrictions'
                                    options={matchmakerGenderList}
                                    required={true}
                                    propText='Text'
                                    propValue='Value'/>
                    }

                    {(anyInList(matchMaker?.RatingCategoryIds) && anyInList(matchMakerRatingCategories)) &&
                        <>
                            <FormSelect form={formik}
                                        name={`MatchMakerRatingCategoryId`}
                                        label='Rating Restriction'
                                        options={matchMakerRatingCategories}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>

                            {(anyInList(matchMakerRatingCategories) ? matchMakerRatingCategories : []).map((matchMakerRatingCateg, index) => {
                                if (!equalString(matchMakerRatingCateg.Id, formik?.values?.MatchMakerRatingCategoryId)) {
                                    return (<div key={index}></div>);
                                }

                                let selectedRatingCategory = matchMakerRatingCategories.find(v => equalString(v.Id, formik?.values?.MatchMakerRatingCategoryId));

                                return (
                                    <div key={index}>
                                        <FormSelect form={formik}
                                                    multi={true}
                                                    name={`MatchMakerRatingCategoryRatingIds`}
                                                    label={`${selectedRatingCategory?.Name} Eligible Rating(s)`}
                                                    options={matchMakerRatingCateg.Ratings}
                                                    required={!oneListItem(matchMakerRatingCategories)}
                                                    propText='Name'
                                                    propValue='Id'/>
                                    </div>
                                )
                            })}
                        </>
                    }

                    {anyInList(matchMaker?.MemberGroupIds) &&
                        <FormSelect form={formik}
                                    name={`MatchMakerMemberGroupIds`}
                                    label='Member Groups'
                                    options={matchMakerMemberGroups}
                                    required={true}
                                    multi={true}
                                    propText='NavigationName'
                                    propValue='Id'/>
                    }

                    <InlineBlock>
                        <FormSelect form={formik}
                                    name={`MatchMakerMinNumberOfPlayers`}
                                    label='Min. Players'
                                    options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                    required={true}
                                    onValueChange={(e) => {
                                        let selectedMinValueInt = parseInt(e.Value);
                                        let selectedMaxValue = formik?.values?.MatchMakerMaxNumberOfPlayers;
                                        if (!isNullOrEmpty(selectedMaxValue)) {
                                            let selectedMaxValueInt = parseInt(selectedMaxValue);
                                            if (selectedMaxValueInt < selectedMinValueInt) {
                                                formik?.setFieldValue('MatchMakerMaxNumberOfPlayers', selectedMinValueInt);
                                            }
                                        }
                                    }}
                                    propText='Text'
                                    propValue='Value'/>

                        <FormSelect form={formik}
                                    name={`MatchMakerMaxNumberOfPlayers`}
                                    label='Max. Players'
                                    options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                    required={true}
                                    onValueChange={(e) => {
                                        let selectedMaxValueInt = parseInt(e.Value);
                                        let selectedMinValue = formik?.values?.MatchMakerMinNumberOfPlayers;
                                        if (!isNullOrEmpty(selectedMinValue)) {
                                            let selectedMinValueInt = parseInt(selectedMinValue);
                                            if (selectedMinValueInt > selectedMaxValueInt) {
                                                formik?.setFieldValue('MatchMakerMinNumberOfPlayers', selectedMaxValueInt);
                                            }
                                        }
                                    }}
                                    propText='Text'
                                    propValue='Value'/>
                    </InlineBlock>

                    {toBoolean(matchMaker?.IsAgeCriteriaMatch) &&
                        <InlineBlock>
                            <FormSelect form={formik}
                                        name={`MatchMakerMinAge`}
                                        label='Min Age'
                                        options={numberList(1, 99)}
                                        onValueChange={(e) => {
                                            let selectedMinValueInt = parseInt(e.Value);
                                            let selectedMaxValue = formik?.values?.MatchMakerMaxAge;
                                            if (!isNullOrEmpty(selectedMaxValue)) {
                                                let selectedMaxValueInt = parseInt(selectedMaxValue);
                                                if (selectedMaxValueInt < selectedMinValueInt) {
                                                    formik?.setFieldValue('MatchMakerMaxAge', selectedMinValueInt);
                                                }
                                            }
                                        }}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>

                            <FormSelect form={formik}
                                        name={`MatchMakerMaxAge`}
                                        label='Max Age'
                                        options={numberList(1, 99)}
                                        onValueChange={(e) => {
                                            let selectedMaxValueInt = parseInt(e.Value);
                                            let selectedMinValue = formik?.values?.MatchMakerMinAge;
                                            if (!isNullOrEmpty(selectedMinValue)) {
                                                let selectedMinValueInt = parseInt(selectedMinValue);
                                                if (selectedMinValueInt > selectedMaxValueInt) {
                                                    formik?.setFieldValue('MatchMakerMinAge', selectedMaxValueInt);
                                                }
                                            }
                                        }}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>
                        </InlineBlock>
                    }

                    <FormTextarea form={formik}
                                  max={200}
                                  label={'What to expect in this match'}
                                  name={`Description`}/>

                    {toBoolean(matchMaker?.AllowPrivateMatches) &&
                        <>
                            <FormSwitch label={'Is this a private match'}
                                        form={formik}
                                        name={'MatchMakerIsPrivateMatch'}/>

                            {toBoolean(formik?.values?.MatchMakerIsPrivateMatch) &&
                                <FormInput form={formik}
                                           required={true}
                                           label={'Join Code'}
                                           name={`MatchMakerJoinCode`}/>
                            }
                        </>
                    }
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ReservationRegistrationMatchMaker