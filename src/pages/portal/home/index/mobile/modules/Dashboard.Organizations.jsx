import {useStyles} from ".././styles.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useApp} from "@/context/AppProvider.jsx";
import mockData from "@/mocks/home-data.json";

function DashboardOrganizations({orgId = 6969, selectedOrganization, setSelectedOrganization}) {
    const [organizations, setOrganizations] = useState([]);
    const { isLoading, setIsLoading, isMockData, setIsFooterVisible } = useApp();
    const { styles } = useStyles();
    
    useEffect(() => {
        if (isMockData){
            const organizations = mockData.dashboard.organizations;
            setOrganizations(organizations);

            const orgInList = organizations.find(org => org.Id === orgId);
            setSelectedOrganization(orgInList)
        } else{
            alert('todo home index')
        }
    }, []);

    
    return (
        <div>
            {organizations.map((organization) => (
                <div key={organization.Id} className={styles.organizationContainer}>
                    <h2>{organization.Name}</h2>
                </div>
            ))}
            
            {/*{selectedOrganization &&*/}
            {/*    <>*/}
            {/*        <ClubBusyChart dataPoints={selectedOrganization.BusyPercentages} />*/}
            {/*    </>*/}
            {/*}*/}
        </div>
    )
}

export default DashboardOrganizations
