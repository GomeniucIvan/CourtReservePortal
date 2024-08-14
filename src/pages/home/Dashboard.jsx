import styles from './Dashboard.module.less'
import { Button, Popup, Form, Input } from 'antd-mobile';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard
