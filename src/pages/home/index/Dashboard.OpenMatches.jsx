import { equalString } from "../../../utils/Utils.jsx";
import EntityCard from "../../../components/entitycard/EntityCard.jsx";
import {Segmented} from "antd";
import {Card, ErrorBlock, NoticeBar} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import {useState} from "react";

const DashboardOpenMatches = ({ dashboardData, isFetching }) => {
    let showOpenMatches = dashboardData?.ShowOpenMatches;
    let openMatches = dashboardData?.OpenMatches;
    const { styles } = useStyles();
    let [selectedSegment, setSelectedSegment] = useState('Registered');

    // if (!toBoolean(showOpenMatches)){
    //     return '';
    // }

    return (
        <EntityCard title={'Open Matches'} link={'/openMatches'} isFetching={isFetching} addPadding={true}>
            <>
                <NoticeBar content='if no any registered move to following if no any to all' color='info' />
                <Card className={styles.segmentCard}>
                    <Segmented
                        options={['Registered', 'Following', 'All']}
                        block
                        onChange={(value) => {
                            setSelectedSegment(value);
                        }}
                    />
                    {equalString(selectedSegment, 'Registered') &&
                        <>
                            <ErrorBlock status='empty' title='You dont registered to any open matches' description={''} />
                        </>
                    }
                    {equalString(selectedSegment, 'Following') &&
                        <>
                            <ErrorBlock status='empty'
                                        title='You dont registered to any open matches'
                                        description={'Here will be open matches from followed players'} />
                        </>
                    }

                    {equalString(selectedSegment, 'All') &&
                        <>
                            todo
                        </>
                    }
                </Card>
            </>
        </EntityCard>
    );
};

export default DashboardOpenMatches
