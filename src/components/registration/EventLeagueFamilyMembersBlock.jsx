import { useApp } from "../../context/AppProvider.jsx";
import {Flex, List, Switch, Typography} from "antd";
import React from "react";
const {Title} = Typography;

const EventLeagueFamilyMembersBlock = ({formik, toggleInitialCheck}) => {
    const { token, globalStyles } = useApp();
    
    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={formik.values.FamilyMembers}
                bordered
                renderItem={(member, index) => {
                    return (
                        <List.Item className={globalStyles.listItemSM}>
                            <Flex vertical={true} gap={token.padding} flex={1}>
                                <Flex justify={'space-between'} align={'center'}>
                                    <Title level={3} onClick={() => {
                                        toggleInitialCheck(index)
                                    }}>
                                        {member.FirstName} {member.LastName}
                                    </Title>
                                    <Switch checked={member.IsChecked} onChange={() => toggleInitialCheck(index)}/>
                                </Flex>
                            </Flex>
                        </List.Item>
                    )
                }}
            />
        </>
    );
};

export default EventLeagueFamilyMembersBlock;