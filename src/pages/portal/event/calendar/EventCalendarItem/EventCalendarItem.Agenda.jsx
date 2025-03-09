import React, {useState} from 'react';
import {useApp} from "@/context/AppProvider.jsx";
import {useNavigate} from "react-router-dom";
import {theme} from "antd";
import {useAuth} from "@/context/AuthProvider.jsx";
const { useToken } = theme;

const EventCalendarItemAgenda = (props) => {
    const {setDynamicPages} = useApp();
    const {authData} = useAuth();
    const navigate = useNavigate();
    const dataItem = props.dataItem;
    const { token } = useToken();

    return (
       <>
       
       </>
    );
};


export default EventCalendarItemAgenda;