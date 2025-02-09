import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";

export const emptyBlockTypes = {
    WAIVER: 'waiver'
}

function EmptyBlock({description, type}) {
    return (
        <EntityEmptyBlock text={description} height={80} />
    );
}

export default EmptyBlock;