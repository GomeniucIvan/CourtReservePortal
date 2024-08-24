import {useStyles} from "./styles.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Typography} from "antd";
import mockData from "../../mocks/reservation-data.json";
import PaddingBlock from "../../components/paddingblock/PaddingBlock.jsx";
import FormSelect from "../../form/formselect/FormSelect.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";
import {useApp} from "../../context/AppProvider.jsx";
const {Title, Text} = Typography;

function ReservationRegistration() {
    const navigate = useNavigate();
    let { id } = useParams();
    const { styles } = useStyles();
    const{isMockData, setIsFooterVisible, shouldFetch, resetFetch, setHeaderRightIcons, setIsLoading, globalStyles} = useApp();
    const [reservation, setReservation] = useState([]);
    const [reservationTypes, setReservationTypes] = useState([]);
    
    const loadData = (refresh) => {
        if (isMockData){
            const resv = mockData.create;
            setReservation(resv);
            setReservationTypes(resv.ReservationTypes);
        } else{
            alert('todo res registation')
        }

        resetFetch();
    }

    useEffect(() => {
        if (shouldFetch) {
            loadData(true);
        }
    }, [shouldFetch, resetFetch]);
    
    useEffect(() => {
        setIsFooterVisible(false);
        setHeaderRightIcons(null);

        loadData();
    }, []);

    const initialValues = {
        reservationTypeId: '',
        password: ''
    };

    const validationSchema = Yup.object({
        reservationTypeId: Yup.string().required('Reservation Type is require.')
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        validateOnBlur: true,
        validateOnChange: true,
        onSubmit: async (values, { setStatus, setSubmitting }) => {
            setIsLoading(true);

            if (isMockData){
               
            } else{
                //todo
                alert('todo verification')
            }
        },
    });
    
    return (
        <PaddingBlock topBottom={true}>
            <Title level={4} className={globalStyles.noTopPadding}>Reservation Details</Title>
            
            <FormSelect  form={formik}
                         name={`reservationTypeId`}
                         label='Reservation Type'
                         options={reservationTypes}
                         required={true}
                         propText='Name'
                         propValue='Id' />
            
        </PaddingBlock>
    )
}

export default ReservationRegistration
