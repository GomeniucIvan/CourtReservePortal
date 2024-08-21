import {DotLoading, InfiniteScroll as IScroll} from "antd-mobile";

const InfiniteScroll = ({loadMore, hasMore }) =>{
    return (
        <>
            <IScroll loadMore={loadMore} hasMore={hasMore}>
                {hasMore ? (
                    <>
                        <span>Loading</span>
                        <DotLoading />
                    </>
                ) : (
                    <></>
                )}
            </IScroll>
        </>
    )
}

export default InfiniteScroll
