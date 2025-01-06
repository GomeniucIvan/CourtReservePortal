import * as React from "react";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Skeleton} from "antd";
import FormInputDisplay from "../../../form/input/FormInputDisplay.jsx";
import {ModalDelete} from "../../../utils/ModalUtils.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import {useState} from "react";
import appService from "../../../api/app.jsx";
import {useAuth} from "../../../context/AuthProvider.jsx";
import {pNotify} from "../../../components/notification/PNotify.jsx";
import {AuthRouteNames} from "../../../routes/AuthRoutes.jsx";
import {useNavigate} from "react-router-dom";

function MyProfileSettings({}) {
    const navigate = useNavigate();
    const { token } = useApp();
    const { orgId, } = useAuth();
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    
    const deleteMessageBlock = () => {
        return (
            <>
                <Text>
                    Are you sure you want to delete your account? Please read the following carefully before proceeding:
                </Text>
                <br/>
                <Text>
                    <b>Permanent Deletion:</b> This action is irreversible. Once your account is deleted, all your data,
                    including profile information, preferences, and associated content, will be permanently removed.
                </Text>
                <br/>
                <Text>
                    <b>No Recovery:</b> You will not be able to recover any data after the deletion is complete. If you
                    have any content or information you wish to keep, we recommend saving it externally before
                    proceeding.
                </Text>
                <br/>
                <Text>
                    <b>Subscription and Services:</b> If you have any active subscriptions or services linked to your account, they will be canceled.
                </Text>
            </>
        )
    }

    const deleteAccountPost = async () => {
        setIsDeletingAccount(true);
        
        let response = await appService.post(`/app/Online/MyProfile/DeleteAccount?id=${orgId}`)
        if (response) {
            pNotify('Account deletion initiated.');
            
            //ToDo check if login contains all delete logic like clear cache, clear claims
            navigate(AuthRouteNames.LOGIN);
        }
    }
    
    return (
        <PaddingBlock onlyBottom={true}>
            <Flex vertical={true} gap={token.padding}>
                <FormInputDisplay label={'Version'} value={1.28}/>

                <Button type={'primary'} danger block loading={isDeletingAccount} onClick={() => {
                    ModalDelete({
                        content: deleteMessageBlock(),
                        showIcon: false,
                        onDelete: (e) => {
                           deleteAccountPost();
                        }
                    })
                }}>
                    Delete Account
                </Button>
            </Flex>
        </PaddingBlock>
    )
}

export default MyProfileSettings
