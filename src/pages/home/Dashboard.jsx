﻿import styles from './Dashboard.module.less'
import { Button, Popup, Form, Input } from 'antd-mobile';
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    let { orgId } = useParams();
    
    return (
        <div>
            <Button block color='primary' size='large' onClick={() => navigate(`/event-list/${orgId}`)}>
                Events
            </Button>
            <Button block color='primary' size='large' onClick={() => navigate(`/scheduler/${orgId}`)}>
                Scheduler
            </Button>
            
        </div>
    )
}

export default Dashboard