import {useLocation, useNavigate, useParams} from "react-router-dom";
import { IndexBar, List } from 'antd-mobile';
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import appService from "@/api/app.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import {emptyArray} from "@/utils/ListUtils.jsx";
import {Button, Card, Divider, Flex, Skeleton, Typography} from "antd";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {cx} from "antd-style";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import DrawerBottom from "@/components/drawer/DrawerBottom.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import {useStyles} from '../styles.jsx'
import SVG from "@/components/svg/SVG.jsx";
import {reactNativeLaunchEmail, reactNativeLaunchTel} from "@/utils/MobileUtils.jsx";
const {Text} = Typography;

function MemberGroupDetails() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState({});
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const {isMockData, setIsFooterVisible, shouldFetch, resetFetch, setFooterContent, availableHeight, globalStyles} = useApp();
    const {orgId} = useAuth();
    const {token} = useApp();
    const [isFetching, setIsFetching] = useState(true);
    const [modelData, setModelData] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const memberGroupId = queryParams.get("memberGroupId");
    const [selectedMember, setSelectedMember] = useState(null);
    const {styles} = useStyles();

    const loadData = (refresh) => {
        if (isMockData) {

            setIsFetching(false)
        } else {
            setIsFetching(true);
            appService.get(navigate, `/app/Online/PublicMemberGroup/GetGroupMembers?id=${orgId}&groupId=${memberGroupId}`).then(r => {

                if (toBoolean(r?.IsValid)){
                    const data = r.Data;
                    setHeaderTitle(data.Name);
                    setModelData(data);
                    //todo SelectedMemberPortalFields

                    const groupByFirstName = equalString(data.DefaultSortingOption, 1) || equalString(data.DefaultSortingOption, 3);
                    const groupByLastName = equalString(data.DefaultSortingOption, 2);
                    if (groupByFirstName){
                        const grouped = data.Members.reduce((acc, member) => {
                            const letter = member.FirstNameFirstLetter;
                            if (!acc[letter]) {
                                acc[letter] = [];
                            }
                            acc[letter].push(member);
                            return acc;
                        }, {});

                        setGroups(grouped);

                    } else if(groupByLastName){
                        const grouped = data.Members.reduce((acc, member) => {
                            const letter = member.LastNameFirstLetter;
                            if (!acc[letter]) {
                                acc[letter] = [];
                            }
                            acc[letter].push(member);
                            return acc;
                        }, {});

                        setGroups(grouped);
                    }
                }

                setIsFetching(false);
            })
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
        setFooterContent('');
        loadData();
    }, []);

    const showFirstName = !anyInList(modelData?.SelectedMemberPortalFields) || modelData?.SelectedMemberPortalFields?.some(v => equalString(v, 1));
    const showLastName = !anyInList(modelData?.SelectedMemberPortalFields) || modelData?.SelectedMemberPortalFields?.some(v => equalString(v, 2));
    const showEmail = !anyInList(modelData?.SelectedMemberPortalFields) || modelData?.SelectedMemberPortalFields?.some(v => equalString(v, 4));
    const showGender = !anyInList(modelData?.SelectedMemberPortalFields) || modelData?.SelectedMemberPortalFields?.some(v => equalString(v, 3));
    const showPhoneNumber = !anyInList(modelData?.SelectedMemberPortalFields) || modelData?.SelectedMemberPortalFields?.some(v => equalString(v, 5));
    const showRatingCategories = anyInList(modelData?.CustomRatingCategories);
    const showUdfs = anyInList(modelData?.Udfs);

    return (
        <>
            {isFetching &&
                <Flex vertical={true} gap={1}>
                    {emptyArray(20).map((item, index) => (
                        <Skeleton.Button block key={index} active={true} style={{height : '40px'}} />
                    ))}
                </Flex>
            }

            {!isFetching &&
                <div style={{height: `${availableHeight}px`}} className={globalStyles.indexBar}>
                    <IndexBar>
                        {Object.keys(groups).map(letter => (
                            <IndexBar.Panel
                                index={letter}
                                title={letter}
                                key={letter}
                            >
                                <List>
                                    {groups[letter].map((member, index) => (
                                        <List.Item key={index} className={cx(globalStyles.clickableCard)}>
                                            <div onClick={() => setSelectedMember(member)} >
                                                <Text>
                                                    {member.FullName}
                                                </Text>
                                            </div>
                                        </List.Item>
                                    ))}
                                </List>
                            </IndexBar.Panel>
                        ))}
                    </IndexBar>
                </div>
            }

            <DrawerBottom
                maxHeightVh={60}
                showDrawer={!isNullOrEmpty(selectedMember)}
                showButton={true}
                confirmButtonText={'Close'}
                onConfirmButtonClick={() => {
                    setSelectedMember(null)
                }}
                closeDrawer={() => {
                    setSelectedMember(null)
                }}
                label={selectedMember?.FullName}
            >
                <PaddingBlock>
                    <Flex vertical={true} gap={token.padding}>
                        {(toBoolean(showFirstName) && !isNullOrEmpty(selectedMember?.FirstName)) &&
                            <>
                                <FormInputDisplay label={'First Name'} value={selectedMember?.FirstName} />
                            </>
                        }
                        {(toBoolean(showLastName) && !isNullOrEmpty(selectedMember?.LastName)) &&
                            <>
                                <FormInputDisplay label={'Last Name'} value={selectedMember?.LastName} />
                            </>
                        }

                        {(toBoolean(showEmail) && !isNullOrEmpty(selectedMember?.Email)) &&
                            <Flex align={'center'}
                                  justify={'space-between'}
                                  className={styles.drawerClickableRow}>
                                <FormInputDisplay label={'Email'} value={selectedMember?.Email} />
                                <Button
                                    className={styles.drawerButton}
                                    icon={<SVG icon={'envelope-light'} color={token.colorText} />}
                                    onClick={() => reactNativeLaunchEmail(selectedMember?.Email)}
                                />
                            </Flex>
                        }

                        {(toBoolean(showGender) && !isNullOrEmpty(selectedMember?.Gender)) &&
                            <>
                                <FormInputDisplay label={'Gender'} value={selectedMember?.Gender} />
                            </>
                        }
                        {(toBoolean(showPhoneNumber) && !isNullOrEmpty(selectedMember?.PhoneNumber)) &&
                            <Flex align={'center'}
                                  justify={'space-between'}
                                  className={styles.drawerClickableRow}>
                                <FormInputDisplay label={'Phone Number'} value={selectedMember?.PhoneNumber}/>

                                <Button
                                    className={styles.drawerButton}
                                    icon={<SVG icon={'phone-light'} color={token.colorText} />}
                                    onClick={() => reactNativeLaunchTel(selectedMember?.Email)}
                                />
                            </Flex>
                        }
                        {(showUdfs && anyInList(selectedMember?.Udfs)) &&
                            <>
                                {selectedMember.Udfs.map((udf, index) => {

                                    return (
                                        <FormInputDisplay label={udf.Label} value={udf?.Value} key={`udf_${index}`} />
                                    )
                                })}
                            </>
                        }
                        {(showRatingCategories && anyInList(selectedMember?.MemberCustomCategoryRatings)) &&
                            <>
                                {selectedMember.MemberCustomCategoryRatings.map((item, index) => {
                                    if (
                                        item &&
                                        (item.RatingName ||
                                            (item.FormattedDoubleValue && item.FormattedDoubleValue !== "" && item.FormattedDoubleValue !== "NR") ||
                                            (item.FormattedSinglesValue && item.FormattedSinglesValue !== "" && item.FormattedSinglesValue !== "NR"))
                                    ) {
                                        const ratingCategory = ratingCategoriesObj.find(v => v.CategoryId === item.RatingCategoryId);
                                        if (ratingCategory) {
                                            return (
                                                <div key={`rating_${index}`}>
                                                    {ratingCategory.Type === 2 && ratingCategory.CategoryName === "DUPR" ? (
                                                        <>
                                                            {item.FormattedSinglesValue && ratingCategory.AllowSingles && item.FormattedSinglesValue !== "NR" && (
                                                                <FormInputDisplay label={`${ratingCategory.CategoryName} - Singles`}
                                                                                  value={item?.FormattedSinglesValue} />
                                                            )}
                                                            {item.FormattedDoubleValue && ratingCategory.AllowDoubles && item.FormattedDoubleValue !== "NR" && (
                                                                <FormInputDisplay label={`${ratingCategory.CategoryName} - Doubles`}
                                                                                  value={item?.FormattedDoubleValue} />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <FormInputDisplay label={`${ratingCategory.CategoryName}`}
                                                                          value={item?.RatingName} />
                                                    )}
                                                </div>
                                            );
                                        }
                                    }
                                    return null;
                                })}
                            </>
                        }
                    </Flex>
                </PaddingBlock>
            </DrawerBottom>
        </>
    )
}

export default MemberGroupDetails;