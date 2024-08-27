import Scheduler from "../../components/scheduler/Scheduler.jsx";
import mockData from "../../mocks/scheduler-data.json";
import {useApp} from "../../context/AppProvider.jsx";

function ExpandedScheduler() {
    const {availableHeight} = useApp();
    const courts = mockData.courts;
    
    return (
       <>
           <Scheduler courts={courts} height={availableHeight}/>
       </>
    );
}

export default ExpandedScheduler
