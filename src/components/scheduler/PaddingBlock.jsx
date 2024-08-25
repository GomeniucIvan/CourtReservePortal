import {useApp} from "../../context/AppProvider.jsx";

function Scheduler() {
    const {globalStyles, token} = useApp();
    
    return (
        <div style={{padding: `${topBottom ? token.padding : 0}px ${leftRight ?token.padding : 0}px`}}>
            {children}
        </div>
    )
}

export default Scheduler
