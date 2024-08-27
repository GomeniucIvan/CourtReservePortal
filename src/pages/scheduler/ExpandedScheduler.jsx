import Scheduler from "../../components/scheduler/Scheduler.jsx";
import mockData from "../../mocks/scheduler-data.json";

function ExpandedScheduler() {
    const courts = mockData.courts;
    
    return (
        <Scheduler courts={courts}/>
    );
}

export default ExpandedScheduler
