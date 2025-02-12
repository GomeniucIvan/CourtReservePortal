import EntityEmptyBlock from "@/components/entitycard/EntityEmptyBlock.jsx";

export const emptyBlockTypes = {
    WAIVER: 'waiver'
}

function EmptyBlock({description, type, removePadding}) {
    return (
        <EntityEmptyBlock text={description} height={80} removePadding={removePadding} />
    );
}

export default EmptyBlock;