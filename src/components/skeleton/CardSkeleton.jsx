import {Flex, Skeleton} from "antd";
import PropTypes from 'prop-types';
import {emptyArray} from "../../utils/ListUtils.jsx";
import {useApp} from "../../context/AppProvider.jsx";

export const SkeletonEnum = {
    RESERVATION: 'RESERVATION',
    EVENT: 'EVENT',
    LEAGUE_DASHBOARD: 'LEAGUE_DASHBOARD',
    MEMBER: 'MEMBER',
    ANNOUNCEMENT: 'ANNOUNCEMENT',
};

const CardSkeleton = ({type, count = 10, marginBottom = false}) => {
    const {token} = useApp();
    
    let height = 100;
    
    switch (type){
        case SkeletonEnum.MEMBER:
            height = 160;
            break;
        case SkeletonEnum.ANNOUNCEMENT:
            height = 130;
            break;
        case SkeletonEnum.RESERVATION:
            height = 140;
            break;
        case SkeletonEnum.EVENT:
            height = 145;
            break;
    }

    if (type === SkeletonEnum.LEAGUE_DASHBOARD){
       return (
           <Flex vertical={true} gap={12}>
               <Skeleton.Button block key={index} active={true} />
               <Skeleton.Button block key={index} active={true} style={{height : `${height}px`}} />
           </Flex>
       )
    }
    
    return (
        <>
            {emptyArray(count).map((item, index) => (
                <Skeleton.Button block key={index} active={true} style={{height : `${height}px`, marginBottom: `${marginBottom ? `${token.padding}px`: undefined}`}} />
            ))}
        </>
    )
}

CardSkeleton.propTypes = {
    type: PropTypes.oneOf(Object.keys(SkeletonEnum))
};

export default CardSkeleton;
