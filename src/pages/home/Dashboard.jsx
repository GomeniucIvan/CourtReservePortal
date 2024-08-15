import styles from './Dashboard.module.less'
import { Button, Popup, Form, Input } from 'antd-mobile';
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    let { orgId } = useParams();
    
    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard
