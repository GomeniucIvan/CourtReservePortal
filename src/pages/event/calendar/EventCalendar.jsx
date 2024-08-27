import Scheduler from "../../../components/scheduler/Scheduler.jsx";
import {useEffect, useState} from "react";
import {Button, Segmented, Space} from "antd";
import {FilterOutlined} from "@ant-design/icons";
import {useApp} from "../../../context/AppProvider.jsx";

function EventCalendar() {
    const {setHeaderRightIcons, globalStyles} = useApp();
    const [isFilterOpened, setIsFilterOpened] = useState(false);
    const [selectedView, setSelectedView] = useState('Day');
    
    useEffect(() => {
        
        setHeaderRightIcons(
            <Space className={globalStyles.headerRightActions}>
                <Segmented
                    defaultValue={selectedView}
                    options={['Day', 'Week', 'Month', 'Agenda']}
                    onChange={(value) => {
                        setSelectedView(value);
                    }}
                />

                <Button type="default" icon={<FilterOutlined/>} size={'medium'}
                        onClick={() => setIsFilterOpened(true)}/>
            </Space>
        )
    }, []);
    
    return (
        <div>
            <Scheduler isCalendar={true} courts={[]} selectedView={selectedView}/>
        </div>
    )
}

export default EventCalendar
