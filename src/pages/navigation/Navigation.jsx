import CardLinks from "../../components/cardlinks/CardLinks.jsx";
import PaddingBlock from "../../components/paddingblock/PaddingBlock.jsx";
import {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import mockData from "../../mocks/navigation-data.json";

function Navigation(props) {
    const {setIsFooterVisible, setHeaderRightIcons, setFooterContent, isMockData, navigationLinks} = useApp();
    const [links, setLinks] = useState(navigationLinks);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');
        
        if (isMockData){
            const links = mockData.Links;
            setLinks(links);
        }
    }, []);
    
    return (
        <PaddingBlock topBottom={true} leftRight={false}>
            <CardLinks links={links}/>
        </PaddingBlock>
    )
}

export default Navigation
