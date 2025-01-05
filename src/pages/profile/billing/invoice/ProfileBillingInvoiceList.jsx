import styles from './ProfileBillingInvoiceList.module.less'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../context/AuthProvider.jsx";
import {useApp} from "../../../../context/AppProvider.jsx";
import apiService from "../../../../api/api.jsx";
import {anyInList, equalString, isNullOrEmpty, toBoolean} from "../../../../utils/Utils.jsx";
import appService from "../../../../api/app.jsx";
import PaddingBlock from "../../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Segmented, Skeleton, Typography, Badge, Card} from "antd";
import {emptyArray} from "../../../../utils/ListUtils.jsx";
import * as React from "react";
import CardIconLabel from "../../../../components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
const {Title} = Typography;

function ProfileBillingInvoiceList({selectedTab, tabsHeight}) {
    
    const {
        token,
        globalStyles,
        setIsFooterVisible,
        setHeaderRightIcons,
        availableHeight,
        setFooterContent
    } = useApp();
    
    const navigate = useNavigate();
    let { orgId } = useAuth();
    const [invoices, setInvoices] = useState(null);
    const [bodyHeight, setBodyHeight] = useState(availableHeight);
    
    const fixHeaderItems = () => {
        console.log(tabsHeight)
        
        setBodyHeight(availableHeight - tabsHeight);
    }

    const loadData = async () => {
        let response = await appService.get(navigate, `/app/Online/MyInvoices/GetAllInvoices?id=${orgId}`);
        console.log(response);
        if (toBoolean(response?.IsValid)) {
            setInvoices(response?.Data);
            fixHeaderItems()
        } else{
            setInvoices([]);
        }
    }

    useEffect(() => {
        if (equalString(selectedTab, 'invoices')) {
            setIsFooterVisible(true);
            setHeaderRightIcons('')
            setFooterContent('');
            if (isNullOrEmpty(invoices)){
                loadData();
            }
            fixHeaderItems();
        }
    }, [selectedTab])

    return (
        <div style={{height: `${bodyHeight}px`, overflow: 'hidden auto'}}>
            <PaddingBlock onlyBottom={true}>
                {isNullOrEmpty(invoices) &&
                    <Flex vertical={true} gap={token.padding}>
                        {emptyArray(5).map((innerItem, innerIndex) => (
                            <Skeleton.Input key={innerIndex}  active={true} block style={{height: '80px'}}/>
                        ))}
                    </Flex>
                }

                {anyInList(invoices) &&
                    <Flex vertical={true} gap={token.padding}>
                        {invoices.map((invoice, index) => {
                            let ribonColor = '';
                            if (equalString(invoice.Status, 1)) {
                                //pending
                                ribonColor = 'orange';
                            } else if (equalString(invoice.Status, 2)) {
                                //pending
                                ribonColor = 'green';
                            } else if (equalString(invoice.Status, 3)) {
                                //past due
                                ribonColor = token.colorError;
                            } else if (equalString(invoice.Status, 4)) {
                                //PaymentDeclined
                                ribonColor = token.colorError;
                            } else if (equalString(invoice.Status, 5)) {
                                //Voided
                                ribonColor = token.colorError;
                            } else if (equalString(invoice.Status, 6)) {
                                //InvoiceOnly
                                ribonColor = 'yellow';
                            } else if (equalString(invoice.Status, 7)) {
                                //VoidedRegenerated
                                ribonColor = token.colorError;
                            }
                            
                            return (
                                <div key={index}>
                                    <Badge.Ribbon text={invoice.StatusToDisplay}
                                                  color={ribonColor}
                                                  className={globalStyles.urgentRibbon}>
                                        <Card className={cx(globalStyles.card, globalStyles.clickableCard)}>
                                            <Flex vertical={true}>

                                                {!isNullOrEmpty(invoice.Number) &&
                                                    <Title level={4}>#{invoice.Number}</Title>
                                                }

                                                {!isNullOrEmpty(invoice.MemberFullName) &&
                                                    <CardIconLabel icon={'person'}
                                                                   description={invoice.MemberFullName}/>
                                                }

                                                {!isNullOrEmpty(invoice.CreatedOnDisplay) &&
                                                    <CardIconLabel icon={'calendar'}
                                                                   description={invoice.CreatedOnDisplay}/>
                                                }
                                                {!isNullOrEmpty(invoice.AmountToProcessDisplay) &&
                                                    <CardIconLabel icon={'money'}
                                                                   description={invoice.AmountToProcessDisplay}/>
                                                }
                                            </Flex>
                                        </Card>
                                    </Badge.Ribbon>
                                </div>
                            )
                        })}
                    </Flex>
                }
            </PaddingBlock>
        </div>
    )
}

export default ProfileBillingInvoiceList
