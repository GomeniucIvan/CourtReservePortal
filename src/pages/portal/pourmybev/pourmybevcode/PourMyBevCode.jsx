import {useStyles} from "./../styles.jsx";
import {Flex, QRCode, Skeleton, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useApp} from "@/context/AppProvider.jsx";
import {useHeader} from "@/context/HeaderProvider.jsx";
import {useAuth} from "@/context/AuthProvider.jsx";
import apiService from "@/api/api.jsx";
import {isNullOrEmpty, toBoolean} from "@/utils/Utils.jsx";
import AlertBlock from "@/components/alertblock/AlertBlock.jsx";
import PaddingBlock from "@/components/paddingblock/PaddingBlock.jsx";
const {Title} = Typography;

function PourMyBevCode() {
    const {setHeaderRightIcons} = useHeader();
    const{setIsFooterVisible, setFooterContent, token, setIsLoading} = useApp();
    const {orgId, authData} = useAuth();
    const [isFetching, setIsFetching] = useState(null);
    const [modelData, setModelData] = useState(null);

    const loadData = async () => {
        setIsFetching(true);
        const response = await apiService.get(`/api/member-portal/member/get-pourmybev-code?orgId=${orgId}`);

        setModelData(response)
        setIsFetching(false);
        setIsLoading(false);
    }

    useEffect(() => {
        setIsFooterVisible(true);
        setFooterContent('')
        setHeaderRightIcons(null);
        loadData();
    }, []);
    return (
        <PaddingBlock topBottom={true}> 
            <Flex vertical={true} gap={token.padding} align={"center"} justify={"center"}>
                {toBoolean(isFetching) &&
                    <>
                        <Skeleton.Button block={true} style={{ height: '97px' }} active />
                        <Skeleton.Button block={true} style={{ height: '220px' }} active />
                    </>
                }

                {(!isFetching && !isNullOrEmpty(modelData?.Code)) &&
                   <>
                       {toBoolean(modelData?.ShowMessage) &&
                           <AlertBlock description={modelData?.Message} type={'danger'} removePadding={true}/>
                       }
                       
                       {/*<DashboardMembershipBar page={'pourmybevcode'} dashboardData={authData} />*/}

                       <QRCode
                           style={{ padding: 22 }}
                           size={220}
                           value={modelData?.Code}
                           status="active"
                       />
                   </>
                }
            </Flex>
        </PaddingBlock>
    )
}

export default PourMyBevCode
