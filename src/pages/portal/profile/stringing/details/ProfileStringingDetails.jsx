import {useEffect, useState} from "react";
import {Button, Card, Divider, Flex, Skeleton, Space, Typography} from "antd";
import * as React from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import appService from "@/api/app.jsx";
import {anyInList, isNullOrEmpty, oneListItem, toBoolean} from "@/utils/Utils.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthProvider.jsx";
import {pNotify} from "@/components/notification/PNotify.jsx";
import {countListItems, emptyArray} from "@/utils/ListUtils.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
import FormInputDisplay from "@/form/input/FormInputDisplay.jsx";
import Modal from "@/components/modal/Modal.jsx";
import FooterBlock from "@/components/footer/FooterBlock.jsx";
import {toRoute} from "@/utils/RouteUtils.jsx";
import {ProfileRouteNames} from "@/routes/ProfileRoutes.jsx";

const {Title, Text} = Typography;

function ProfileStringingDetails() {
    const navigate = useNavigate();
    const {setHeaderRightIcons, setHeaderTitle} = useHeader();
    const [isFetching, setIsFetching] = useState(true);
    const [stringingModel, setStringingModel] = useState(true);
    const [selectedStringJob, setSelectedStringJob] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const stringId = queryParams.get("stringId");
    
    const {
        setIsFooterVisible,
        globalStyles,
        token,
        setFooterContent
    } = useApp();
    const {orgId} = useAuth();

    const loadData = async () => {
        let response = await appService.get(navigate, `/app/Online/StringingJob/Details?id=${orgId}&stringingJobId=${stringId}`);
        
        if (toBoolean(response?.IsValid)) {
            let data = response.Data;
            setStringingModel(data);
            setHeaderTitle(`Job #${data.JobNumber}`);
        } else {
            pNotify(response?.Message, 'error');
        }

        setIsFetching(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('');
        setHeaderRightIcons('')

        loadData();
    }, []);
    
    useEffect(() => {
        if (!isNullOrEmpty(stringingModel)){
            let showPaymentButton = toBoolean(stringingModel?.ShowPayBtnMemberPortal);
            if (showPaymentButton) {
                setIsFooterVisible(true);
                setFooterContent(<FooterBlock topBottom={true}>
                    <Button type="primary"
                            block
                            htmlType="button"
                            onClick={() => {
                                let route = toRoute(ProfileRouteNames.PROCESS_TRANSACTION_PAYMENT, 'id', orgId);
                                navigate(`${route}?payments=${stringingModel?.FeeId}`);
                            }}>
                        Pay
                    </Button>
                </FooterBlock>);
            }
        }
    }, [stringingModel])
    
    return (
        <PaddingBlock topBottom={true}>
            {isFetching &&
                <Flex vertical={true} gap={token.padding}>
                    {emptyArray(6).map((item, index) => (
                        <div key={index}>
                            <Skeleton.Button block key={index} active={true} style={{height: `48px`}}/>
                        </div>
                    ))}
                </Flex>
            }

            {(!isFetching && !isNullOrEmpty(stringingModel)) &&
                <Flex vertical={true} gap={token.padding}>
                    <FormInputDisplay label={'Status'} value={stringingModel?.StatusDisplay}/>
                    {!isNullOrEmpty(stringingModel?.StringerId) &&
                        <FormInputDisplay label={'Stringer'} value={stringingModel?.StringerFullName}/>
                    }
                    {(!isNullOrEmpty(stringingModel?.PriceFee) && stringingModel.PriceFee > 0) &&
                        <FormInputDisplay label={'Total'} value={stringingModel?.PriceFeeDisplay}/>
                    }
                    {anyInList(stringingModel?.StringingJobRacquets) &&
                        <>
                            {stringingModel.StringingJobRacquets.map((stringJob, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <Card>
                                            <Flex vertical={true} gap={token.paddingSM}>
                                                <Flex vertical={true} gap={token.paddingXXS}>
                                                    <Title level={4}>{`Racquet #${index+1}`}</Title>
                                                    <Text>{stringJob.Description}</Text>
                                                </Flex>
                                                <Button block={true} onClick={() => {setSelectedStringJob(stringJob)}}>View {countListItems(stringJob.CartItems)} item(s)</Button>
                                            </Flex>
                                        </Card>
                                    </React.Fragment>
                                )
                            })}
                        </>
                    }
                </Flex>
            }

            <Modal show={!isNullOrEmpty(selectedStringJob)}
                   onClose={() => {setSelectedStringJob(null)}}
                   showConfirmButton={false}
                   title={`Job Items`}>
                <>
                    {anyInList(selectedStringJob?.CartItems) &&
                        <>
                            {selectedStringJob.CartItems.map((cartItem, index) => {
                                let isLastItem = index === selectedStringJob.CartItems.length - 1;

                                return (
                                    <React.Fragment key={index}>
                                        <>
                                            <PaddingBlock>
                                                <Flex vertical={true} gap={token.paddingXXS}>
                                                    <Text>{cartItem.Name}{isNullOrEmpty(cartItem?.VariationName) ? '' : ` - ${cartItem?.VariationName}`}</Text>
                                                    <Text>{cartItem.ItemCategory}</Text>
                                                    <Text><strong>{cartItem.TotalPriceDisplay}</strong> ({cartItem.ItemListPriceDisplay} x {cartItem.Quantity})
                                                    </Text>
                                                </Flex>
                                            </PaddingBlock>

                                            {!isLastItem &&
                                                <Divider />
                                            }
                                        </>
                                    </React.Fragment>
                                )})}
                        </>
                    }
                </>
            </Modal>
        </PaddingBlock>
    )
}

export default ProfileStringingDetails
