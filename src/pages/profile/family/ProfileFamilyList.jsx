import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Avatar, Button, Card} from "antd";
import {
    DeleteOutlined,
    EditOutlined, InfoOutlined,
    SettingOutlined
} from "@ant-design/icons";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/personal-data.json";
import {useFormik} from "formik";
import * as Yup from "yup";

function ProfileFamilyList() {
    const navigate = useNavigate();
    const {setIsFooterVisible, setHeaderRightIcons, setFooterContent, shouldFetch, resetFetch, isMockData, isLoading} = useApp();
    const [familyMembers, setFamilyMembers] = useState([]);
    
    const loadData = (refresh) => {
        if (isMockData) {
            const list = mockData.family_list;
            setFamilyMembers(list)
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

    const initialValues = {
        
    };

    const validationSchema = Yup.object({

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
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons('')

        setFooterContent(<PaddingBlock topBottom={true}>
            <Button type="primary"
                    block
                    htmlType="submit"
                    loading={isLoading}
                    onClick={formik.handleSubmit}>
                Add new family member
            </Button>
        </PaddingBlock>)
        
        loadData();
    }, []);

    const actions = [
        <EditOutlined key="edit" />,
        <InfoOutlined key="info"/>,
        <DeleteOutlined key="delete" />,
    ];
    
    return (
        <PaddingBlock topBottom={true}>
            <Card actions={actions} style={{ minWidth: 300 }}>
                <Card.Meta
                    avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                    title="Card title"
                    description={
                        <>
                            <p>This is the description</p>
                            <p>This is the description</p>
                        </>
                    }
                />
            </Card>
        </PaddingBlock>
    )
}

export default ProfileFamilyList
