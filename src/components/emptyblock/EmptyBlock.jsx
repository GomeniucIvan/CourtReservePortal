import {Empty} from "antd";

export const emptyBlockTypes = {
    WAIVER: 'waiver'
}

function EmptyBlock({description, type}) {

    return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
    );
}

export default EmptyBlock;