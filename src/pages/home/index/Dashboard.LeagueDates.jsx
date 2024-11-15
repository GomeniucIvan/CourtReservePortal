import {anyInList, getValueOrDefault, isNullOrEmpty, toBoolean} from "../../../utils/Utils.jsx";
import {SlickSlider} from "../../../components/slickslider/SlickSlider.jsx";
import {Skeleton, Typography} from "antd";
import {Card} from "antd-mobile";
import CardIconLabel from "../../../components/cardiconlabel/CardIconLabel.jsx";
import {cx} from "antd-style";
import {Ellipsis} from "antd-mobile";
import {useStyles} from "./styles.jsx";
import {useApp} from "../../../context/AppProvider.jsx";
const { Title } = Typography;

const ModernDashboardLeaguesDates = ({ leaguesDates, isFetching }) => {
    const {globalStyles} = useApp();
    const { styles } = useStyles();
    
    if (!anyInList(leaguesDates)){
        return '';
    }
    
    const buildDashboardOptInButton = () => {
        return '';
    }
    
    return (
        <SlickSlider>
            {leaguesDates.map((leagueSessionDate, index) => (
                <div key={index}>
                    <Card className={cx(globalStyles.card, globalStyles.clickableCard)} onClick={() => navigate(`/league/details/${leagueSessionDate.Id}`)}>
                        <Title level={1} className={globalStyles.noTopPadding}>
                            <CardIconLabel icon={'paddle'} description={`Game Day #${leagueSessionDate.GameDayNumber}`} />
                        </Title>

                        <CardIconLabel icon={'calendar-time'} description={leagueSessionDate.DisplayStartEndTime} />
                        {(!isNullOrEmpty(leagueSessionDate.PriceToPay) && leagueSessionDate.PriceToPay > 0) &&
                            <CardIconLabel icon={'money'} description={leagueSessionDate.PriceDisplay} />
                        }

                        <CardIconLabel icon={'rec'} description={leagueSessionDate.PlayingDisplay} size={20}/>

                        {!isNullOrEmpty(leagueSessionDate.ClosedMessage) &&
                            <CardIconLabel icon={'message'} description={leagueSessionDate.ClosedMessage} iconColor={'red'} />
                        }
                    </Card>
                </div>
            ))}
        </SlickSlider>
    );
};

export default ModernDashboardLeaguesDates
