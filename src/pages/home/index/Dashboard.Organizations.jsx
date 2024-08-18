import {useStyles} from "./styles.jsx";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useApp} from "../../../context/AppProvider.jsx";
import mockData from "../../../mocks/home-data.json";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ClubBusyChart = ({ dataPoints }) => {
    const lastFiveHoursData = dataPoints.slice(-10);

    const labels = lastFiveHoursData.map((_, index) => {
        const hoursAgo = 5 - Math.floor(index / 2);
        const minutes = index % 2 === 0 ? '00' : '30';
        return `${hoursAgo}h:${minutes}`;
    });

    const data = {
        labels: Array(lastFiveHoursData.length).fill(''), // Empty labels
        datasets: [
            {
                label: '', // No label for the line
                data: lastFiveHoursData,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
                pointRadius: 0, // Remove points on the line
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
                min: 0,
                max: 100,
            },
        },
        elements: {
            line: {
                borderWidth: 2,
            },
        },
    };

    return <Line data={data} options={options} />;
};

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
                    <ClubBusyChart dataPoints={organization.BusyPercentages} />
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
