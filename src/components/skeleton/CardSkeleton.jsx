import {Flex, Skeleton} from "antd";
import PropTypes from 'prop-types';
import {emptyArray} from "../../utils/ListUtils.jsx";
import {useApp} from "../../context/AppProvider.jsx";

export const SkeletonEnum = {
    RESERVATION: 'RESERVATION',
    STRINGING_JOB: 'STRINGING_JOB',
    EVENT: 'EVENT',
    DASHBOARD_LEAGUE: 'DASHBOARD_LEAGUE',
    MEMBER: 'MEMBER',
    ANNOUNCEMENT_ITEM: 'ANNOUNCEMENT_ITEM',
    ANNOUNCEMENT_LIST_ITEM: 'ANNOUNCEMENT_LIST_ITEM',
    DASHBOARD_ANNOUNCEMENT: 'DASHBOARD_ANNOUNCEMENT',
};

const CardSkeleton = ({type, count = 1, marginBottom = false}) => {
    const {token} = useApp();
    
    let height = 100;
    
    switch (type){
        case SkeletonEnum.MEMBER:
            height = 160;
            break;
        case SkeletonEnum.DASHBOARD_ANNOUNCEMENT:
            height = 130;
            break;
        case SkeletonEnum.RESERVATION:
            height = 140;
            break;
        case SkeletonEnum.ANNOUNCEMENT_LIST_ITEM:
            height = 180;
            break;
        case SkeletonEnum.EVENT:
            height = 145;
            break;
        case SkeletonEnum.STRINGING_JOB:
            height = 134;
            break;
    }

    if (type === SkeletonEnum.DASHBOARD_LEAGUE){
       return (
           <Flex vertical={true} gap={12}>
               <Skeleton.Button block key={index} active={true} />
               <Skeleton.Button block key={index} active={true} style={{height : `${height}px`}} />
           </Flex>
       )
    }

    if (type === SkeletonEnum.ANNOUNCEMENT_ITEM){
        return (
            <Skeleton paragraph={{ rows: 30 }} active={true}/>
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
