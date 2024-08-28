import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useApp} from "../../../context/AppProvider.jsx";
import PaddingBlock from "../../../components/paddingblock/PaddingBlock.jsx";
import {Button, Flex, Typography} from "antd";
import {useFormik} from "formik";
import * as Yup from "yup";
import mockData from "../../../mocks/event-data.json";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";

const {Title, Text} = Typography;

function EventRegistration() {
    const navigate = useNavigate();
    let {id} = useParams();
    const [event, setEvent] = useState(null);

    const {
        setIsFooterVisible,
        setHeaderRightIcons,
        setFooterContent,
        isLoading,
        setIsLoading,
        isMockData,
        shouldFetch,
        resetFetch,
        token
    } = useApp();

    const loadData = async (refresh) => {
        if (isMockData) {
            const details = mockData.details;
            setEvent(details);
        } else {
            alert('todo home index')
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
                Register
            </Button>
        </PaddingBlock>);

        loadData();
    }, []);

    const initialValues = {
        reservationTypeId: '',
    };

    const validationSchema = Yup.object({
        reservationTypeId: Yup.string().required('Reservation Type is require.'),
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

    return (
        <PaddingBlock>
            <div style={{marginBottom: `${token.padding}px`}}>
                <Title level={4} style={{marginBottom: 0}}>
                    {event?.EventName}
                </Title>
                <Text type="secondary">{event?.EventType}</Text>
            </div>

            <Flex vertical gap={4}>
                <CardIconLabel icon={'calendar'} description={event?.DisplayFirstAndLastDates}/>
                <CardIconLabel icon={'clock'} description={event?.OccurrenceTimesDisplay}/>
                <CardIconLabel icon={'price-tag'} description={event?.CostDisplay}/>
            </Flex>

        </PaddingBlock>
    )
}

export default EventRegistration
