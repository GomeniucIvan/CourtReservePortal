import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import {Alert, Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {
    anyInList,
    encodeParamsObject,
    equalString,
    fullNameInitials,
    isNullOrEmpty, oneListItem,
    toBoolean
} from "@/utils/Utils.jsx";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import FormSwitch from "@/form/formswitch/FormSwitch.jsx";
import FormSelect from "@/form/formselect/FormSelect.jsx";
import {matchmakerGenderList, numberList} from "@/utils/SelectUtils.jsx";
import InlineBlock from "@/components/inlineblock/InlineBlock.jsx";
import FormTextarea from "@/form/formtextarea/FormTextArea.jsx";
import FormInput from "@/form/input/FormInput.jsx";
import {validateReservationMatchMaker} from "@/utils/ValidationUtils.jsx";
import {useTranslation} from "react-i18next";

const {Title, Text} = Typography;

function ReservationRegistrationMatchMaker({formik, 
                                               matchMaker, 
                                               selectedReservationType,
                                               matchMakerRatingCategories,
                                               matchMakerMemberGroups, 
                                               matchMakerShowSportTypes}) {

    const [showMatchMakerDrawer, setShowMatchMakerDrawer] = useState(false);
    const [matchMakerReceiptData, setMatchMakerReceiptData] = useState(null);
    const { globalStyles, token } = useApp();
    const {t} = useTranslation('');
    
    const closeAndCheckMatchMakerData = async () => {
        setShowMatchMakerDrawer(false);
        setMatchMakerReceiptData(validateReservationMatchMaker(t, formik, matchMaker, true, true));
    }

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.MatchMakerMinAge)){
            let selectedMinValueInt = parseInt(formik?.values?.MatchMakerMinAge);
            let selectedMaxValue = formik?.values?.MatchMakerMaxAge;
            if (!isNullOrEmpty(selectedMaxValue)) {
                let selectedMaxValueInt = parseInt(selectedMaxValue);
                if (selectedMaxValueInt < selectedMinValueInt) {
                    formik?.setFieldValue('MatchMakerMaxAge', selectedMinValueInt);
                }
            }
        }
    }, [formik?.values?.MatchMakerMinAge]);

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.MatchMakerMaxAge)){
            let selectedMaxValueInt = parseInt(formik?.values?.MatchMakerMaxAge);
            let selectedMinValue = formik?.values?.MatchMakerMinAge;
            if (!isNullOrEmpty(selectedMinValue)) {
                let selectedMinValueInt = parseInt(selectedMinValue);
                if (selectedMinValueInt > selectedMaxValueInt) {
                    formik?.setFieldValue('MatchMakerMinAge', selectedMaxValueInt);
                }
            }
        }
    }, [formik?.values?.MatchMakerMaxAge]);
    
    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.MatchMakerMinNumberOfPlayers)){
            let selectedMinValueInt = parseInt(formik?.values?.MatchMakerMinNumberOfPlayers);
            let selectedMaxValue = formik?.values?.MatchMakerMaxNumberOfPlayers;
            if (!isNullOrEmpty(selectedMaxValue)) {
                let selectedMaxValueInt = parseInt(selectedMaxValue);
                if (selectedMaxValueInt < selectedMinValueInt) {
                    formik?.setFieldValue('MatchMakerMaxNumberOfPlayers', selectedMinValueInt);
                }
            }
        }
        
    }, [formik?.values?.MatchMakerMinNumberOfPlayers])

    useEffect(() => {
        if (!isNullOrEmpty(formik?.values?.MatchMakerMaxNumberOfPlayers)){
            let selectedMaxValueInt = parseInt(formik?.values?.MatchMakerMaxNumberOfPlayers);
            let selectedMinValue = formik?.values?.MatchMakerMinNumberOfPlayers;
            if (!isNullOrEmpty(selectedMinValue)) {
                let selectedMinValueInt = parseInt(selectedMinValue);
                if (selectedMinValueInt > selectedMaxValueInt) {
                    formik?.setFieldValue('MatchMakerMinNumberOfPlayers', selectedMaxValueInt);
                }
            }
        }

    }, [formik?.values?.MatchMakerMaxNumberOfPlayers])
    
    return (
        <>
            {toBoolean(selectedReservationType?.IsEligibleForPlayerMatchMaker) &&
                <>
                    <FormSwitch label={'Allow Players to join this Reservation'}
                                formik={formik}
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
                    <Flex vertical={true} gap={token.padding}>
                        {toBoolean(matchMakerShowSportTypes) &&
                            <FormSelect formik={formik}
                                        name={`SportTypeId`}
                                        label='Sport Type'
                                        options={matchMaker?.ActiveSportTypes}
                                        disabled={oneListItem(matchMaker?.ActiveSportTypes)}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>
                        }

                        {(anyInList(matchMaker?.MatchMakerTypes) && toBoolean(matchMaker?.IsMatchTypeEnabled)) &&
                            <FormSelect formik={formik}
                                        name={`MatchMakerTypeId`}
                                        label='Match Type'
                                        options={matchMaker?.MatchMakerTypes}
                                        required={true}
                                        propText='Name'
                                        propValue='Id'/>
                        }

                        {toBoolean(matchMaker?.IsGenderCriteriaMatch) &&
                            <FormSelect formik={formik}
                                        name={`MatchMakerGender`}
                                        label='Gender Restrictions'
                                        options={matchmakerGenderList}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>
                        }

                        {(anyInList(matchMaker?.RatingCategoryIds) && anyInList(matchMakerRatingCategories)) &&
                            <>
                                <FormSelect formik={formik}
                                            name={`MatchMakerRatingCategoryId`}
                                            label='Rating Restriction'
                                            options={matchMakerRatingCategories}
                                            required={true}
                                            propText='Name'
                                            propValue='Id'/>

                                {(anyInList(matchMakerRatingCategories) ? matchMakerRatingCategories : []).map((matchMakerRatingCateg, index) => {
                                    if (!equalString(matchMakerRatingCateg.Id, formik?.values?.MatchMakerRatingCategoryId)) {
                                        return (<div style={{display:'none'}} key={index}></div>);
                                    }

                                    let selectedRatingCategory = matchMakerRatingCategories.find(v => equalString(v.Id, formik?.values?.MatchMakerRatingCategoryId));
                                    return (
                                        <div key={index}>
                                            <FormSelect formik={formik}
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
                            <FormSelect formik={formik}
                                        name={`MatchMakerMemberGroupIds`}
                                        label='Member Groups'
                                        options={matchMakerMemberGroups}
                                        required={true}
                                        multi={true}
                                        propText='NavigationName'
                                        propValue='Id'/>
                        }

                        <InlineBlock>
                            <FormSelect formik={formik}
                                        name={`MatchMakerMinNumberOfPlayers`}
                                        label='Min. Players'
                                        options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>

                            <FormSelect formik={formik}
                                        name={`MatchMakerMaxNumberOfPlayers`}
                                        label='Max. Players'
                                        options={numberList((selectedReservationType?.MinimumNumberOfPlayers ?? 2), selectedReservationType?.MaximumNumberOfPlayers ?? 25)}
                                        required={true}
                                        propText='Text'
                                        propValue='Value'/>
                        </InlineBlock>

                        {toBoolean(matchMaker?.IsAgeCriteriaMatch) &&
                            <InlineBlock>
                                <FormSelect formik={formik}
                                            name={`MatchMakerMinAge`}
                                            label='Min Age'
                                            options={numberList(1, 99)}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>

                                <FormSelect formik={formik}
                                            name={`MatchMakerMaxAge`}
                                            label='Max Age'
                                            options={numberList(1, 99)}
                                            required={true}
                                            propText='Text'
                                            propValue='Value'/>
                            </InlineBlock>
                        }

                        <FormTextarea formik={formik}
                                      max={200}
                                      label={'What to expect in this match'}
                                      name={`Description`}/>

                        {toBoolean(matchMaker?.AllowPrivateMatches) &&
                            <>
                                <FormSwitch label={'Is this a private match'}
                                            formik={formik}
                                            name={'MatchMakerIsPrivateMatch'}/>

                                {toBoolean(formik?.values?.MatchMakerIsPrivateMatch) &&
                                    <FormInput formik={formik}
                                               required={true}
                                               label={'Join Code'}
                                               name={`MatchMakerJoinCode`}/>
                                }
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default ReservationRegistrationMatchMaker