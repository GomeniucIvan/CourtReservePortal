import CardLinks from "../../components/cardlinks/CardLinks.jsx";
import PaddingBlock from "../../components/paddingblock/PaddingBlock.jsx";
import {useEffect, useState} from "react";
import {useApp} from "../../context/AppProvider.jsx";
import mockData from "../../mocks/navigation-data.json";

function Navigation(props) {
    const {setIsFooterVisible, setHeaderRightIcons, setFooterContent} = useApp();
    const [navigationLinks, setNavigationLinks] = useState([]);
    
    useEffect(() => {
        setIsFooterVisible(true);
        setHeaderRightIcons(null);
        setFooterContent('');
        
        const links = mockData.Links;
        setNavigationLinks(links);
    }, []);
    
    
    return (
        <PaddingBlock topBottom={true} leftRight={false}>
            <CardLinks links={navigationLinks}/>
        </PaddingBlock>
    )
}

export default Navigation
